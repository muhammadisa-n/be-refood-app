import prisma from "../utils/prisma.js"
export const IsSeller = async (req, res, next) => {
  const user = await prisma.user.findFirst({
    where: { id: req.userData.user_id },
  })
  if (user.role !== "Seller") {
    return res.status(403).json({
      message: "Access Forbidden ,You must be Seller",
      status_code: 403,
    })
  }
  next()
}
export const IsAdmin = async (req, res, next) => {
  const user = await prisma.user.findFirst({
    where: { id: req.userData.user_id },
  })
  if (user.role !== "Admin") {
    return res.status(403).json({
      message: "Access Forbidden ,You must be Admin",
      status_code: 403,
    })
  }
  next()
}
