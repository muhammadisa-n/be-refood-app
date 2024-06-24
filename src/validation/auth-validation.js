import Joi from 'joi'
export const registerValidation = Joi.object({
    name: Joi.string().required().max(100).messages({
        'any.required': 'Field Name is Required',
        'string.empty': 'Field Name must be filled in',
        'string.max': 'Field Name max 100 character',
    }),
    email: Joi.string().required().max(100).email().messages({
        'any.required': 'Field Email is Required',
        'string.email': 'Field Email is not valid email',
        'string.empty': 'Field Email must be filled in',
        'string.max': 'Field Email max 100 character',
    }),
    password: Joi.string().required().min(8).messages({
        'any.required': 'Field Password is Required',
        'string.empty': 'Field Password must be filled in',
        'string.min': 'Field Password min 8 character',
    }),
    confPassword: Joi.string().required().min(8).messages({
        'any.required': 'Field Confirm Password is Required',
        'string.empty': 'Field Confirm Password must be filled in',
        'string.min': 'Field Confirm Password min 8 character',
    }),
    province: Joi.string().required().max(100).messages({
        'any.required': 'Field Province is Required',
        'string.empty': 'Field Province must be filled in',
        'string.max': 'Field Province max 100 character',
    }),
    city: Joi.string().required().max(100).messages({
        'any.required': 'Field City is Required',
        'string.empty': 'Field City must be filled in',
        'string.max': 'Field City max 100 character',
    }),
    district: Joi.string().required().max(100).messages({
        'any.required': 'Field District is Required',
        'string.empty': 'Field District must be filled in',
        'string.max': 'Field District 100 max character',
    }),
    village: Joi.string().required().max(100).messages({
        'any.required': 'Field Village is Required',
        'string.empty': 'Field Village must be filled in',
        'string.max': 'Field Village max 100 character',
    }),
    postal_code: Joi.string().required().max(100).messages({
        'any.required': 'Field Postal Code is Required',
        'string.empty': 'Field Postal Code must be filled in',
        'string.max': 'Field Postal Code max 100 character',
    }),
    address: Joi.string().required().max(255).messages({
        'any.required': 'Field Address is Required',
        'string.empty': 'Field Address must be filled in',
        'string.max': 'Field Address max 255 character',
    }),
    no_hp: Joi.string().required().min(12).max(15).messages({
        'any.required': 'Field Number Phone is Required',
        'string.empty': 'Field Number Phone must be filled in',
        'string.min': 'Field Number Phone min 12 character',
        'string.max': 'Field Number Phone max 15 character',
    }),
    role: Joi.string().required().valid('Seller', 'Customer').messages({
        'any.required': 'Field Role is Required',
        'string.empty': 'Field Role must be filled in',
        'any.only': 'Field role must be Seller or Customer',
    }),
})
export const loginValidation = Joi.object({
    email: Joi.string().required().max(100).email().messages({
        'any.required': 'Field Email is Required',
        'string.email': 'Field Email is not valid email',
        'string.empty': 'Field Email must be filled in',
        'string.max': 'Field Email max 100 character',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Field Password is Required',
        'string.empty': 'Field Password must be filled in',
    }),
})
export const emailValidation = Joi.string()
    .required()
    .max(100)
    .email()
    .messages({
        'any.required': 'Field Email is Required',
        'string.email': 'Field Email is not valid email',
        'string.empty': 'Field Email must be filled in',
        'string.max': 'Field Email max 100 character',
    })
export const forgotPasswordValidation = Joi.object({
    password: Joi.string().required().min(8).messages({
        'any.required': 'Field Password is Required',
        'string.empty': 'Field Password must be filled in',
        'string.min': 'Field Password min 8 character',
    }),
    confPassword: Joi.string().required().min(8).messages({
        'any.required': 'Field Confirm Password is Required',
        'string.empty': 'Field Confirm Password must be filled in',
        'string.min': 'Field Confirm Password min 8 character',
    }),
})
