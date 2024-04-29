import Joi from "joi"
export const RegisterValidation = Joi.object({
  fullname: Joi.string().required().max(100).messages({
    "any.required": "Field Fullname is Required",
    "string.empty": "Field Fullname must be filled in",
    "string.max": "Field Fullname max 100 character",
  }),
  email: Joi.string().required().max(100).email().messages({
    "any.required": "Field email is Required",
    "string.email": "Field email is not valid email",
    "string.empty": "Field email must be filled in",
    "string.max": "Field email max 100 character",
  }),
  password: Joi.string().required().min(8).messages({
    "any.required": "Field password is Required",
    "string.empty": "Field password must be filled in",
    "string.min": "Field password min 8 character",
  }),
  confPassword: Joi.string().required().min(8).messages({
    "any.required": "Field confirm password is Required",
    "string.empty": "Field confirm password must be filled in",
    "string.min": "Field confirm password min 8 character",
  }),
  address: Joi.string().required().max(255).messages({
    "any.required": "Field address is Required",
    "string.empty": "Field address must be filled in",
    "string.min": "Field address min 100 character",
  }),
  no_hp: Joi.string().required().min(12).max(15).messages({
    "any.required": "Field no_hp is Required",
    "string.empty": "Field no_hp must be filled in",
    "string.min": "Field no_hp min 12 character",
    "string.max": "Field no_hp max 15 character",
  }),
})

export const LoginValidation = Joi.object({
  email: Joi.string().required().max(100).email().messages({
    "any.required": "Field email is Required",
    "string.email": "Field email is not valid email",
    "string.empty": "Field email must be filled in",
    "string.max": "Field email max 100 character",
  }),
  password: Joi.string().required().min(8).messages({
    "any.required": "Field password is Required",
    "string.empty": "Field password must be filled in",
    "string.min": "Field password min 8 character",
  }),
})
