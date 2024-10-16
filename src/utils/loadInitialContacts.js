import path from 'path';
import { promises as fs } from 'fs';
import Contact from '../models/contact.js';

export const loadInitialContacts = async () => {
  try {
    const filePath = path.resolve('./contacts.json');
    const contactsData = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const existingContacts = await Contact.find();

    if (existingContacts.length === 0) {
      await Contact.insertMany(contactsData);
      console.log("Initial contacts loaded successfully!");
    } else {
      console.log("Contacts are already present in the database.");
    }
  } catch (error) {
    console.error("Error loading initial contacts:", error);
  }
};
export default loadInitialContacts;
