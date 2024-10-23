import mongoose from 'mongoose';
export const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 3,
    maxlength: 20,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],
    required: true,
    default: 'personal',
  },
}, { timestamps: true, versionKey: false });
const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
