import mongoose from 'mongoose';
import createError from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(new createError.NotFound('Invalid ID'));
  }
  next();
};

export default isValidId;
