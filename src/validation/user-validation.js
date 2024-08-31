const Joi = require('joi');

module.exports = {
    updateUserValidation: Joi.object({
        nama: Joi.string().required().max(100).messages({
            'any.required': 'Field Nama Harus Diisi',
            'string.max': 'Field Nama Maksimal 100 Karakter',
            'string.empty': 'Field Nama Tidak Boleh Kosong',
        }),
        deskripsi: Joi.string().optional().allow(''),
        provinsi: Joi.string().optional().max(100).allow('').messages({
            'string.max': 'Field Provinsi Maksimal 100 Karakter',
        }),
        kota: Joi.string().optional().max(100).allow('').messages({
            'string.max': 'Field Kota Maksimal 100 Karakter',
        }),
        kecamatan: Joi.string().optional().max(100).allow('').messages({
            'string.max': 'Field Kecamatan Maksimal 100 Karakter',
        }),
        kelurahan: Joi.string().optional().max(100).allow('').messages({
            'string.max': 'Field Kelurahan Maksimal 100 Karakter',
        }),
        kode_pos: Joi.string().optional().max(100).allow('').messages({
            'string.max': 'Field Kode Pos Maksimal 100 Karakter',
        }),
        alamat: Joi.string().optional().allow('').max(255).messages({
            'string.max': 'Field Alamat Maksimal 255 Karakter',
        }),
        no_hp: Joi.string().optional().allow('').messages({}),
    }),
};
