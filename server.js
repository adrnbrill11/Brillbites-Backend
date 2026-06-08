const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const prisma = require("./config/prisma");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes")

// Middleware
app.use(cors({
    origin:
        "*"
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "BRILLBITES POS API RUNNING"
    })
});

// Prisma test route
app.get("/api/health/db", async (req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({
            status: "ok",
            database: "connected"
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Database connection failed"
        })

    }
})

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)


})