const { Order, ProductCard } = require("../models/order");

exports.getByOrderId = (req, res, next, id) => {
  Order.findById(id).populate("products.product", "name price");
  exec((err, order) => {
    if (err) {
      res.status(400).json({
        error: "Not able to fetch order",
      });
    }
    req.order = order;
    next();
  });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.user;
  const order = new Order(req.body);
  order.save((err, order) => {
    if (err) {
      res.status(400).json({
        error: "Order failed to save in DB",
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        res.status(400).json({
          error: "No orders found in DB",
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        res.status(400).json({
          error: "Cannot update order status",
        });
      }
      res.json(order);
    }
  );
};
