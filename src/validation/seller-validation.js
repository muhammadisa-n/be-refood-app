const Joi = require('joi');

module.exports = {
    VerificationSellerValidation: Joi.object({
        link_map: Joi.string().required().max(100).messages({
            'any.required': 'Field Link Map Harus Diisi',
            'string.empty': 'Field Link Map Tidak Boleh Kosong',
            'string.max': 'Field Link Map Maksimal 100 Karakter',
        }),
    }),
};
