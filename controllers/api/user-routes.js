const router = require("express").Router();
const { User } = require("../../models");

// CREATE new user - handling signup
router.post("/signup", async (req, res) => {
  try {
    await console.log(req.body);
    const dbuserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(dbUserData);
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;

      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
