import prisma from "../../prismaclient.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;

    if (!name || !price || !category || !req.file) {
      return res.status(400).json({
        error: "Name, price, category and image are required",
      });
    }

    const parsedPrice = Number.parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: "Invalid price" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        image: imageUrl,
        category,
        isAvailable: isAvailable === "true",
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// GET ALL PRODUCTS by category
export const getProducts = async (req, res) => {
  try {
    const { category, page, limit } = req.query;

    const where = category && category !== "ALL" ? { category } : {};

    // 👉 If NO pagination → return ALL (fallback mode)
    if (!page && !limit) {
      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        products,
        total: products.length,
        page: 1,
        totalPages: 1,
      });
    }

    // 👉 Pagination mode
    const currentPage = Number(page) || 1;
    const take = Number(limit) || 8;
    const skip = (currentPage - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      products,
      total,
      page: currentPage,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // delete product
    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      error: "Failed to delete product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;

    let imageUrl;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        category,
        ...(imageUrl && { image: imageUrl }),
        ...(isAvailable !== undefined && {
          isAvailable: isAvailable === "true" || isAvailable === true,
        }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
};

