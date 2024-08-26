const Joi = require("joi");
module.exports = {
  creatOrderValidation: Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.string().required().messages({
            "any.required": "Field Product Id Harus Diisi",
            "string.empty": "Field Product Id Tidak Boleh Kosong",
          }),
          sub_total_produk: Joi.number().required().positive().messages({
            "any.required": "Field Sub Total Produk Harus Diisi",
            "any.empty": "Field Sub Total Produk Tidak Boleh Kosong",
            "number.base": "Field Sub Total Produk Tidak Valid.",
            "number.positive": "Field Sub Total Produk Tidak Valid",
          }),
          sub_total_harga: Joi.number().required().positive().messages({
            "any.required": "Field Sub Total Harga Harus Diisi",
            "any.empty": "Field Sub Total Harga Tidak Boleh Kosong",
            "number.base": "Field Sub Total Harga Tidak Valid.",
            "number.positive": "Field Sub Total Harga Tidak Valid",
          }),
        })
      )
      .required()
      .min(1)
      .messages({
        "array.base": "Field Products harus berupa array",
        "array.min": "Minimal harus ada satu produk dalam order",
        "any.required": "Field Products Harus Diisi",
      }),
    total_pembayaran: Joi.number().required().positive().messages({
      "any.required": "Field Total Pembayaran Harus Diisi",
      "any.empty": "Field Total Pembayaran Tidak Boleh Kosong",
      "number.base": "Field Total Pembayaran Tidak Valid.",
      "number.positive": "Field Total Pembayaran Tidak Valid.",
    }),
    total_produk: Joi.number().required().positive().messages({
      "any.required": "Field Total Produk Harus Diisi",
      "any.empty": "Field Total Produk Tidak Boleh Kosong",
      "number.base": "Field Total Produk Tidak Valid.",
      "number.positive": "Field Total Produk Tidak Valid.",
    }),
  }),
};
