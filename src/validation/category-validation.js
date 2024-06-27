const Joi = require('joi');

module.exports = {
    categoryValidation: Joi.object({
        nama: Joi.string().required().max(100).messages({
            'any.required': 'Field Nama Harus Diisi',
            'string.empty': 'Field Nama Tidak Boleh Kosong',
            'string.max': 'Field Nama Maksimal 100 Karakter',
        }),
    }),
};
