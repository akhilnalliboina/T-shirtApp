const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      res.status(400).json({
        error: "Product not found",
      });
    }
    req.product = product;
    next();
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("content-Type", req.product.photo.contentType);
    res.send(req.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    //check for the fields
    const { name, price, description, category, stock } = fields;
    if (!name || !price || !description || !category || !stock) {
      return res.status(400).json({
        error: "Provide all the fields",
      });
    }
    //handle file
    const product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //save product
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving product failed in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.removeProduct = (req, res) => {
  const product = req.product;
  product.remove((err, deletedproduct) => {
    if (err) {
      res.status(400).json({
        error: `Deletion of the product failed`,
        product,
      });
    }
    res.json({
      message: "Product is deleted",
      deletedproduct,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    //updation product
    const product = req.product;
    product = _.extend(product, fields);

    //handle file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save product
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updating product failed in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          error: "Fetching products failed",
        });
      }
      res.json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let operations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { stock: -product.count, sold: +product.count },
      },
    };
  });
  product.bulkWrite(operations, {}, (err, products) => {
    if (err) {
      res.status(400).json({
        error: "Updating stock and sold failed",
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      res.status(400).json({
        error: "Not able to get all unique categories",
      });
    }
    res.json({ categories });
  });
};
