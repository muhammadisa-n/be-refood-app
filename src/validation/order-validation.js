const Joi = require('joi');
module.exports = {
    creatOrderValidation: Joi.object({
        products: Joi.array()
            .items(
                Joi.object({
                    product_id: Joi.string().required().messages({
                        'any.required': 'Field Product Id Harus Diisi',
                        'string.empty': 'Field Product Id Tidak Boleh Kosong',
                    }),
                    quantity: Joi.number().required().positive().messages({
                        'any.required': 'Field Quantity Harus Diisi',
                        'any.empty': 'Field Quantity Tidak Boleh Kosong',
                        'number.base': 'Field Quantity Tidak Valid.',
                        'number.positive': 'Field Quantity Tidak Valid',
                    }),
                })
            )
            .required()
            .min(1)
            .messages({
                'array.base': 'Field Products harus berupa array',
                'array.min': 'Minimal harus ada satu produk dalam order',
                'any.required': 'Field Products Harus Diisi',
            }),
        total_harga: Joi.number().required().positive().messages({
            'any.required': 'Field Total Harga Harus Diisi',
            'any.empty': 'Field Total Harga Tidak Boleh Kosong',
            'number.base': 'Field Total Harga Tidak Valid.',
            'number.positive': 'Field Total Harga Tidak Valid.',
        }),
    }),
};
