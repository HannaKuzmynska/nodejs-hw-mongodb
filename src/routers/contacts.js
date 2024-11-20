import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactsController,
  patchContactController,
  deleteContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  upload.single('photo'),
  (req, res, next) => {
    console.log('File:', req.file); // Перевіряємо файл
    console.log('Body:', req.body); // Перевіряємо тіло запиту
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    next();
  },
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactsController));

export const contactsRouter = router;
