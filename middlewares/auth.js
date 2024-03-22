import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token 1" });
  }

  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token 2" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      }

      return res.status(401).send({ message: "Invalid token 3" });
    }

    const user = await User.findById(decode.id);

    // if (user === null) {
    //   return res.status(401).send({ message: "Invalid token 4" });
    // }

    if (!user) {
      return res.status(401).send({ message: "Invalid token 4" });
    }

    if (user.token !== token) {
      return res.status(401).send({ message: "Invalid token 5" });
    }

    req.user = {
      _id: decode.id,
      email: decode.email,
    };

    // req.user = user;

    return next();
  });
}

export default auth;
