import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "../db/contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function getContactById(id) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === id);
  return contact || null;
}

async function addContact(contactInfo) {
  const getAll = await listContacts();
  const randomId = randomBytes(16).toString("hex");
  const newContact = { id: randomId, ...contactInfo };
  getAll.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(getAll, null, 2));

  return newContact;
}

async function removeContact(id) {
  const getAll = await listContacts();
  const index = getAll.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const [result] = getAll.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(getAll, null, 2));
  return result;
}

async function updateById(contactId, data) {
  const AllContacts = await listContacts();
  const index = AllContacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    console.log("Contact with such ID is not found!");
    return null;
  }
  AllContacts[index] = { id: contactId, ...data };
  await fs.writeFile(contactsPath, JSON.stringify(AllContacts, null, 2));
  console.log(`Contact with ID ${contactId} successfully updated!`);
  return AllContacts[index];
}

export { listContacts, getContactById, removeContact, addContact, updateById };
