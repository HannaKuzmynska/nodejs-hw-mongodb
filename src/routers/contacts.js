import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import { contactJoiSchema } from '../validation/contactValidation.js';
import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { upload } from '../middlewares/multer.js';
const router = Router();
router.use(authenticate);
router.get('/', ctrlWrapper(contactsController.getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(contactsController.getContactById));
router.post(
  '/',
  upload.single('photo'),
  validateBody(contactJoiSchema),
  ctrlWrapper(contactsController.createContact)
);
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'), 
  validateBody(contactJoiSchema),
  ctrlWrapper(contactsController.updateContact)
);
router.delete('/:contactId', isValidId, ctrlWrapper(contactsController.deleteContact));
export default router;
