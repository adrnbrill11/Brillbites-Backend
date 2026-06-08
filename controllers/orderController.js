const prisma = require("../config/prisma");

//Create Order

const createOrder = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // ← dagdag mo to
    const { items, total, paymentMethod } = req.body;

    console.log("ITEMS:", items); // ← dagdag mo to

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No Items in order",
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: "PAID",
        items: {
          create: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};

//Get all orders

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get orders",
      error: error,
    });
  }
};

//get Order By ID

const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
