import { addDoc, collection, updateDoc, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../index.js'
import { getUser } from '../ulti/common.js'

export const addPostToUser = async (req, res, next) => {
  try {
    const user = await getUser(res, req.body.userId)
    const userRef = doc(db, 'users', user[0].docId)

    const postRef = doc(db, 'posts', req.body.postId)

    const posts = user[0].posts ? user[0].posts : []

    await updateDoc(postRef, {
      userId: user[0].userId,
      postId: req.body.postId
    })

    await updateDoc(userRef, {
      posts: [...posts, req.body.postId]
    })

    res.status(200).json({ success: true, message: 'complete' })
  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}

export const getUserPost = async (req, res, next) => {
  try {
    let posts = null
    if (req.query.userId) {
      const user = await getUser(res, req.query.userId)
      if (user[0].posts) {

        const userPosts = user[0].posts

        const result = Promise.all(userPosts.map(async post => {
          const resPost = await getDoc(doc(db, "posts", post))
          return resPost.data()
        }))
        posts = await result
      }else{
        posts = []
      }
    } else {
      const postRes = []
      const result = await getDocs(collection(db, "posts"))
      result.forEach((doc) => {

        postRes.push(doc.data())
      })
      posts = postRes
    }

    res.status(200).json({ success: true, data: posts })
  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}

