import { db } from "../index.js"
import { getDoc, doc, updateDoc } from "firebase/firestore"

import { createOne, getUser } from "../ulti/common.js"

export const getChat = async (req, res, next) => {
  try {

    const chatSession = await getDoc(doc(db, 'chat', req.query.idChat))
    const getChatSellection = () => {
      const chatSellection = chatSession.data().messenger
      if (chatSellection) {
        const chatsObject = Promise.all(chatSellection.map(async (idChat) => {
          const chatObject = await getDoc(doc(db, 'messenger', idChat))
          return chatObject.data()
        }))
        return chatsObject
      } else {
        return []
      }
    }


    res.status(200).json({
      success: true, data: {
        idChat: chatSession.data().idChat,
        messenge: await getChatSellection()
      }
    })
  }

  catch (err) {
    res.status(200).json({ success: false, err })
  }
}

export const createMessenger = async (req, res, next) => {
  try {
    const docId = await createOne("messenger", {
      message: req.body.message,
      userId: req.body.userId,
      pictures: req.body.pictures
    }, res)



    const chatRef = doc(db, "chat", req.body.chatId)

    const getChatRef = await getDoc(chatRef)

    await updateDoc(chatRef, {
      messenger: [...getChatRef.data().messenger ? getChatRef.data().messenger : [], docId]
    })
    res.status(200).json({ success: true, message: 'created' })
  } catch (err) {
    console.log(err)
    res.status(200).json({ success: false, err })
  }
}



export const searchRoom = async (req, res, next) => {
  const getNames = async () => {
    const userId = req.query.userId
    const user = await getUser(req, userId)
    if (user[0].chat) {
      const chat = user[0].chat.filter((room) => {
        const name = room.split(":")[1]
        return name === req.query.name
      })
      return chat.map((room) => room.split(":")[0])
    } else {
      return []
    }
  }

  try {
    const chat = await getNames()

    const chatsInfo = Promise.all(chat.map(async (id) => {
      return await getInfoRoom(req, id, res)
    }))

    res.status(200).json({ success: true, data: await chatsInfo })
  } catch (error) {
    res.status(200).json({ success: false, error })
  }
}



const getInfoRoom = async (req, id, res) => {
  const chat = await getDoc(doc(db, 'chat', id))


  const friendId = chat.data().users.filter((userId) => userId !== req.query.userId)

  const friend = await getUser(res, friendId[0])

  let message = "null"
  if (chat.data().messenger) {

    const res = await getDoc(doc(db, 'messenger', chat.data().messenger[chat.data().messenger.length - 1]))
    message = res.data().message

  }

  return {
    query: id,
    name: friend[0] ? friend[0].displayName : "User",
    photoURL: friend[0] ? friend[0].photoURL : "",
    lastMessenge: message,
    userToken: friend[0] ? friend[0].currentToken : ""
  }
}

export const getRoom = async (req, res, next) => {
  try {
    const user = await getUser(res, req.query.userId)
    const chatIdArray = user[0].chat.map((room) => {
      return room.split(":")[0]
    })
    const chatRoom = Promise.all(chatIdArray.map(async (id, index) => {

      const room = await getInfoRoom(req, id, res)

      return room
    }))
    res.status(200).json({ success: true, data: await chatRoom })


  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}
