import createError from 'http-errors';
import mongoose from 'mongoose';
const { NotFound } = createError;

import * as contactsService from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.getAll();
    res.json({ status: 200, data: contacts });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    // Перевірка на валідність ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next(new NotFound('Contact not found'));
    }

    const contact = await contactsService.getById(contactId);
    if (!contact) {
      throw new NotFound('Contact not found');
    }
    res.json({ status: 200, data: contact });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    // Перевірка на валідність ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next(new NotFound('Contact not found'));
    }

    const updatedContact = await contactsService.update(contactId, req.body);
    if (!updatedContact) {
      throw new NotFound('Contact not found');
    }
    res.json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    // Перевірка на валідність ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next(new NotFound('Contact not found'));
    }

    const deleted = await contactsService.deleteContact(contactId);
    if (!deleted) {
      throw new NotFound('Contact not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
