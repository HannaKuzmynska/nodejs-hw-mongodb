import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
  photo: {
    type: String,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true, versionKey: false });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
