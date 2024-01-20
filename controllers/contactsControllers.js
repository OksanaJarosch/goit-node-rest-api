const contactsService = require("../services/contactsServices.js");
const {HttpError} = require("../helpers");

const { ctrlWrapper } = require("../helpers");

const getAllContacts = async ( _, res) => {
    const result = await contactsService.listContacts();
    res.json(result);
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
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
    const { name, email, phone } = req.body;
    if (!(name || email || phone)) {
        throw HttpError(400, "Body must have at least one field");
    }
    
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
