const express = require("express");
const { createOrder, getOrders, getOrderById, clearOrders } = require ("../controllers/orderController")
const { protect } = require ("../middleware/authMiddleware")


const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.delete("/", protect, clearOrders)

module.exports = router