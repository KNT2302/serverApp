
import { db } from "../index.js"
import { collection, addDoc, updateDoc, doc } from "firebase/firestore"
import { getAllFromArrayField, getAllUsers, getUser } from "../ulti/common.js"


export const login = async (req, res, next) => {

  const createNewUser = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      userId: req.body.userId,
      currentToken: req.body.currentToken,
      urlPhoto: req.body.photoURL,
      displayName: req.body.displayName,
      lastSignIn: req.body.lastSignIn,
    })


    const userRef = doc(db, 'users', docRef.id)

    await updateDoc(userRef, {
      docId: docRef.id
    })

  }


  const updateCurrentToken = async (res, req, user) => {

    const userRef = doc(db, "users", user.docId)

    await updateDoc(userRef, {
      currentToken: req.body.currentToken
    })

  }
  try {
    const users = await getAllUsers(res)
    const user = users.filter((user) => user.userId === req.body.userId)

    if (!user.length) {
      await createNewUser()
    }

    await updateCurrentToken(res, req, user[0])
    res.status(200).json({ success: true, data: "dvd" })
  } catch (error) {
    res.status(200).json({ success: false, error })
  }
}

export const get = async (req, res, next) => {
  try {
    const users = await getAllUsers(res)



    res.status(200).json({ success: true, data: users })
  } catch (error) {

    res.status(200).json({ success: false, error })
  }
}

export const makeFriend = async (req, res, next) => {
  try {
    const userId = req.body.userId
    const friendId = req.body.friendId
    const user = await getUser(res, userId)
    const friend = await getUser(res, friendId)
    const userDoc = doc(db, 'users', user[0].docId)
    const friendDoc = doc(db, 'users', friend[0].docId)

    const userFriend = user[0].friend ? user[0].friend : []
    const friendFriend = friend[0].friend ? friend[0].friend : []
    await updateDoc(userDoc, {
      friend: [...userFriend, friendId]
    })

    await updateDoc(friendDoc, {
      friend: [...friendFriend, userId]
    })

    const chatDoc = await addDoc(collection(db, "chat"), {
      users:[user[0].userId, friend[0].userId]
    })

    const chatRef = doc(db, 'chat', chatDoc.id)

    await updateDoc(chatRef, {
      chatId: chatDoc.id
    })




    res.status(200).json({ success: true })
  } catch (err) {
    res.status(200).json({ success: false })
  }
}

export const getFriend = async (req, res, next) => {
  try {
    const response = await getAllFromArrayField(req, res, "users", "friend")

    response = response.map()
    res.status(200).json({ success: true, data: response })
  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}






