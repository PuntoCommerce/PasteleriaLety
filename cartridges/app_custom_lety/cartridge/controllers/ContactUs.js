'use strict';

/**
 * @namespace ContactUs
 */

var server = require('server');
var URLUtils = require('dw/web/URLUtils');


function validateEmail(email) {
  var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
  return regex.test(email);
}

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

server.post('Create', function (req, res, next) {
  var Resource = require('dw/web/Resource');
  var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
  var Transaction = require('dw/system/Transaction');
  var CustomObjectMgr = require('dw/object/CustomObjectMgr');
  const { storeContact } = require("~/cartridge/scripts/helpers/contact");
  var rr;

  const email = req.form.emailId;
  const firstName = req.form.firstName;
  const lastName = req.form.lastName;
  const comments = req.form.comments;
  const subject = req.form.tema;
  const subTheme = req.form.temaChild;

  try {
    const response = storeContact({
      email,
      firstName,
      lastName,
      comments,
      subject,
      subTheme
    })
    
    res.json({response: response})
  } catch (error) {
    rr = error;
  }
  res.json({
    success: true,
    msg: Resource.msg('subscribe.email.success', 'homePage', null),
    url: URLUtils.url('Account-Show').toString()
  });

  next();
});


module.exports = server.exports();
