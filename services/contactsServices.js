import { Contact } from "../models/contactModel.js";

async function listContacts(limit = 10, page = 0, params = {}) {
  const data = await Contact.find(params)
    .limit(limit)
    .skip(page * limit);
  return data;
}

async function getContactById(id) {
  const result = await Contact.findById(id);
  return result;
}

async function addContact(contactInfo) {
  const newContact = await Contact.create(contactInfo);
  return newContact;
}

async function removeContact(id) {
  const result = await Contact.findByIdAndDelete(id);
  return result;
}

async function updateById(contactId, data) {
  const result = await Contact.findByIdAndUpdate(contactId, data, {
    new: true,
  });
  return result;
}

async function updateContactFavoriteStatus(id, data) {
  const { favorite } = data;
  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );
  return result;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
  updateContactFavoriteStatus,
};
