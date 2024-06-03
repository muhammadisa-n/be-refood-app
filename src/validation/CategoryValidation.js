import Joi from 'joi'

export const CategoryValidation = Joi.object({
    name: Joi.string().required().max(100).messages({
        'any.required': 'Field name is Required',
        'string.empty': 'Field name must be filled in',
        'string.max': 'Field name max 100 character',
    }),
})
