import Joi from 'joi'

export const productValidation = Joi.object({
    name: Joi.string().required().max(100).messages({
        'any.required': 'Field Name is Required',
        'string.empty': 'Field Name must be filled in',
        'string.max': 'Field Name max 100 character',
    }),
    description: Joi.string().required().messages({
        'any.required': 'Field Description is Required',
        'string.empty': 'Field Description must be filled in',
    }),
    price: Joi.number().positive().required().messages({
        'number.base': 'Field Price must be a valid number.',
        'number.positive': 'Field Price must be a positive value ',
        'any.required': 'Field Price is Required',
    }),
    category_id: Joi.number().positive().required().messages({
        'any.required': 'Field Category Id is Required',
    }),
})
