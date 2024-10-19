import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
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
  }
}, { timestamps: true, versionKey: false });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
