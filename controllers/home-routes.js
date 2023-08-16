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
