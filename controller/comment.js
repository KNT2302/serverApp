import { addDoc, collection, doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "../index.js"
import { getAll } from "../ulti/common.js"

export const create = async (req, res, next) => {

  const newComment = async () => {
    const commentRef = await addDoc(collection(db, "comments"), {
      text: req.body.text,
      reply: [],
    })

    const commentUpdateRef = doc(db, 'comments', commentRef._key.path.segments[1])

    await updateDoc(commentUpdateRef, {
      commentId: commentRef._key.path.segments[1]
    })
    return commentRef
  }


  try {

    const createdComment = await newComment()
    if (req.body.postId) {
      const postRef = doc(db, "posts", req.body.postId)



      const comment = req.body.comment ? req.body.comment : []

      updateDoc(postRef, {
        comment: [...comment, createdComment._key.path.segments[1]]
      })
    }

    if (req.body.commentId) {
      const commentRef = doc(db, "comments", req.body.commentId)

      const reply = req.body.reply ? req.body.reply : []

      updateDoc(commentRef, {
        reply: [...reply, createdComment._key.path.segments[1]]
      })

    }

    res.status(200).json({ success: true, data: { commentId: createdComment._key.path.segments[1] } })

  } catch (err) {
    res.status(200).json({ success: false, err })
  }

}

export const get = async (req, res, next) => {

  const getComment = (commentIds) => {

    return Promise.all(commentIds.map(async (commentId) => {
      const comment = await getDoc(doc(db, 'comments', commentId))

      if (comment.data().reply.length > 0) {

        return { ...comment.data(), reply: await getComment(comment.data().reply) }
      }
      else {
        return comment.data()
      }
    }))
  }
  try {
    const response = await getComment(JSON.parse(req.query.reply))
    res.status(200).json({ success: true, data: response })
  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}
