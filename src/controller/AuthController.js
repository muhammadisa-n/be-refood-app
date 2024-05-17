import prisma from "../utils/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
  LoginValidation,
  RegisterValidation,
} from "../validation/AuthValidation.js"
export const Register = async (req, res) => {
  const {
    fullname,
    email,
    password,
    confPassword,
    province,
    city,
    district,
    village,
    postal_code,
    address,
    no_hp,
    role,
  } = req.body
  const validate = RegisterValidation.validate(req.body, {
    allowUnknown: false,
  })
  if (validate.error) {
    let errors = validate.error.message
    return res.status(400).json({ message: `${errors}`, status_code: 400 })
  }
  const checkUser = await prisma.user.findFirst({
    where: {
      email: validate.value.email,
    },
  })
  console.log(checkUser)
  if (checkUser) {
    return res
      .status(409)
      .json({ message: "Email has been registered", status_code: 409 })
  }
  if (password !== confPassword) {
    return res
      .status(400)
      .json({ message: `Confirm Password Does'nt Match`, status_code: 400 })
  }
  const salt = 10
  const hashPassword = await bcrypt.hash(password, salt)

  try {
    await prisma.user.create({
      data: {
        fullname: validate.value.fullname,
        email: validate.value.email,
        password: hashPassword,
        province: validate.value.province,
        city: validate.value.city,
        district: validate.value.district,
        village: validate.value.village,
        postal_code: validate.value.postal_code,
        address: validate.value.address,
        no_hp: validate.value.no_hp,
        role: validate.value.role,
        verified_at: true,
      },
    })
    res.status(201).json({
      message: "Register Successfully, Please check your email to verify",
      status_code: 201,
    })
  } catch (error) {
    return res.status(501).json({ message: error.message, status_code: 501 })
  }
}

export const Login = async (req, res) => {
  const { email, password } = req.body
  const validate = LoginValidation.validate(req.body, {
    // abortEarly: false,
    allowUnknown: false,
  })
  if (validate.error) {
    let errors = validate.error.message
    return res.status(400).json({ message: `${errors}`, status_code: 400 })
  }
  const user = await prisma.user.findFirst({
    where: {
      email: validate.value.email,
    },
  })
  if (!user)
    return res
      .status(404)
      .json({ message: "Account does not exist", status_code: 404 })
  const match = await bcrypt.compare(validate.value.password, user.password)
  if (!match)
    return res
      .status(404)
      .json({ message: "Wrong email or password", status_code: 404 })
  if (user.verified_at !== true) {
    return res
      .status(401)
      .json({ message: "Email Not Verified", status_code: 401 })
  }
  const payload = {
    user_id: user.id,
    user_email: user.email,
    user_fullname: user.fullname,
    user_role: user.role,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  })
  try {
    await prisma.user.update({
      data: {
        token,
      },
      where: {
        id: user.id,
      },
    })
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({
      message: "Login Success",
      userdata: {
        user_fullname: user.fullname,
        user_role: user.role,
      },
      status_code: 200,
    })
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Account does not exist", status_code: 404 })
  }
}
export const logout = async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      token: req.cookies.auth_token,
    },
  })
  if (!user)
    return res
      .status(401)
      .json({ message: "Unauthorized,You must login  🔏", status_code: 401 })

  const id = user.id
  await prisma.user.update({
    data: { token: null },
    where: { id: id },
  })
  res.clearCookie("auth_token")
  return res.status(200).json({ message: "Logout Success", status_code: 200 })
}
