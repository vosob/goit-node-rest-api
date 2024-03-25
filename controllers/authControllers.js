import * as Joi from "../schemas/usersSchemas.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import nodemailer from "nodemailer";
import crypto from "node:crypto";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

async function register(req, res, next) {
  const user = req.body;
  const valid = Joi.registerSchema.validate(user);

  if (valid.error !== undefined) {
    return res.status(400).send({ message: "Register error" });
  }

  const normalizedEmail = user.email.toLowerCase();

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser !== null) {
      return res.status(409).send({ message: "User already registered" });
    }
    const avatarURL = gravatar.url(user.email);
    const passwordHash = await bcrypt.hash(user.password, 10);
    const verifyToken = crypto.randomUUID();

    // sendEmail
    await transport.sendMail({
      to: user.email,
      from: "osobskyi.vlad@gmail.com",
      subject: "Welcome to your contacts",
      html: `To confirm you registration please click on the <a href="http://localhost:3000/users/verify/${verifyToken}">link</a>`,
      text: `To confirm you registration please open the link http://localhost:3000/users/verify/${verifyToken}`,
    });

    const newUser = await User.create({
      email: normalizedEmail,
      // verifyToken,
      verificationToken: verifyToken,
      password: passwordHash,
      avatarURL,
    });

    const result = {
      user: {
        email: newUser.email,
        subscription: "starter",
        avatarURL: newUser.avatarURL,
      },
    };

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user === null) {
      console.log("Email");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    if (user.verify === false) {
      return res.status(401).send({ message: "Your account is not verified" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user.id, { token });

    const result = {
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };

    res.send(result);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function userInfo(req, res, next) {
  const { id, email, subscription } = req.user ?? {};
  console.log(req.user);

  res.status(200).send({ email, subscription });
}

async function updateSubscription(req, res) {
  const { _id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription: subscription });

  res.json({ subscription });
}

async function verify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken: verificationToken });

    if (user === null) {
      return res.status(404).send({ message: "Not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.send({ message: "Email confirm succesfully" });
  } catch (error) {
    next(error);
  }
}

async function resendVerify(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user === null) {
      return res.status(404).send({ message: "Not found" });
    }

    if (user.verify) {
      return res.status(400).send({ message: "Your account verified" });
    }

    await transport.sendMail({
      to: user.email,
      from: "osobskyi.vlad@gmail.com",
      subject: "Welcome to your contacts",
      html: `To confirm you registration please click on the <a href="http://localhost:3000/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm you registration please open the link http://localhost:3000/users/verify/${user.verificationToken}`,
    });
    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  userInfo,
  updateSubscription,
  verify,
  resendVerify,
};
