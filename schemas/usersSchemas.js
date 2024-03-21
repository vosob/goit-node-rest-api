import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).required(),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});
