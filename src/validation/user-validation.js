import Joi from 'joi'

export const updateUserValidation = Joi.object({
    name: Joi.string().required().max(100).messages({
        'any.required': 'Field Name is Required',
        'string.max': 'Field Name max 100 character',
        'string.empty': 'Field Name is not allowed to be empty',
    }),
    description: Joi.string().optional().allow(''),
    province: Joi.string().optional().max(100).allow('').messages({
        'string.max': 'Field Province max 100 character',
    }),
    city: Joi.string().optional().max(100).allow('').messages({
        'string.max': 'Field City max 100 character',
    }),
    district: Joi.string().optional().max(100).allow('').messages({
        'string.max': 'Field District 100 max character',
    }),
    village: Joi.string().optional().max(100).allow('').messages({
        'string.max': 'Field Village max 100 character',
    }),
    postal_code: Joi.string().optional().max(100).allow('').messages({
        'string.max': 'Field Postal Code max 100 character',
    }),
    address: Joi.string().optional().allow('').messages({
        'string.max': 'Field Address max 255 character',
    }),
    no_hp: Joi.string().optional().max(15).allow('').messages({
        'string.max': 'Field Number Phone max 15 character',
    }),
})
