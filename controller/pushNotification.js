import { getAllUsers } from "../ulti/common.js"
import FCM from "fcm-node"
import { async } from "@firebase/util"

const SERVER_KEY = "AAAAUhHgYXE:APA91bE7LWKLslUIL_PfMyFeZWnko8cIF03U_7WF5A-SbsXYIPsolC8KxOf4xnkBiLK3xWHdmGe4BupCyvY1H4-hb9ikrN8l3xg7ohTOfwSDf6W4odfaKSomp2wT-jPq1dVE72OGoS1U"

export const pushCommon = async (req, res, next) => {
  const devices = await getAllUsers(res)



  let fcm = new FCM(SERVER_KEY)

  let message = {
    to: req.body.currentToken,
    notification: {
      title: req.body.title,
      body: req.body.body,
      sound: 'default',
      "click_action": "FCM_PLUGIN_ACTIVITY",
      "icon": "fcm_push_icon"
    }
  }

  fcm.send(message, (err, response) => {
    if (err) {
      res.status(200).json({success:false, err})
    } else {
      res.status(200).json(response)
    }
  })

}

export const pushSpecific = async (req, res, next) => {
  const devices = await getAllUsers(res)



  let fcm = new FCM(SERVER_KEY)

  let message = {
    to: req.body.currentToken,
    notification: {
      title: req.body.title,
      body: req.body.body,
      sound: 'default',
      "click_action": "FCM_PLUGIN_ACTIVITY",
      "icon": "fcm_push_icon"
    }
  }

  fcm.send(message, (err, response) => {
    if (err) {
      res.status(200).json({success:false, err})
    } else {
      res.status(200).json(response)
    }
  })

}
// 
// export const subscribDevice = async (req, res,next) => {
//   const registrationTokens = await getAllDevice(res)
//   
//   // Subscribe the devices corresponding to the registration tokens to the
//   // topic.
//   try{
//     const message = getMessaging()
//     const response = await message.subscribeToTopic(registrationTokens, req.body.topic)
// 
//   }
//   catch(err){
//     res.status(200).json({success:false, err})
//   }
// 
// 
// }
