const express = require("express")
const { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/productController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", protect, getProducts)
router.post("/", protect, addProduct)
router.put("/:id", protect, updateProduct)
router.delete("/:id", protect, deleteProduct)

module.exports = router