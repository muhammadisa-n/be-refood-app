import Joi from 'joi'

export const VerificationSellerValidation = Joi.object({
    link_map: Joi.string().required().max(255).messages({
        'any.required': 'Field Link Map is Required',
        'string.empty': 'Field Link Map is not allowed to be empty',
        'string.max': 'Field Link Map max 255 character',
    }),
})
