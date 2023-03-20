import express from "express"
import { pushCommon, pushSpecific } from "../controller/pushNotification.js"

const router = express.Router()

router.post("/", pushSpecific)
// router.post("/subscribe", subscribDevice)

export default router
