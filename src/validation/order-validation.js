import Joi from 'joi'

export const orderValidation = Joi.object({
    product_id: Joi.string().required().messages({
        'any.required': 'Field Product Id is Required',
    }),
    total_product: Joi.number().required().positive().messages({
        'number.base': 'Field Total Product must be a valid number.',
        'number.positive': 'Field Total Product must be a positive value ',
        'any.required': 'Field Total Product is Required',
    }),
    total_price: Joi.number().required().positive().messages({
        'number.base': 'Field Total Price must be a valid number.',
        'number.positive': 'Field Total Price must be a positive value ',
        'any.required': 'Field Total Price is Required',
    }),
})
