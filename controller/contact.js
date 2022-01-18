const mongoose = require('mongoose');
const Contact = require('../models/contact');
const sendEmail = require('../utils/email');

const addContact = async (req, res) => {
  try {
    // const contact = await Contact.addContact(req);

    const contact = 'Hello';
    await sendEmail({
      email: req.body.email,
      subject: 'Message recieved',
      text: req.body.message,
    });

    await sendEmail({
      email: 'creator@merchpals.com',
      subject: 'Message recieved',
      text: req.body.message,
    });

    res.status(200).json({ contact, message: 'Contact added successfully' });
  } catch (error) {
    console.log('add contact controller', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addContact,
};
