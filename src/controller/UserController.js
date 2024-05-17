import prisma from "../utils/prisma.js"
import { UserValidation } from "../validation/UserValidation.js"
import path from "path"
import fs from "fs"
export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.userData.user_email,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        address: true,
        province: true,
        city: true,
        district: true,
        village: true,
        postal_code: true,
        no_hp: true,
        ava_image: true,
        url_image: true,
        role: true,
      },
    })
    if (!user)
      return res
        .status(200)
        .json({ msg: "User Not Found", user, status_code: 404 })
    return res
      .status(200)
      .json({ msg: "Data User Found", user, status_code: 200 })
  } catch (error) {
    return res.status(500).json({ msg: error.message, status_code: 500 })
  }
}
export const updateUser = async (req, res) => {
  const datavalidate = {
    fullname: req.body.fullname,
    city: req.body.city,
    province: req.body.province,
    district: req.body.district,
    village: req.body.village,
    postal_code: req.body.postal_code,
    address: req.body.address,
    no_hp: req.body.no_hp,
  }
  const validate = UserValidation.validate(datavalidate, {
    allowUnknown: false,
  })
  if (validate.error) {
    let errors = validate.error.message
    return res.status(400).json({ message: `${errors}`, status_code: 400 })
  }
  const user = await prisma.user.findFirst({
    where: { id: req.userData.user_id },
  })
  if (!user)
    return res.status(404).json({ message: "User not found", status_code: 404 })
  let filename = user.ava_image
  if (req.files !== undefined && req.files.ava_image !== undefined) {
    const file = req.files.ava_image
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const datenow = Date.now()
    filename = datenow + file.md5 + ext
    const allowedType = [".png", ".jpeg", ".jpg"]
    if (!allowedType.includes(ext.toLowerCase()))
      return res
        .status(422)
        .json({ message: "invalid type image", status_code: 422 })
    if (fileSize > 10000000)
      return res
        .status(422)
        .json({ message: "file to big minimum 10MB", status_code: 422 })
    const filepath = `./public/ava_images/${user.ava_image}`
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
    }
    file.mv(`./public/ava_images/${filename}`, (err) => {
      if (err)
        return res.status(500).json({ message: err.message, status_code: 500 })
    })
  }
  let url_image = ""
  if (filename === null) {
    url_image = null
  } else {
    url_image = `${req.protocol}://${req.get("host")}/ava_images/${filename}`
  }

  try {
    await prisma.user.update({
      where: { id: req.userData.user_id },
      data: {
        fullname: validate.value.fullname || user.fullname,
        city: validate.value.city || user.city,
        province: validate.value.province || user.province,
        district: validate.value.district || user.district,
        village: validate.value.village || user.village,
        postal_code: validate.value.postal_code || user.postal_code,
        address: validate.value.address || user.address,
        no_hp: validate.value.no_hp || user.no_hp,
        ava_image: filename,
        url_image: url_image || user.url_image,
      },
    })
    res.status(200).json({ msg: "User Updated", status_code: 200 })
  } catch (error) {
    return res
      .status(501)
      .json({ message: `${error.message}`, status_code: 501 })
  }
}
