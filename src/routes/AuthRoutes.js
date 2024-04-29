import express from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js"
import {
  RegisterSeller,
  RegisterCustomer,
  Login,
  logout,
  refreshToken,
} from "../controller/AuthController.js"
// import { verifyToken } from "../middleware/AuthMIddleware.js"
const authRouter = express.Router()
authRouter.post("/auth/registerseller", RegisterSeller)
authRouter.post("/auth/registercustomer", RegisterCustomer)
authRouter.post("/auth/login", Login)
authRouter.get("/auth/token", refreshToken)
authRouter.delete("/auth/logout", logout)
export default authRouter
