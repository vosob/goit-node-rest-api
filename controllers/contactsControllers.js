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
  try {
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    await addContact({ ...req.body, owner });
    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const resultId = await getContactById(id);
    if (!resultId) {
      throw HttpError(404);
    }
    const result = await updateById(id, {
      name: name || resultId.name,
      email: email || resultId.email,
      phone: phone || resultId.phone,
    });
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateContactFavoriteStatus(id, req.body);

    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
