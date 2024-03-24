import express from "express";
// import UserController from "../controllers/userController.js";
import { uploadAvatar } from "../controllers/userController.js";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";

const userAvatarRouter = express.Router();

// router.get("/avatar", UserController.getAvatar);
userAvatarRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);

export default userAvatarRouter;
