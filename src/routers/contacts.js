import express from 'express';
import * as contactsController from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { contactJoiSchema } from '../validation/contactValidation.js';
import isValidId from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', ctrlWrapper(contactsController.getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(contactsController.getContactById));
router.post('/', validateBody(contactJoiSchema), ctrlWrapper(contactsController.createContact));
router.patch('/:contactId', isValidId, validateBody(contactJoiSchema), ctrlWrapper(contactsController.updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;
