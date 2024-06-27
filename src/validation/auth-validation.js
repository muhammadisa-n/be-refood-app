const Joi = require('joi');
module.exports = {
    registerValidation: Joi.object({
        nama: Joi.string().required().max(100).messages({
            'any.required': 'Field Nama Harus Diisi',
            'string.empty': 'Field Nama Tidak Boleh Kosong',
            'string.max': 'Field Nama Maksimal 100 Karakter',
        }),
        email: Joi.string().required().max(100).email().messages({
            'any.required': 'Field Email Harus Diisi',
            'string.empty': 'Field Email Tidak Boleh Kosong',
            'string.email': 'Field Email Tidak Valid',
            'string.max': 'Field Email Maksimal 100 Karakter',
        }),
        password: Joi.string().required().min(8).max(100).messages({
            'any.required': 'Field Password Harus Diisi',
            'string.empty': 'Field Password Tidak Boleh Kosong',
            'string.min': 'Field Password minimal 8 Karakter',
            'string.max': 'Field Password Maksimal 100 Karakter',
        }),
        confPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .min(8)
            .max(100)
            .messages({
                'any.required': 'Field Confirm Password Harus Diisi',
                'string.empty': 'Field Confirm Password Tidak Boleh Kosong',
                'string.min': 'Field Confirm Password minimal 8 Karakter',
                'string.max': 'Field Confirm Password max 100 character',
                'any.only': 'Field Confirm Password Harus Sama Dengan Password',
            }),
        provinsi: Joi.string().required().max(100).messages({
            'any.required': 'Field Provinsi Harus Diisi',
            'string.empty': 'Field Provinsi Tidak Boleh Kosong',
            'string.max': 'Field Provinsi Maksimal 100 Karakter',
        }),
        kota: Joi.string().required().max(100).messages({
            'any.required': 'Field Kota Harus Diisi',
            'string.empty': 'Field Kota Tidak Boleh Kosong',
            'string.max': 'Field Kota Maksimal 100 Karakter',
        }),
        kecamatan: Joi.string().required().max(100).messages({
            'any.required': 'Field Kecamatan Harus Diisi',
            'string.empty': 'Field Kecamatan Tidak Boleh Kosong',
            'string.max': 'Field Kecamatan Maksimal 100 Karakter',
        }),
        kelurahan: Joi.string().required().max(100).messages({
            'any.required': 'Field Kelurahan Harus Diisi',
            'string.empty': 'Field Kelurahan Tidak Boleh Kosong',
            'string.max': 'Field Kelurahan Maksimal 100 Karakter',
        }),
        kode_pos: Joi.string().required().max(100).messages({
            'any.required': 'Field Kode Pos Harus Diisi',
            'string.empty': 'Field Kode Pos Tidak Boleh Kosong',
            'string.max': 'Field Kode Pos Maksimal 100 Karakter',
        }),
        alamat: Joi.string().required().max(255).messages({
            'any.required': 'Field Alamat Harus Diisi',
            'string.empty': 'Field Alamat Tidak Boleh Kosong',
            'string.max': 'Field Alamat Maksimal 255 Karakter',
        }),
        no_hp: Joi.string().required().min(12).max(15).messages({
            'any.required': 'Field No HP Harus Diisi',
            'string.empty': 'Field No HP Tidak Boleh Kosong',
            'string.min': 'Field No HP Minimal 12 Karakter',
            'string.max': 'Field No HP Maksimal 15 Karakter',
        }),
        role: Joi.string().required().valid('Seller', 'Customer').messages({
            'any.required': 'Field Role Harus Diisi',
            'string.empty': 'Field Role Tidak Boleh Kosong',
            'string.max': 'Field Role Maksimal 100 Karakter',
            'any.only': 'Field Role Harus Seller Atau Customer',
        }),
    }),
    loginValidation: Joi.object({
        email: Joi.string().required().max(100).email().messages({
            'any.required': 'Field Email Harus Diisi',
            'string.empty': 'Field Email Tidak Boleh Kosong',
            'string.email': 'Field Email Tidak Valid',
            'string.max': 'Field Email Maksimal 100 Karakter',
        }),
        password: Joi.string().required().min(8).max(100).messages({
            'any.required': 'Field Password Harus Diisi',
            'string.empty': 'Field Password Tidak Boleh Kosong',
            'string.min': 'Field Password minimal 8 Karakter',
            'string.max': 'Field Password Maksimal 100 Karakter',
        }),
    }),
    emailValidation: Joi.string().required().max(100).email().messages({
        'any.required': 'Field Email Harus Diisi',
        'string.empty': 'Field Email Tidak Boleh Kosong',
        'string.email': 'Field Email Tidak Valid',
        'string.max': 'Field Email Maksimal 100 Karakter',
    }),
    forgotPasswordValidation: Joi.object({
        password: Joi.string().required().min(8).max(100).messages({
            'any.required': 'Field Password Harus Diisi',
            'string.empty': 'Field Password Tidak Boleh Kosong',
            'string.min': 'Field Password Minimal 8 Karakter',
            'string.max': 'Field Password Maksimal 100 Karakter',
        }),
        confPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .min(8)
            .max(100)
            .messages({
                'any.required': 'Field Confirm Password Harus Diisi',
                'string.empty': 'Field Confirm Password Tidak Boleh Kosong',
                'string.min': 'Field Confirm Password Minimal 8 Karakter',
                'string.max': 'Field Confirm Password Maksimal 100 character',
                'any.only': 'Field Confirm Password Harus Sama Dengan Password',
            }),
    }),
};
