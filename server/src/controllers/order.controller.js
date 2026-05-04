import prisma from "../../prismaclient.js";

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      customerName,
      customerEmail,
      phone,
      address,
      paymentMethod,
    } = req.body;

    console.log(req.body);
    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!customerName || !customerEmail || !address) {
      return res.status(400).json({ message: "Missing customer info" });
    }

    // Get products from DB (never trust frontend price)
    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Build order items safely
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      return {
        productId: product.id,
        name: product.name,
        price: product.price, // ✅ real price from DB
        quantity: item.quantity,
      };
    });

    // Calculate total
    const total = orderItemsData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order + items
    const order = await prisma.order.create({
      data: {
        total,
        customerName,
        customerEmail,
        phone,
        address,
        paymentMethod,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "PENDING",
    "PAID",
    "PREPARING",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};