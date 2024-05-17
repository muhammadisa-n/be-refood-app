import Joi from "joi"

export const UserValidation = Joi.object({
  fullname: Joi.string().optional().max(100).messages({
    "string.max": "Field Fullname max 100 character",
  }),
  province: Joi.string().optional().max(100).messages({
    "string.max": "Field province max 100 character",
  }),
  city: Joi.string().optional().max(100).messages({
    "string.max": "Field city max 100 character",
  }),
  district: Joi.string().optional().max(100).messages({
    "string.max": "Field district 100 max character",
  }),
  village: Joi.string().optional().max(100).messages({
    "string.max": "Field village max 100 character",
  }),
  postal_code: Joi.string().optional().max(100).messages({
    "string.max": "Field postal_code max 100 character",
  }),
  address: Joi.string().optional().max(255).messages({
    "string.max": "Field address max 255 character",
  }),
  no_hp: Joi.string().optional().min(12).max(15).messages({
    "string.min": "Field no_hp min 12 character",
    "string.max": "Field no_hp max 15 character",
  }),
})
