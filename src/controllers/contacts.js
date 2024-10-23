import * as contactsService from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite
    } = req.query;

    const filters = {};
    if (type) filters.contactType = type;
    if (isFavourite) filters.isFavourite = isFavourite === 'true';
    
    if (req.query.name) {
      filters.name = req.query.name;
    }

    console.log('Filters:', filters);

    const result = await contactsService.getAll(
      Number(page),
      Number(perPage),
      sortBy,
      sortOrder,
      filters
    );

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.json({
      status: 200,
      message: 'Successfully found the contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
