const Joi = require("joi");

module.exports = {
  createProductValidation: Joi.object({
    nama: Joi.string().required().max(30).messages({
      "any.required": "Field Nama Harus Diisi",
      "string.empty": "Field Nama Tidak Boleh Kosong",
      "string.max": "Field Nama maksimal 30 Karakter",
    }),
    deskripsi: Joi.string().required().messages({
      "any.required": "Field Deskripsi Harus Diisi",
      "string.empty": "Field Deskripsi Tidak Boleh Kosong",
    }),
    harga: Joi.number().positive().required().messages({
      "any.required": "Field Harga Harus Diisi",
      "any.empty": "Field Harga Tidak Boleh Kosong",
      "number.base": "Field Harga Tidak Valid.",
      "number.positive": "Field Harga Tidak Valid.",
    }),
    category_id: Joi.string().required().messages({
      "any.required": "Field Category Id Harus Diisi",
      "string.empty": "Field Category Id Tidak Boleh Kosong",
    }),
  }),
  updateProductValidation: Joi.object({
    deskripsi: Joi.string().required().messages({
      "any.required": "Field Deskripsi Harus Diisi",
      "string.empty": "Field Deskripsi Tidak Boleh Kosong",
    }),
    harga: Joi.number().positive().required().messages({
      "any.required": "Field Harga Harus Diisi",
      "any.empty": "Field Harga Tidak Boleh Kosong",
      "number.base": "Field Harga Tidak Valid.",
      "number.positive": "Field Harga Tidak Valid.",
    }),
    diskon: Joi.number().integer().min(0).max(100).optional().messages({
      "number.base": "Field Diskon Harus Berupa Angka.",
      "number.integer": "Field Diskon Harus Berupa Bilangan Bulat.",
      "number.min": "Field Diskon Tidak Boleh Kurang Dari 1.",
      "number.max": "Field Diskon Tidak Boleh Lebih Dari 100.",
    }),
  }),
};
