const { cartValidation } = require('../validation/cart-validation.js');
const { prisma } = require('../utils/prisma.js');
const uuid = require('uuid').v4;
const snapMidtrans = require('../utils/midtrans.js');
const { creatOrderValidation } = require('../validation/order-validation.js');
const transporter = require('../utils/nodemailer.js');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');
module.exports = {
    // Cart
    getAllCart: async (req, res) => {
        try {
            const carts = await prisma.cart.findMany({
                where: { customer_id: req.userData.user_id },
                orderBy: { updated_at: 'desc' },
                include: {
                    Product: true,
                },
            });
            return res
                .status(200)
                .json({ message: 'Sukses', carts, status_code: 200 });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    createCart: async (req, res) => {
        const validate = cartValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        try {
            const existingCart = await prisma.cart.findFirst({
                where: {
                    product_id: req.body.product_id,
                    customer_id: req.userData.user_id,
                },
            });

            if (existingCart) {
                const prevTotalProduk = existingCart.total_produk;
                const prevTotalHarga = existingCart.total_harga;
                await prisma.cart.update({
                    where: {
                        product_id: req.body.product_id,
                    },
                    data: {
                        total_produk:
                            prevTotalProduk + validate.value.total_produk,
                        total_harga:
                            prevTotalHarga + validate.value.total_harga,
                        customer_id: req.userData.user_id,
                        updated_at: new Date(),
                    },
                });
                return res.status(200).json({
                    message: 'Data Keranjang Berhasil Diupdate',
                    status_code: 200,
                });
            }
            await prisma.cart.create({
                data: {
                    total_produk: validate.value.total_produk,
                    total_harga: validate.value.total_harga,
                    product_id: validate.value.product_id,
                    customer_id: req.userData.user_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            return res.status(201).json({
                message: 'Data Keranjang Berhasil Ditambah',
                status_code: 201,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    deleteCart: async (req, res) => {
        try {
            const cart = await prisma.cart.findFirst({
                where: {
                    product_id: req.params.id,
                    customer_id: req.userData.user_id,
                },
            });
            if (!cart) {
                return res.status(404).json({
                    message: 'Data Keranjang Tidak Ditemukan',
                    status_code: 404,
                });
            }
            await prisma.cart.delete({
                where: { product_id: cart.product_id },
            });
            return res.status(200).json({
                message: 'Data Keranjang Berhasil Dihapus',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 201 });
        }
    },
    // Order
    getAllOrder: async (req, res) => {
        try {
            const orders = await prisma.order.findMany({
                where: { customer_id: req.userData.user_id },
                orderBy: { created_at: 'desc' },
                include: {
                    OrderProducts: {
                        select: { Product: true, quantity: true },
                    },
                },
            });
            return res
                .status(200)
                .json({ message: 'Sukses', orders, status_code: 200 });
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
                    customer_id: req.userData.user_id,
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
                    message: 'Data Order Tidak Ditemukan',
                    status_code: 404,
                });
            return res.status(200).json({
                message: 'Data Order Ditemukan',
                order,
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    createOrder: async (req, res) => {
        const validate = creatOrderValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        try {
            // Validasi produk yang dipesan
            const productIds = validate.value.products.map((p) => p.product_id);
            const products = await prisma.product.findMany({
                where: {
                    id: { in: productIds },
                },
                include: {
                    Seller: true,
                    Category: true,
                },
            });

            if (products.length !== productIds.length) {
                return res.status(404).json({
                    message: 'Satu atau lebih produk tidak ditemukan',
                    status_code: 404,
                });
            }
            const sellerId = products[0].Seller.id;
            const allSameSeller = products.every(
                (product) => product.Seller.id === sellerId
            );

            if (!allSameSeller) {
                return res.status(400).json({
                    message:
                        'Semua produk harus berasal dari penjual yang sama',
                    status_code: 400,
                });
            }

            const customer = await prisma.customer.findUnique({
                where: {
                    id: req.userData.user_id,
                },
            });

            const seller = await prisma.seller.findFirst({
                where: {
                    id: sellerId,
                },
            });
            const orderId = `ORD-${uuid()}`;

            const { total_harga, products: orderProducts } = validate.value;

            const itemDetails = orderProducts.map((orderProduct) => {
                const product = products.find(
                    (p) => p.id === orderProduct.product_id
                );
                return {
                    id: product.id,
                    price: product.harga,
                    quantity: orderProduct.quantity,
                    name: product.nama,
                    category: product.Category.nama,
                    merchant_name: product.Seller.nama,
                };
            });

            const parameter = {
                transaction_details: {
                    order_id: `${orderId}`,
                    gross_amount: total_harga,
                },
                item_details: itemDetails,
                customer_details: {
                    first_name: customer.nama,
                    email: customer.email,
                    phone: customer.no_hp,
                },
            };
            snapMidtrans
                .createTransaction(parameter)
                .then(async (transactionData) => {
                    const dataOrder = await prisma.order.create({
                        data: {
                            id: orderId,
                            customer_id: req.userData.user_id,
                            total_produk: orderProducts.reduce(
                                (total, p) => total + p.quantity,
                                0
                            ),

                            total_harga: total_harga,
                            token_transaction: transactionData.token,
                        },
                    });
                    // Membuat entri OrderProduct untuk setiap produk
                    const orderProductPromises = orderProducts.map(
                        (orderProduct) => {
                            return prisma.orderProduct.create({
                                data: {
                                    order_id: orderId,
                                    product_id: orderProduct.product_id,
                                    quantity: orderProduct.quantity,
                                },
                            });
                        }
                    );
                    await Promise.all(orderProductPromises);

                    const url = `${process.env.CLIENT_URL}/my-dashboard/seller/orders/detail/${dataOrder.id}`;
                    const template = fs.readFileSync(
                        path.join(
                            __dirname,
                            '../templates/order-notification.mustache'
                        ),
                        'utf-8'
                    );

                    const data = {
                        url,
                        sellerName: seller.nama,
                        orderId: dataOrder.id,
                        totalHarga: dataOrder.total_harga,
                        customerName: customer.nama,
                    };
                    const sendOrderNotificationTemplate = mustache.render(
                        template,
                        data
                    );
                    const mailOptions = {
                        from: process.env.MAIL_FROM,
                        to: seller.email,
                        subject: 'Order Notification',
                        html: sendOrderNotificationTemplate,
                    };

                    transporter.sendMail(mailOptions);
                    return res.status(201).json({
                        message: 'Data Order Berhasil Ditambah',
                        dataOrder: dataOrder,
                        status_code: 201,
                    });
                })
                .catch((error) => {
                    return res.status(500).json({
                        message: `${error.message}`,
                        status_code: 500,
                    });
                });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    updateOrder: async (req, res) => {
        const order = await prisma.order.findUnique({
            where: {
                id: req.params.id,
                customer_id: req.userData.user_id,
            },
        });
        if (!order) {
            return res.status(404).json({
                message: 'Data Order Tidak Ditemukan',
                status_code: 404,
            });
        }

        const {
            tipe_pembayaran,
            status_transaksi,
            waktu_transaksi,
            status_order,
            token_transaction,
            jenis_layanan,
        } = req.body;

        try {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status_order: status_order,
                    tipe_pembayaran: tipe_pembayaran,
                    status_transaksi: status_transaksi,
                    waktu_transaksi: waktu_transaksi,
                    jenis_layanan: jenis_layanan,
                    token_transaction:
                        token_transaction || order.token_transaction,
                    updated_at: new Date(),
                },
            });
        } catch (error) {
            console.error(error.message);
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
        return res.status(200).json({
            message: 'Data Order Berhasil Diubah',
            status_code: 200,
        });
    },

    cancelOrder: async (req, res) => {
        const order = await prisma.order.findUnique({
            where: {
                id: req.params.id,
                customer_id: req.userData.user_id,
            },
        });
        if (!order) {
            return res.status(404).json({
                message: 'Data Order Tidak Ditemukan',
                status_code: 404,
            });
        }
        try {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status_order: 'CANCEL',
                    status_transaksi: 'CANCEL',
                    token_transaction: null,
                    updated_at: new Date(),
                },
            });
            return res.status(200).json({
                message: 'Sukses',
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
                    message: 'Data Order Tidak Ada',
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
            res.status(200).json({
                message: 'Sukses',
                status_code: 200,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: `${error.message}`, status_code: 500 });
        }
    },
    getAllProductRecomendation: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const skip = (page - 1) * take;
        const filters = [];
        const customer = await prisma.customer.findFirst({
            where: { id: req.userData.user_id },
        });
        let customerKota = customer.kota;
        console.log(customerKota);
        filters.push({
            Seller: { kota: customerKota },
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
                orderBy: { created_at: 'desc' },
                include: {
                    Category: true,
                    Seller: true,
                },
            });
            const totalProduct = await prisma.product.count({
                where: {
                    AND: filters,
                },
            });
            res.status(200).json({
                message: 'Sukses',
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
};
