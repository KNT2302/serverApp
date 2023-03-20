import { gql } from "apollo-server-express"

export const typeDefs = gql`
type Query {
  Users: [User]
  Chat:Chat
}

type User {
  currentToken: String
  lastCreate: String
  userId: String
  displayName:String
  urlPhoto: String
}
type Chat {
  idChat: String
  messenger:[Messenge]
}

type Messenge {
  text: String
  id: String
  userId: String
}

`
