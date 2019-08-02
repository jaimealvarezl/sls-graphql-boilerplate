import {gql} from 'apollo-server-lambda'

export default gql`
    extend type Query {
        messages: [Message!]!
        message(id: ID!): Message!
    }

    extend type Mutation {
        createMessage(text: String!): Message!
        deleteMessage(id: ID!): Boolean!
        updateMessage(message: MessageInput!): Message
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }

    input  MessageInput  {
        id:ID
        text: String!
    }

`
