const contactsService = require("../services/contactsServices.js");
//{ listContacts, getContactById, removeContact, addContact };
const ctrlWrapper = require("../helpers/ctrlWrapper.js")

const getAllContacts = (req, res) => {};

const getOneContact = (req, res) => {};

const deleteContact = (req, res) => {};

const createContact = (req, res) => {};

const updateContact = (req, res) => { };

module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact)
};
