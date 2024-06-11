import Joi from 'joi'

export const cartValidation = Joi.object({
    total_product: Joi.number().required().positive().messages({
        'number.base': 'Field Total Product must be a valid number.',
        'number.positive': 'Field Total Product must be a positive value ',
    }),
    total_price: Joi.number().required().positive().messages({
        'number.base': 'Field Total Price must be a valid number.',
        'number.positive': 'Field Total Price must be a positive value ',
    }),
    product_id: Joi.string().required().messages({
        'any.required': 'Field Product Id is Required',
    }),
})
