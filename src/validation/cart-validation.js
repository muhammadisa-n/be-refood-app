const Joi = require('joi');

module.exports = {
    cartValidation: Joi.object({
        total_produk: Joi.number().required().positive().messages({
            'any.required': 'Field Total Produk Harus Diisi',
            'any.empty': 'Field Total Produk Tidak Boleh Kosong',
            'number.base': 'Field Total Produk Tidak Valid.',
            'number.positive': 'Field Total Produk Tidak Valid',
        }),
        total_harga: Joi.number().required().positive().messages({
            'any.required': 'Field Total Harga Harus Diisi',
            'any.empty': 'Field Total Harga Tidak Boleh Kosong',
            'number.base': 'Field Total Harga Tidak Valid.',
            'number.positive': 'Field Total Harga Tidak Valid.',
        }),
        product_id: Joi.string().required().messages({
            'any.required': 'Field Product Id Harus Diisi',
            'string.empty': 'Field Product Id Tidak Boleh Kosong',
        }),
    }),
};
