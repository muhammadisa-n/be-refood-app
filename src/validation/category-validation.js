import Joi from 'joi'

export const categoryValidation = Joi.object({
    name: Joi.string().required().max(100).messages({
        'any.required': 'Field Name is Required',
        'string.empty': 'Field Name must  is not allowed to be empty',
        'string.max': 'Field Name max 100 character',
    }),
})
