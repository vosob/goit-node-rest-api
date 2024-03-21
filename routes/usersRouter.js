import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} from "../schemas/usersSchemas.js";
import authController from "../controllers/authControllers.js";
import auth from "../middlewares/auth.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  authController.register
);

usersRouter.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  authController.login
);

usersRouter.patch(
  "/",
  auth,
  validateBody(subscriptionSchema),
  authController.updateSubscription
);

usersRouter.post("/logout", auth, authController.logout);
usersRouter.get("/current", auth, authController.userInfo);

export default usersRouter;
