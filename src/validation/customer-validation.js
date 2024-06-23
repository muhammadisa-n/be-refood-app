import Joi from 'joi'

export const customerValidation = Joi.object({
    name: Joi.string().optional().max(100).messages({
        'string.max': 'Field Fullname max 100 character',
    }),
    description: Joi.string().optional(),
    province: Joi.string().optional().max(100).messages({
        'string.max': 'Field Province max 100 character',
    }),
    city: Joi.string().optional().max(100).messages({
        'string.max': 'Field City max 100 character',
    }),
    district: Joi.string().optional().max(100).messages({
        'string.max': 'Field District 100 max character',
    }),
    village: Joi.string().optional().max(100).messages({
        'string.max': 'Field Village max 100 character',
    }),
    postal_code: Joi.string().optional().max(100).messages({
        'string.max': 'Field Postal Code max 100 character',
    }),
    address: Joi.string().optional().max(255).messages({
        'string.max': 'Field Address max 255 character',
    }),
    no_hp: Joi.string().optional().min(12).max(15).messages({
        'string.min': 'Field Number Phone min 12 character',
        'string.max': 'Field Number Phone max 15 character',
    }),
})
