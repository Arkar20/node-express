const express = require("express");
const router = express.Router();

const { Order } = require("../schema/order");
const { OrderItem } = require("../schema/orderitems");
const Product = require("../schema/product");
router.get("", async (req, res) => {
  try {
    const result = await Order.find()
      .populate("user")
      .populate({
        path: "orderitems",
        populate: { path: "product", select: "name " },
      });
    res.json(result);
  } catch (err) {
    return res.status(500).json({ err, msg: "Server Error" });
  }
});

router.get("/totalsales", async (req, res) => {
  try {
    const totalSale = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalsales: { $sum: "$totalAmount" },
        },
      },
    ]);

    if (!totalSale) return res.status(404).json({ msg: "No Order Yet" });

    return res.json({ totalSale: totalSale.pop().totalsales });
  } catch (err) {
    return res.status(500).json({ err, msg: "Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const result = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderitems",

        populate: { path: "product", select: "name " },
      });
    if (!result) return res.status(404).json({ msg: "Order Not Found" });
    res.json(result);
  } catch (err) {
    return res.status(500).json({ err, msg: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    res.json(result);
  } catch (err) {
    return res.status(500).json({ err, msg: "Order Not Found" });
  }
});

router.post("/", async (req, res) => {
  let totalPriceServer = 0;

  const orderitemids = Promise.all(
    req.body.orderItems.map(async (item) => {
      let singleneworder = new OrderItem({
        product: item.product,
        qty: item.qty,
      });
      const createorderitem = await singleneworder.save();

      // cal the total amount
      const product = await Product.findById(createorderitem.product);
      totalPriceServer += product.price * singleneworder.qty;

      return createorderitem._id;
    })
  );
  const orderitems = await orderitemids;

  // one way of configuring total amount
  // const orderPrices = await Promise.all(
  //   await orderitems.map(async (item_id) => {
  //     const ordersigleitem = await OrderItem.findById(item_id).populate(
  //       "product"
  //     );
  //     return ordersigleitem.product.price * ordersigleitem.qty;
  //   })
  // );
  // totalPriceServer = orderPrices.reduce((price, total) => price + total);

  //get order data
  const { user, shippingaddress, totalAmount, status } = req.body;

  const data = {
    orderitems,
    user,
    shippingaddress,
    totalAmount: totalPriceServer,
    status,
  };
  //configure total totalAmount in server

  const order = new Order(data);

  const result = await order.save();
  return res.json(result);
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Order.findByIdAndRemove(req.params.id).then(
      async (order) => {
        // console.log(order);

        if (!order) return res.status(404).json({ msg: "Order Not Found!" });

        order.orderitems.forEach(async (orderitem) => {
          const orderdetail = await OrderItem.findByIdAndRemove(orderitem);
          // console.log(orderdetail);
          // console.log(orderdetial);
        });
      }
    );

    res.json({ msg: "Order Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ err, msg: "Order Not Found" });
  }
});

router.get("/userorders/:id", async (req, res) => {
  try {
    const result = await Order.find({ user: req.params.id }).populate({
      path: "orderitems",
      populate: { path: "product", select: "name " },
    });
    res.json(result);
  } catch (err) {
    return res.status(500).json({ err, msg: "Server Error" });
  }
});
module.exports = router;
