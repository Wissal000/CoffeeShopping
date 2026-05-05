import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/product.route.js";
import orderRoutes from './routes/order.route.js';
import adminRoutes from './routes/admin.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static images
app.use("/images", express.static(path.join(process.cwd(), "public/images")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});