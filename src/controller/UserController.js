import prisma from "../utils/prisma.js"
export const getUser = async (req, res) => {
  console.log(req.userData)
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userData.user_id,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        address: true,
        no_hp: true,
        ava_image: true,
      },
    })
    if (!user) return res.status(200).json({ msg: "Data Not Found", data })
    return res.status(200).json({ msg: "Data User Found", User: user })
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
}
