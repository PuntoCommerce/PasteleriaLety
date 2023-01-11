"use strict";

const CustomObject = require("dw/object/CustomObjectMgr");
const Transaction = require("dw/system/Transaction");
const Logger = require("dw/system/Logger");

const uuid = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

const storeContact = (contact) => {
  Transaction.begin();
  try {
    if (contact.email != undefined && contact.firstName != undefined
      && contact.lastName != undefined && contact.comments != undefined
      && contact.subject != null) {

      let object = CustomObject.createCustomObject("contact_us", uuid());

      object.custom.email = contact.email;
      object.custom.firstName = contact.firstName;
      object.custom.lastName = contact.lastName;
      object.custom.comment = contact.comments;
      object.custom.subject = contact.subject;
      object.custom.subTheme = contact.subTheme;
    }

    // object.custom.is_visible = true;

    return { error: false };
  } catch (error) {
    const err = error.message;
    logger.console.warn("Error: " + error.message);
    return { error: true, message: error.message };
  }

  Transaction.commit();
};

module.exports = { storeContact: storeContact };