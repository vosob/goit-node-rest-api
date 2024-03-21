import * as Joi from "../schemas/usersSchemas.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function register(req, res, next) {
  const user = req.body;
  const valid = Joi.registerSchema.validate(user);

  if (valid.error !== undefined) {
    return res.status(400).send({ message: "Register error" });
  }

  const normalizedEmail = user.email.toLowerCase();

  try {
    const newUser = await User.findOne({ email: normalizedEmail });
    if (newUser !== null) {
      return res.status(409).send({ message: "User alredy registered" });
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    await User.create({
      newUser,
      email: normalizedEmail,
      password: passwordHash,
    });

    res.status(201).send({ message: "Registration successfully" });
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

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user.id, { token });

    res.send({ token: token });
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
  const { id, email, subscription } = req.user;

  res.status(200).send({ email, id, subscription });
}

async function updateSubscription(req, res) {
  const { _id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription: subscription });

  res.json({ subscription });
}

export default { register, login, logout, userInfo, updateSubscription };
