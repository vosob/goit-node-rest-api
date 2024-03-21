import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import validateParams from "../helpers/validateParams.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
  getFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import isValidObjId from "../helpers/IDvalidate.js";
import auth from "../middlewares/auth.js";

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  auth,
  validateParams(getFavoriteSchema),
  getAllContacts
);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post(
  "/",
  auth,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidObjId,
  validateBody(updateFavoriteSchema),
  updateContactStatus
);

export default contactsRouter;
