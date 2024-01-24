const contactsService = require("../services/contactsServices.js");
const {HttpError} = require("../helpers");
const Contact = require("../models/contact.js")
const { ctrlWrapper } = require("../helpers");

const getAllContacts = async ( _, res) => {
    const result = await Contact.find();
    res.json(result);
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
        if (!result) {
            throw HttpError(404);
    }
    res.json(result);
};

const deleteContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
        if (!result) {
            throw HttpError(404);
    }
    res.json(result);
};

const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
        const result = await contactsService.addContact(name, email, phone);
        if (!result) {
            throw HttpError(404);
    }
    res.status(201).json(result);
};

const updateContact = async (req, res) => { 
    const { id } = req.params;

    const result = await contactsService.updateContact(id, req.body);
        if (!result) {
            throw HttpError(404);
    }
    res.status(200).json(result);
};

module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact)
};
