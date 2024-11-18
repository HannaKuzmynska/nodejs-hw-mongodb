import * as contactsService from '../services/contacts.js';
import createHttpError from 'http-errors';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const filters = { userId: req.user._id };

    if (type) filters.contactType = type;
    if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

    const result = await contactsService.getAll(
      Number(page),
      Number(perPage),
      sortBy,
      sortOrder,
      filters
    );

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact found',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const photo = req.file;
    let photoUrl;

    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const newContact = await contactsService.create({
      ...req.body,
      userId: req.user._id,
      ...(photoUrl && { photoPath: photoUrl }),
    });

    res.status(201).json({
      status: 'success',
      message: 'Contact successfully created',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;
    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }
    const updateData = {
      ...req.body,
      ...(photoUrl && { photoPath: photoUrl }),
    };
    Object.keys(updateData).forEach(
      key => (updateData[key] === undefined || updateData[key] === '') && delete updateData[key]
    );
    if (Object.keys(updateData).length === 0) {
      throw createHttpError(400, 'No fields to update');
    }

    const updatedContact = await contactsService.update(contactId, req.user._id, updateData);

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact successfully updated',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await contactsService.remove(contactId, req.user._id);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
