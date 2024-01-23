const express = require("express");
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const ExpressError = require("../expressError");

const router = new express.Router();

/** GET /:id - get detail of message. */
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST / - post message. */
router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const message = await Message.create(req.username, to_username, body);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST/:id/read - mark message as read. */
router.post("/:id/read", ensureCorrectUser, async (req, res, next) => {
  try {
    const message = await Message.markAsRead(req.params.id, req.username);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
