const { cartValidation } = require('../validation/cart-validation.js');
const { prisma } = require('../utils/prisma.js');
const uuid = require('uuid').v4;
const snapMidtrans = require('../utils/midtrans.js');
const { orderValidation } = require('../validation/order-validation.js');

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
                message: 'Data Keranjang Berhasil Dibuat',
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
                    id: req.params.id,
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
                orderBy: { updated_at: 'desc' },
                include: {
                    Product: true,
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
            const order = await prisma.order.findUnique({
                where: { id: req.params.id, customer_id: req.userData.user_id },
                include: {
                    Product: true,
                    Transaction: true,
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
        const validate = orderValidation.validate(req.body, {
            allowUnknown: false,
        });
        if (validate.error) {
            let errors = validate.error.message;
            return res
                .status(400)
                .json({ message: `${errors}`, status_code: 400 });
        }
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: validate.value.product_id,
                },
                include: {
                    Category: true,
                    Seller: true,
                },
            });

            if (!product) {
                return res.status(404).json({
                    message: 'Data Produk Tidak Ditemukan',
                    status_code: 404,
                });
            }
            const customer = await prisma.customer.findUnique({
                where: {
                    id: req.userData.user_id,
                },
            });
            const orderId = `ORD-${uuid()}`;
            const {
                nama,
                email,
                no_hp,
                alamat,
                kelurahan,
                kecamatan,
                kota,
                provinsi,
                kode_pos,
            } = customer;
            const fullAddress = `${alamat}, ${kelurahan}, ${kecamatan}, ${kota}, ${provinsi}, ${kode_pos}`;
            const { product_id, total_produk, total_harga } = validate.value;

            const parameter = {
                transaction_details: {
                    order_id: `${orderId}`,
                    gross_amount: total_harga,
                },
                item_details: [
                    {
                        id: product_id,
                        price: product.harga,
                        quantity: total_produk,
                        name: product.nama,
                    },
                ],
                customer_details: {
                    first_name: nama,
                    email: email,
                    phone: no_hp,
                    shipping_address: {
                        first_name: nama,
                        email: email,
                        phone: no_hp,
                        address: fullAddress,
                    },
                },
            };
            snapMidtrans
                .createTransaction(parameter)
                .then(async (transactionData) => {
                    await prisma.order.create({
                        data: {
                            id: orderId,
                            product_id: product_id,
                            customer_id: req.userData.user_id,
                            total_produk: total_produk,
                            total_harga: total_harga,
                            alamat_pengiriman: fullAddress,
                            token_transaction: transactionData.token,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                    return res.status(201).json({
                        message: 'Data Order Berhasil Ditambah',
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
};
