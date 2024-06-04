import Joi from 'joi'

export const adminValidation = Joi.object({
    name: Joi.string().optional().max(100).messages({
        'string.max': 'Field Name max 100 character',
    }),
})
