const express = require("express");
const router = express.Router();

const {} = require("../utils/mailSender");

// Routes

router.post("/contact-us-submit",contactFormEmailTemplate);