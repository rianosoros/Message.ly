const express = require("express");
const User = require("../models/user");
const createToken = require("../helpers/createToken");
const ExpressError = require("../expressError");

const router = new express.Router();

/** POST /login - login: {username, password} => {token} */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
      const token = createToken(username);
      return res.json({ token });
    } else {
      throw new ExpressError("Invalid username/password", 401);
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token. */
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    await User.updateLoginTimestamp(user.username);
    const token = createToken(user.username);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
