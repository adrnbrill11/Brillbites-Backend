const prisma = require("../config/prisma")

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    })
    res.json({ products })
  } catch (error) {
    res.status(500).json({ message: "Failed to get products", error: error.message })
  }
}

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body
    const product = await prisma.product.create({
      data: { name, category, price: Number(price), stock: stock === undefined || stock === "" ? 0 : Number(stock) }
    })
    res.status(201).json({ message: "Product added!", product })
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error: error.message })
  }
}

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, category, price, stock, isAvailable } = req.body
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, category, price:Number(price), stock: stock === undefined || stock === "" ? 0 : Number(stock),
      isAvailable }
    })
    res.json({ message: "Product updated!", product })
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: "Product deleted!" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message })
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct }