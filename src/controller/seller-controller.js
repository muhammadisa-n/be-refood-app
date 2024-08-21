const { prisma } = require("../utils/prisma.js");
const cloudinary = require("../utils/cloudinary.js");
const {
  createProductValidation,
  updateProductValidation,
} = require("../validation/product-validation.js");
const {
  VerificationSellerValidation,
} = require("../validation/seller-validation.js");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid").v4;

module.exports = {
  getAllProduct: async (req, res) => {
    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 10;
    const skip = (page - 1) * take;
    const filters = [];
    filters.push({
      seller_id: req.userData.user_id,
    });
    if (req.query.search) {
      filters.push({
        nama: {
          contains: req.query.search,
        },
      });
    }
    try {
      const products = await prisma.product.findMany({
        where: { AND: filters },
        take: take,
        skip: skip,
        orderBy: { updated_at: "desc" },
        include: {
          Category: { select: { nama: true } },
        },
      });
      const totalProduct = await prisma.product.count({
        where: {
          AND: filters,
        },
      });
      res.status(200).json({
        message: "Sukses",
        products,
        total_product: totalProduct,
        paging: {
          current_page: page,
          total_page: Math.ceil(totalProduct / take),
        },
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  getAllOrder: async (req, res) => {
    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 10;
    const skip = (page - 1) * take;
    const filters = [];
    filters.push({
      OrderProducts: {
        some: { Product: { seller_id: req.userData.user_id } },
      },
    });
    if (req.query.search) {
      filters.push({
        OrderProducts: {
          some: { Product: { nama: req.query.search } },
        },
      });
    }
    try {
      const orders = await prisma.order.findMany({
        where: { AND: filters },
        take: take,
        skip: skip,
        include: {
          Customer: true,
          OrderProducts: { select: { Product: true } },
        },
      });
      const totalOrder = await prisma.order.count({
        where: { AND: filters },
      });
      res.status(200).json({
        message: "Sukses",
        orders,
        total_order: totalOrder,
        paging: {
          current_page: page,
          total_page: Math.ceil(totalOrder / take),
        },
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  getDetailProduct: async (req, res) => {
    try {
      const product = await prisma.product.findFirst({
        where: { id: req.params.id },
        include: {
          Category: { select: { nama: true } },
        },
      });
      if (!product)
        return res.status(404).json({
          message: "Data Product Tidak Ditemukan",
          status_code: 404,
        });
      return res.status(200).json({
        message: "Data Product Ditemukan",
        product,
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  getDetailOrder: async (req, res) => {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: req.params.id,
        },
        include: {
          OrderProducts: {
            select: { Product: true, quantity: true },
          },
          Customer: { select: { nama: true, no_hp: true } },
        },
      });
      if (!order)
        return res.status(404).json({
          message: "Data Order Tidak Ditemukan",
          status_code: 404,
        });
      return res.status(200).json({
        message: "Data Order Ditemukan",
        order,
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  countProduct: async (req, res) => {
    try {
      const totalProduct = await prisma.product.count({
        where: { seller_id: req.userData.user_id },
      });
      res.status(200).json({
        message: "Sukses",
        total_product: totalProduct,
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  createProduct: async (req, res) => {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: "Tidak Ada Image Diupload",
        status_code: 400,
      });
    }
    const seller = await prisma.seller.findFirst({
      where: { id: req.userData.user_id },
    });
    if (seller.status !== "Diterima") {
      return res.status(403).json({
        message: "Akses Terlarang, Akun Anda Belum Aktif",
        status_code: 403,
      });
    }
    const validate = createProductValidation.validate(req.body, {
      allowUnknown: false,
    });
    if (validate.error) {
      let errors = validate.error.message;
      return res.status(400).json({ message: `${errors}`, status_code: 400 });
    }
    const file = req.files.image;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    const allowedType = [".png", ".jpg", ".jpeg"];
    const imageFile = file.tempFilePath;
    if (!allowedType.includes(ext.toLowerCase())) {
      fs.unlinkSync(imageFile);
      return res.status(422).json({
        message: "Format Image Tidak Valid",
        status_code: 422,
      });
    }
    if (fileSize > 5 * 1024 * 1024) {
      fs.unlinkSync(imageFile);
      console.log(imageFile);
      return res.status(422).json({
        message: "File Image Terlalu Besar, Maksimal 5MB",
        status_code: 422,
      });
    }
    try {
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: `products/images/${req.userData.user_id}`,
        unique_filename: true,
        tags: `product-image`,
      });
      fs.unlinkSync(imageFile);
      const { nama, deskripsi, harga, category_id } = validate.value;
      const productId = `PRD-${uuid()}`;
      await prisma.product.create({
        data: {
          nama: nama,
          deskripsi: deskripsi,
          harga: harga,
          category_id: category_id,
          image_id: result.public_id,
          image_url: result.secure_url,
          seller_id: req.userData.user_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return res.status(201).json({
        message: "Data Produk Berhasil Ditambah",
        status_code: 201,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  updateProduct: async (req, res) => {
    const seller = await prisma.seller.findFirst({
      where: { id: req.userData.user_id },
    });
    if (seller.status !== "Diterima") {
      return res.status(403).json({
        message: "Akses Terlarang, Akun Anda Belum Aktif",
        status_code: 403,
      });
    }
    const validate = updateProductValidation.validate(req.body, {
      allowUnknown: true,
    });
    if (validate.error) {
      let errors = validate.error.message;
      return res.status(400).json({ message: `${errors}`, status_code: 400 });
    }
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, seller_id: req.userData.user_id },
    });
    if (!product)
      return res.status(404).json({
        message: "Data Product Tidak Ditemukan",
        status_code: 404,
      });
    let imageId;
    let imageUrl;
    if (req.files === null) {
      imageId = product.image_id;
      imageUrl = product.image_url;
    } else if (req.files.image) {
      const file = req.files.image;
      const fileSize = file.size;
      const ext = path.extname(file.name);
      const allowedType = [".png", ".jpeg", ".jpg"];
      const imageFile = file.tempFilePath;
      if (!allowedType.includes(ext.toLowerCase())) {
        fs.unlinkSync(imageFile);
        return res.status(422).json({
          message: "Format Image Tidak Valid",
          status_code: 422,
        });
      }
      if (fileSize > 5 * 1024 * 1024) {
        fs.unlinkSync(imageFile);
        return res.status(422).json({
          message: "File Image Terlalu Besar, Maksimal 5MB",
          status_code: 422,
        });
      }
      await cloudinary.uploader.destroy(product.image_id);
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: `products/images/${req.userData.user_id}`,
        unique_filename: true,
        tags: `product-image`,
      });
      fs.unlinkSync(imageFile);
      imageId = result.public_id;
      imageUrl = result.secure_url;
    }
    try {
      const { deskripsi, harga } = validate.value;
      await prisma.product.update({
        where: { id: req.params.id },
        data: {
          deskripsi: deskripsi,
          harga: harga,
          image_id: imageId,
          image_url: imageUrl,
          updated_at: new Date(),
        },
      });
      return res.status(200).json({
        message: "Data Produk Berhasil Diubah",
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  verifySeller: async (req, res) => {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: "Tidak Ada Image Diupload",
        status_code: 400,
      });
    }
    const validate = VerificationSellerValidation.validate(req.body, {
      allowUnknown: false,
    });
    if (validate.error) {
      let errors = validate.error.message;
      return res.status(400).json({ message: `${errors}`, status_code: 400 });
    }
    const file = req.files.image;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    const allowedType = [".png", ".jpg", ".jpeg"];
    const imageFile = file.tempFilePath;
    if (!allowedType.includes(ext.toLowerCase())) {
      fs.unlinkSync(imageFile);
      return res.status(422).json({
        message: "Format Image Tidak Valid",
        status_code: 422,
      });
    }
    if (fileSize > 5 * 1024 * 1024) {
      fs.unlinkSync(imageFile);
      console.log(imageFile);
      return res.status(422).json({
        message: "File Terlalu Besar Maksimal 5MB",
        status_code: 422,
      });
    }
    const seller = await prisma.seller.findFirst({
      where: { id: req.userData.user_id },
    });
    if (seller.sample_image_product_id !== null) {
      try {
        await cloudinary.uploader.destroy(seller.sample_image_product_id);
      } catch (error) {
        return res
          .status(500)
          .json({ message: `${error.message}`, status_code: 500 });
      }
    }
    try {
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: `products/images/${req.userData.user_id}/sample-products`,
        unique_filename: true,
        tags: `sample-product-image`,
      });
      fs.unlinkSync(imageFile);

      const { link_map } = validate.value;
      await prisma.seller.update({
        where: { id: req.userData.user_id },
        data: {
          link_map_alamat_toko: link_map,
          ava_image_id: result.public_id,
          ava_image_url: result.secure_url,
          status: null,
        },
      });
      return res.status(200).json({ message: "Sukses", status_code: 200 });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  countOrder: async (req, res) => {
    try {
      const totalOrder = await prisma.order.count({
        where: {
          OrderProducts: {
            some: { Product: { seller_id: req.userData.user_id } },
          },
        },
      });
      res.status(200).json({
        message: "Sukses",
        total_order: totalOrder,
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  updateStatusOrder: async (req, res) => {
    try {
      const order = await prisma.order.findFirst({
        where: { id: req.params.id },
      });
      if (!order) {
        return res.status(404).json({
          message: "Data Order Tidak Ada",
          status_code: 404,
        });
      }
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status_order: req.body.status_order,
          updated_at: new Date(),
        },
      });
      return res.status(200).json({
        message: "Sukses",
        status_code: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `${error.message}`, status_code: 500 });
    }
  },
  countPendapatan: async (req, res) => {
    try {
      const sellerId = req.userData.user_id;

      if (!sellerId) {
        return res.status(400).json({
          message: "Seller ID is missing",
          status_code: 400,
        });
      }

      const orders = await prisma.order.findMany({
        where: {
          status_order: "SUKSES",
          OrderProducts: {
            some: {
              Product: {
                seller_id: sellerId,
              },
            },
          },
        },
        select: {
          total_harga: true,
        },
      });

      // Menghitung total pendapatan dari order yang berkaitan dengan seller yang login
      const totalPendapatan = orders.reduce((total, order) => {
        return total + order.total_harga;
      }, 0);

      return res.status(200).json({
        message: "Sukses",
        total_pendapatan: totalPendapatan,
        status_code: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        status_code: 500,
      });
    }
  },
  getPendapatanPerBulan: async (sellerId) => {
    const orders = await prismaClient.order.findMany({
      where: {
        status_order: "SUKSES",
        OrderProducts: {
          some: {
            Product: {
              seller_id: sellerId,
            },
          },
        },
        waktu_transaksi: {
          not: null,
        },
      },
      select: {
        total_harga: true,
        waktu_transaksi: true,
      },
    });

    // Menghitung total pendapatan per bulan
    const pendapatanPerBulan = orders.reduce((acc, order) => {
      const month = new Date(order.waktu_transaksi).getMonth() + 1;
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += order.total_harga;
      return acc;
    }, {});

    // Format data menjadi array objek
    return Object.keys(pendapatanPerBulan).map((month) => ({
      month: parseInt(month, 10),
      total_pendapatan: pendapatanPerBulan[month],
    }));
  },
  countPendapatanPerBulan: async (req, res) => {
    try {
      const sellerId = req.userData.user_id; // Misalkan user_id diambil dari middleware autentikasi

      if (!sellerId) {
        return res.status(400).json({
          message: "Seller ID is missing",
          status_code: 400,
        });
      }

      const dataPendapatan = await this.getPendapatanPerBulan(sellerId);

      res.status(200).json({
        message: "Sukses",
        pendapatan_per_bulan: dataPendapatan,
        status_code: 200,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status_code: 500,
      });
    }
  },
};
