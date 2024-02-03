const {HttpError} = require("../helpers");
const Contact = require("../models/contact.js")
const { ctrlWrapper } = require("../helpers");

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const result = await Contact.find({owner}, "-createdAt, -updatedAt", {skip, limit});
    res.json(result);
};

const getOneContact = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;

    const result = await Contact.findOne({ _id, owner});
        if (!result) {
            throw HttpError(404);
    }
    res.json(result);
};

const deleteContact = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;

    const result = await Contact.findOneAndDelete({ _id, owner});
        if (!result) {
            throw HttpError(404);
    }
    res.json(result);
};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;

        const result = await Contact.create({...req.body, owner});
        if (!result) {
            throw HttpError(404);
    }
    res.status(201).json(result);
};

const updateContact = async (req, res) => { 
    const { id: _id } = req.params;
    const { _id: owner } = req.user;

    const result = await Contact.findOneAndUpdate({ _id, owner}, req.body, {new: true});
        if (!result) {
            throw HttpError(404);
    }
    res.status(200).json(result);
};

const updateStatusContact = async (req, res) => { 
    const { id: _id } = req.params;
    const { _id: owner } = req.user;

    const result = await Contact.findOneAndUpdate({ _id, owner}, req.body, {new: true});
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
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact)
};
