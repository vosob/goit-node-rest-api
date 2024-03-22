import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateById,
  updateContactFavoriteStatus,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  const { limit, page, ...rest } = req.query ?? {};
  const { _id: owner } = req.user ?? {};
  try {
    const result = await listContacts(limit, page, { owner, ...rest });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { _id: owner } = req.user ?? {};
  try {
    const { id } = req.params;
    const result = await getContactById(id, owner);
    if (!result) {
      throw HttpError(404);
    }

    if (result.owner.toString() !== owner) {
      throw HttpError(403, "You are not authorized to view this contact");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    if (contact.owner.toString() !== owner) {
      throw HttpError(403, "You are not authorized to delete this contact");
    }

    const result = await removeContact(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user ?? {};

    const result = await addContact({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const { name, email, phone } = req.body;

    const resultId = await getContactById(id);
    if (!resultId) {
      throw HttpError(404);
    }
    console.log(req.user);

    if (req.user._id !== resultId.owner.toString()) {
      throw HttpError(403, "You are not authorized to update this contact");
    }

    const result = await updateById(
      { _id: id, owner },
      {
        name: name || resultId.name,
        email: email || resultId.email,
        phone: phone || resultId.phone,
      }
    );
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user ?? {};
    const result = await updateContactFavoriteStatus(
      { _id: id, owner },
      req.body
    );

    if (!result) {
      throw HttpError(404);
    }

    if (result.owner.toString() !== owner) {
      throw HttpError(403, "You are not authorized to delete this contact");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
