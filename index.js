import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { Server } from "socket.io"
import http from "http"
import FCM from "fcm-node"

import { initializeApp } from "firebase/app"
import { getFirestore, getDocs, collection } from "firebase/firestore"
import tokenDeviceRoute from "./route/tokenDevice.js"
import pushNotificationRoute from "./route/pushNotification.js"
import userRoute from "./route/user.js"
import postRoute from "./route/post.js"
import commentRoute from "./route/comment.js"
import chatRoute from "./route/chat.js"
import missionRoute from "./route/mission.js"
import { ApolloServer } from "apollo-server-express"
import { getMessaging } from "firebase/messaging"
import { typeDefs } from "./graphql/schema.js"
import { resolvers } from "./graphql/resolvers.js"
import { async } from "@firebase/util"
import { connection } from "./socketIO.js"

var app = express()

const httpInstance = http.Server(app)

dotenv.config()

const firebaseConfig = {
  apiKey: "AIzaSyCnpivtvDO0XegoH96q7ncfa9IxoFIpkU8",
  authDomain: "fire-3f3bd.firebaseapp.com",
  projectId: "fire-3f3bd",
  storageBucket: "fire-3f3bd.appspot.com",
  messagingSenderId: "352487235953",
  appId: "1:352487235953:web:8a904eefc1d636f5fa56d0",
  measurementId: "G-L7PM1VZ6MK"
}

var port = 3000

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cache: "bounded"
    })

    const io = new Server(httpInstance, {
      cors: {
        origin: "*"
      }, maxHttpBufferSize: 1e8
    })

    await server.start()

    server.applyMiddleware({ app })

    io.on("connection", (socket) => {
      connection(socket)
      // ...
      socket.on("disconnect", () => {
        console.log(socket.id, "disconnected")
      })

      socket.on('send_message', (data) => {
        socket.to(data.room).emit("receive_message", data)
      })

      socket.on("join_room", (room) => {
        socket.join(room)
        console.log("joined ", room)
      })
      socket.on("leave_room", (room) => {
        socket.leave(room)
        console.log("leave ", room)
      })
    })

    httpInstance.listen({ port }, () => {
      console.log('Listening on port', server.graphqlPath)
    })

  } catch (err) {
    console.log(err)
  }

}



const firebase = initializeApp(firebaseConfig)

export const db = getFirestore(firebase)


startServer()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: false }))


app.use("/api/deviceToken", tokenDeviceRoute)
app.use("/api/pushNotification", pushNotificationRoute)
app.use("/api/user", userRoute)
app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)
app.use("/api/chat", chatRoute)
app.use("/api/mission", missionRoute)









