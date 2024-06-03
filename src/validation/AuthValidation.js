import Joi from 'joi'
export const RegisterValidation = Joi.object({
    fullname: Joi.string().required().max(100).messages({
        'any.required': 'Field Fullname is Required',
        'string.empty': 'Field Fullname must be filled in',
        'string.max': 'Field Fullname max 100 character',
    }),
    email: Joi.string().required().max(100).email().messages({
        'any.required': 'Field email is Required',
        'string.email': 'Field email is not valid email',
        'string.empty': 'Field email must be filled in',
        'string.max': 'Field email max 100 character',
    }),
    password: Joi.string().required().min(8).messages({
        'any.required': 'Field password is Required',
        'string.empty': 'Field password must be filled in',
        'string.min': 'Field password min 8 character',
    }),
    confPassword: Joi.string().required().min(8).messages({
        'any.required': 'Field confirm password is Required',
        'string.empty': 'Field confirm password must be filled in',
        'string.min': 'Field confirm password min 8 character',
    }),
    province: Joi.string().required().max(100).messages({
        'any.required': 'Field province is Required',
        'string.empty': 'Field province must be filled in',
        'string.max': 'Field province max 100 character',
    }),
    city: Joi.string().required().max(100).messages({
        'any.required': 'Field city is Required',
        'string.empty': 'Field city must be filled in',
        'string.max': 'Field city max 100 character',
    }),
    district: Joi.string().required().max(100).messages({
        'any.required': 'Field district is Required',
        'string.empty': 'Field district must be filled in',
        'string.max': 'Field district 100 max character',
    }),
    village: Joi.string().required().max(100).messages({
        'any.required': 'Field village is Required',
        'string.empty': 'Field village must be filled in',
        'string.max': 'Field village max 100 character',
    }),
    postal_code: Joi.string().required().max(100).messages({
        'any.required': 'Field postal_code is Required',
        'string.empty': 'Field postal_code must be filled in',
        'string.max': 'Field postal_code max 100 character',
    }),
    address: Joi.string().required().max(255).messages({
        'any.required': 'Field address is Required',
        'string.empty': 'Field address must be filled in',
        'string.max': 'Field address max 255 character',
    }),
    no_hp: Joi.string().required().min(12).max(15).messages({
        'any.required': 'Field no_hp is Required',
        'string.empty': 'Field no_hp must be filled in',
        'string.min': 'Field no_hp min 12 character',
        'string.max': 'Field no_hp max 15 character',
    }),
    role: Joi.string()
        .required()
        .valid('Admin', 'Seller', 'Customer')
        .messages({
            'any.required': 'Field role is Required',
            'any.only': 'Field role must be one of {{#valids}}',
        }),
})

export const LoginValidation = Joi.object({
    email: Joi.string().required().max(100).email().messages({
        'any.required': 'Field email is Required',
        'string.email': 'Field email is not valid email',
        'string.empty': 'Field email must be filled in',
        'string.max': 'Field email max 100 character',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Field password is Required',
        'string.empty': 'Field password must be filled in',
    }),
})
export const EmailValidation = Joi.string()
    .required()
    .max(100)
    .email()
    .messages({
        'any.required': 'Field email is Required',
        'string.email': 'Field email is not valid email',
        'string.empty': 'Field email must be filled in',
        'string.max': 'Field email max 100 character',
    })
export const ForgotPasswordValidation = Joi.object({
    newPassword: Joi.string().required().min(8).messages({
        'any.required': 'Field password is Required',
        'string.empty': 'Field password must be filled in',
        'string.min': 'Field password min 8 character',
    }),
    confPassword: Joi.string().required().min(8).messages({
        'any.required': 'Field confirm password is Required',
        'string.empty': 'Field confirm password must be filled in',
        'string.min': 'Field confirm password min 8 character',
    }),
})
