import prisma from "../utils/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
  LoginValidation,
  RegisterValidation,
} from "../validation/AuthValidation.js"
export const RegisterSeller = async (req, res) => {
  const { fullname, email, password, confPassword, address, no_hp } = req.body
  const validate = RegisterValidation.validate(req.body, {
    allowUnknown: false,
  })
  if (validate.error) {
    let errors = validate.error.message
    return res.status(400).json({ message: `${errors}` })
  }
  const checkUser = await prisma.user.findFirst({
    where: {
      email: validate.email,
    },
  })
  if (checkUser) {
    return res
      .status(409)
      .json({ msg: "Email has been registered", status_code: 400 })
  }
  if (password !== confPassword) {
    return res.status(400).json({ message: `Confirm Password Does'nt Match` })
  }
  const salt = 10
  const hashPassword = await bcrypt.hash(password, salt)

  try {
    await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashPassword,
        address,
        no_hp,
        role: "Seller",
      },
    })
    res.status(201).json({ msg: "Register Successfully", status_code: 201 })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}
export const RegisterCustomer = async (req, res) => {
  const { fullname, email, password, confPassword, address, no_hp } = req.body
  const validate = RegisterValidation.validate(req.body, {
    allowUnknown: false,
  })
  if (validate.error) {
    let errors = validate.error.message
    return res.status(400).json({ message: `${errors}` })
  }
  const checkUser = await prisma.user.findFirst({
    where: {
      email: validate.value.email,
    },
  })
  if (checkUser) {
    return res
      .status(409)
      .json({ msg: "Email has been registered", status_code: 400 })
  }
  if (password !== confPassword) {
    return res.status(400).json({ message: `Confirm Password Does'nt Match` })
  }
  const salt = 10
  const hashPassword = await bcrypt.hash(password, salt)

  try {
    await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashPassword,
        address,
        no_hp,
      },
    })
    res.status(201).json({ msg: "Register Successfully", status_code: 201 })
  } catch (error) {
    return res.status(400).json({ message: error.message })
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
    return res.status(400).json({ message: `${errors}` })
  }
  const user = await prisma.user.findFirst({
    where: {
      email: validate.value.email,
    },
  })
  if (!user) return res.status(404).json({ message: "Account does not exist" })
  const match = await bcrypt.compare(validate.value.password, user.password)
  if (!match)
    return res.status(404).json({ message: "Wrong email or password" })
  const payload = {
    user_id: user.id,
    user_email: user.email,
    user_name: user.name,
    user_role: user.role,
  }

  const access_token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "15s",
  })
  const refresh_token = jwt.sign(payload, process.env.SECRET_KEY2, {
    expiresIn: "1d",
  })
  try {
    await prisma.user.update({
      data: {
        refresh_token,
      },
      where: {
        id: user.id,
      },
    })
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({ access_token })
  } catch (error) {
    return res.status(404).json({ message: "Account does not exist" })
  }
}
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refresh_token
  if (!refreshToken) return res.status(204).json({ msg: "No Content 🚫" })
  const user = await prisma.user.findFirst({
    where: {
      refresh_token: refreshToken,
    },
  })
  if (!user) return res.status(204).json({ msg: "No Content 🚫" })
  await prisma.user.update({
    data: { refresh_token: null },
    where: { id: user.id },
  })
  res.clearCookie("refresh_token")
  return res.status(200).json({ msg: "Logout Success" })
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken)
      return res.status(401).json({ msg: "Unauthorized,You must login 🔏" })
    const user = await prisma.user.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    })
    if (!user) return res.status(403).json({ msg: "Access Forbidden 🔏" })
    jwt.verify(refreshToken, process.env.SECRET_KEY2, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ msg: "Access Forbidden,Token Is Invalid or Expired 🔏 " })
      }
      const payload = {
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
        user_role: user.role,
      }
      const access_token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "15s",
      })
      return res.json({ access_token })
    })
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
}
