import Joi from 'joi'

export const ProductValidation = Joi.object({
    name: Joi.string().required().max(100).messages({
        'any.required': 'Field name is Required',
        'string.empty': 'Field name must be filled in',
        'string.max': 'Field name max 100 character',
    }),
    description: Joi.string().required().messages({
        'any.required': 'Field description is Required',
        'string.empty': 'Field description must be filled in',
    }),
    price: Joi.number().positive().required().messages({
        'any.required': 'Field price is Required',
    }),
    categoryId: Joi.number().positive().required().messages({
        'any.required': 'Field Category Id is Required',
    }),
    stock: Joi.number().positive().required().messages({
        'any.required': 'Field stock is Required',
    }),
})
