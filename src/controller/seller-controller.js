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
      OrderItems: {
        some: { Product: { seller_id: req.userData.user_id } },
      },
    });
    if (req.query.search) {
      filters.push({
        OrderItems: {
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
          OrderItems: {
            select: {
              Product: true,
              sub_total_harga: true,
              sub_total_produk: true,
            },
          },
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
          OrderItems: {
            select: {
              Product: true,
              sub_total_harga: true,
              sub_total_produk: true,
            },
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
      const { deskripsi, harga, diskon } = validate.value;
      await prisma.product.update({
        where: { id: req.params.id },
        data: {
          deskripsi: deskripsi,
          harga: harga,
          image_id: imageId,
          image_url: imageUrl,
          updated_at: new Date(),
          diskon: diskon,
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
      return res.status(422).json({
        message: "File Terlalu Besar Maksimal 5MB",
        status_code: 422,
      });
    }
    const seller = await prisma.seller.findFirst({
      where: { id: req.userData.user_id },
    });
    if (seller.ava_image_id !== null) {
      try {
        await cloudinary.uploader.destroy(seller.ava_image_id);
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
        tags: `foto-warung-sellerimage`,
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
          OrderItems: {
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
          OrderItems: {
            some: {
              Product: {
                seller_id: sellerId,
              },
            },
          },
        },
        select: {
          total_pembayaran: true,
        },
      });

      const totalPendapatan = orders.reduce((total, order) => {
        return total + order.total_pembayaran;
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

  reportPenjualan: async (req, res) => {
    const { tanggalMulai, tanggalSelesai } = req.query;
    let start, end;
    const filters = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (tanggalMulai && tanggalSelesai) {
      const startDate = new Date(`${tanggalMulai}T00:00:00Z`);
      const endDate = new Date(`${tanggalSelesai}T23:59:59Z`);
      filters.push({
        waktu_transaksi: {
          gte: startDate,
          lte: endDate,
        },
      });
    }
    try {
      const orders = await prisma.order.findMany({
        where: {
          AND: filters,
          status_order: "SUKSES",
          status_transaksi: "PAID",
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
        orderBy: { waktu_transaksi: "asc" },
        include: {
          Customer: true,
          OrderItems: {
            include: {
              Product: true,
            },
          },
        },
      });
      const totalSemuaPenjualan = await prisma.order.count({
        where: {
          status_order: "SUKSES",
          status_transaksi: "PAID",
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
      });
      const totalPenjualanHariIni = await prisma.order.count({
        where: {
          waktu_transaksi: {
            gte: new Date(),
            lt: new Date(),
          },
        },
      });
      const totalPenjualanBulanIni = await prisma.order.count({
        where: {
          status_order: "SUKSES",
          status_transaksi: "PAID",
          waktu_transaksi: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
      });
      const totalPenjualanTahunIni = await prisma.order.count({
        where: {
          status_order: "SUKSES",
          status_transaksi: "PAID",
          waktu_transaksi: {
            gte: new Date(currentYear, 0, 1),
            lt: new Date(currentYear + 1, 0, 1),
          },
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
      });
      return res.status(200).json({
        message: "Sukses",
        dataPenjualan: orders,
        totalSemuaPenjualan: totalSemuaPenjualan,
        totalPenjualanHariIni: totalPenjualanHariIni,
        totalPenjualanBulanIni: totalPenjualanBulanIni,
        totalPenjualanTahunIni: totalPenjualanTahunIni,
        status_code: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: `${error.message}`,
        status_code: 500,
      });
    }
  },
  reportPendapatan: async (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const { tanggalMulai, tanggalSelesai } = req.query;
    let filters = [];
    if (tanggalMulai && tanggalSelesai) {
      const startDate = new Date(`${tanggalMulai}T00:00:00Z`);
      const endDate = new Date(`${tanggalSelesai}T23:59:59Z`);
      filters.push({
        waktu_transaksi: {
          gte: startDate,
          lte: endDate,
        },
      });
    }
    try {
      const dataPendapatan = await prisma.order.groupBy({
        by: ["waktu_transaksi"],
        _sum: {
          total_pembayaran: true,
        },
        where: {
          AND: filters,
          status_transaksi: "PAID",
          status_order: "SUKSES",
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
        orderBy: { waktu_transaksi: "asc" },
      });
      const dataSemuaPendapatan = await prisma.order.groupBy({
        by: ["waktu_transaksi"],
        _sum: {
          total_pembayaran: true,
        },
        where: {
          status_transaksi: "PAID",
          status_order: "SUKSES",
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
        orderBy: { waktu_transaksi: "asc" },
      });
      const dataPendapatanHariIni = await prisma.order.groupBy({
        by: ["waktu_transaksi"],
        _sum: {
          total_pembayaran: true,
        },
        where: {
          waktu_transaksi: {
            gte: new Date(),
            lt: new Date(),
          },
          status_transaksi: "PAID",
          status_order: "SUKSES",
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
        orderBy: { waktu_transaksi: "asc" },
      });
      const dataPendapatanBulanIni = await prisma.order.groupBy({
        by: ["waktu_transaksi"],
        _sum: {
          total_pembayaran: true,
        },
        where: {
          waktu_transaksi: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
          status_transaksi: "PAID",
          status_order: "SUKSES",
          OrderItems: {
            some: {
              Product: { seller_id: req.userData.user_id },
            },
          },
        },
        orderBy: { waktu_transaksi: "asc" },
      });
      const totalSemuaPendapatan = dataSemuaPendapatan.reduce(
        (sum, item) => sum + (item._sum.total_pembayaran || 0),
        0
      );
      const totalSemuaPendapatanHariIni = dataPendapatanHariIni.reduce(
        (sum, item) => sum + (item._sum.total_pembayaran || 0),
        0
      );
      const totalSemuaPendapatanBulanIni = dataPendapatanBulanIni.reduce(
        (sum, item) => sum + (item._sum.total_pembayaran || 0),
        0
      );
      return res.status(200).json({
        message: "Sukses",
        dataPendapatan: dataPendapatan,
        dataPendapatanHariIni: dataPendapatanHariIni,
        dataPendapatanBulanIni: dataPendapatanBulanIni,
        totalSemuaPendapatan: totalSemuaPendapatan,
        totalPendapatanHariIni: totalSemuaPendapatanHariIni,
        totalPendapatanBulanIni: totalSemuaPendapatanBulanIni,
        status_code: 200,
      });
    } catch (error) {
      return res.status(500).json({
        message: `${error.message}`,
        status_code: 500,
      });
    }
  },
};
