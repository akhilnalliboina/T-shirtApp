const Category = require("../models/catergory");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      res.status(400).json({
        error: "Category not found in db",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      res.send(400).json({
        error: "cannot create category in to DB",
      });
    }
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      res.send(400).json({
        error: "cannot get all categories",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      res.status(400).json({
        error: "category cannot be updated",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, removedCategory) => {
    if (err) {
      res.status(400).json({
        error: "Failed to remove category from db",
      });
    }
    res.json({
      message: `Successfully deleted ${removedCategory.name} category`,
    });
  });
};
