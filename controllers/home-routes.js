const router = require("express").Router();
const { Blog, Comment, User } = require("../models");
const withAuth = require("../utils/auth");

// GET all blogs for homepage
router.get("/", async (req, res) => {
  try {
    const dbBlogData = await Blog.findAll({
      include: [
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));
    res.render("homepage", {
      blogs,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one blog only, and by id
router.get("/blog/:id", withAuth, async (req, res) => {
  // If the user is logged in, allow them to view the blog
  try {
    const dbBlogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });
    if (dbBlogData) {
      const blog = dbBlogData.get({ plain: true });
      res.render("blog", { blog, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ message: "No Blog found with that id!" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Post Comment on a blog post
router.post("/api/blog/:id", withAuth, async (req, res) => {
  try {
    // retrieve the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      try {
        const dbCommentData = await Comment.create({
          blog_id: req.params.id,
          description: req.body.comment,
          user_id: dbUserData.id,
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;

          res.status(200).json(dbCommentData);
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Dashboard
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // find  the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      try {
        const dbBlogData = await Blog.findAll({
          where: {
            user_id: dbUserData.id,
          },
          order: [["createdAt", "DESC"]],
        });
        let blogs = {};
        if (dbBlogData) {
          blogs = dbBlogData.map((blog) => blog.get({ plain: true }));
        }
        res.render("dashboard", { blogs, loggedIn: req.session.loggedIn });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create Blog Post
router.post("/dashboard", withAuth, async (req, res) => {
  try {
    // retrieve the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      try {
        const dbBlogData = await Blog.create({
          title: req.body.title,
          description: req.body.description,
          user_id: dbUserData.id,
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;

          res.status(200).json(dbBlogData);
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
