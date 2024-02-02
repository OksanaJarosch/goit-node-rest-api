const express = require("express");
const {  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} = require("../controllers/contactsControllers.js");
const {validateBody} = require("../helpers");
const { createContactSchema, updateContactSchema, updateFavoriteSchema } = require("../schemas/contactsSchemas.js");
const { isValidId } = require("../middlewares");
const { authenticate } = require("../middlewares");


const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favor  ite", isValidId, validateBody(updateFavoriteSchema), updateStatusContact);


module.exports = contactsRouter;