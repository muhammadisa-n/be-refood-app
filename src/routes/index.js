import express from "express"
import jwt from "jsonwebtoken"
import AuthRoutes from "./AuthRoutes.js"
import userRoutes from "./UserRoutes.js"
import productRoutes from "./ProductRoutes.js"
import sellerRoutes from "./SellerRoutes.js"
const router = express.Router()
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Server its Works  🚀 ",
    author: "Muhammad Isa",
    status_code: 200,
  })
})
router.get("/api", (req, res) => {
  res.status(200).json({
    message: "Api its Works, Welcome 🖐 ",
    author: "Muhammad Isa",
    status_code: 200,
  })
})
router.use("/api/", AuthRoutes)
router.use("/api/", userRoutes)
router.use("/api/", productRoutes)
router.use("/api/", sellerRoutes)
router.get("/api/loggedIn", (req, res) => {
  const token = req.cookies.auth_token
  if (!token)
    return res.json({
      data: {
        status: false,
        user: null,
      },
    })
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err) {
      return res.json({
        data: {
          status: false,
          user: null,
        },
      })
    }
    return res.json({
      data: {
        status: true,
        user: {
          fullname: data.user_fullname,
          role: data.user_role,
        },
      },
    })
  })
})
router.use("*", (req, res) => {
  res.status(404).json({
    message: "Request Not Found, Bad Request",
    status_code: 404,
  })
})
export default router
