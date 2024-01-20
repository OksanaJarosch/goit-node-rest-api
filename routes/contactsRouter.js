const express = require("express");
const {  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact
} = require("../controllers/contactsControllers.js");
const validateBody = require("../helpers/validateBody.js");
const {createContactSchema} = require("../schemas/contactsSchemas.js");

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", updateContact);


module.exports = contactsRouter;