import express from "express"
import AuthRoutes from "./AuthRoutes.js"
import userRoutes from "./UserRoutes.js"
const router = express.Router()
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Server its Works  🚀 ",
    status_code: 200,
    author: "Muhammad Isa",
  })
})
router.get("/api", (req, res) => {
  res.status(200).json({
    message: "Api its Works, Welcome 🖐 ",
    status_code: 200,
    author: "Muhammad Isa",
  })
})
router.use("/api/", AuthRoutes)
router.use("/api/", userRoutes)
router.use("*", (req, res) => {
  res.status(404).json({
    errors: "Request Not Found",
    message: "Bad Request",
    status_code: 404,
  })
})
export default router
