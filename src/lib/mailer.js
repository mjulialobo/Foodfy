const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "57da93477bb7e0",
    pass: "72d327ddcf2083",
  },
});
