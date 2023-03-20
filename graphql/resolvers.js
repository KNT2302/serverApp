import { async } from "@firebase/util"
import { getChat } from "./resolverController/Chat.js"
import { getUsers } from "./resolverController/User.js"

export const resolvers = {
  Query: {
    Users: (parent, args) => {
      return getUsers(parent, args)
    },
    Chat: (parent, args) => {
      return getChat(parent, args)
    }
  },
}

