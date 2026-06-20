const prisma = require("../config/prisma")

// Create Order
const createOrder = async (req, res) => {
  try {
    const { items, total, paymentMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" })
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id }
      })

      if (!product) {
        return res.status(404).json({ message: `${item.name} not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.name}`
        })
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        paymentMethod,
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
          select: { id: true, name: true, email: true },
        },
      },
    })

     for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    res.status(201).json({ message: "Order created successfully", order })
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: error.message })
  }
}



// Get All Orders
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json({ orders })
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error: error.message })
  }
}

// Get Order By ID
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json({ order })
  } catch (error) {
    res.status(500).json({ message: "Failed to get order", error: error.message })
  }
}

//Clear Orders
const clearOrders = async(req, res) => {
  try{
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.$executeRaw`ALTER SEQUENCE "Order_id_seq" RESTART WITH 1` 

    res.json({message: "All orders cleared!"})
  }catch(error){
    res.status(500).json({message: "Failed to clear orders! ", error: error.message})
  }
}



module.exports = { createOrder, getOrders, getOrderById, clearOrders }