import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactsController.js';

const router = express.Router();

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Public
router.get('/', getContacts);

// @route   GET /api/contacts/:id
// @desc    Get a contact by ID
// @access  Public
router.get('/:id', getContactById);

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Public
router.post('/', createContact);

// @route   PUT /api/contacts/:id
// @desc    Update a contact by ID
// @access  Public
router.put('/:id', updateContact);

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact by ID
// @access  Public
router.delete('/:id', deleteContact);

export default router;
