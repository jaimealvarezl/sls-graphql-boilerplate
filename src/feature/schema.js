import {gql} from 'apollo-server-lambda';

import userSchema from './user/user.schema';
import messageSchema from './message/message.schema'

const linkSchema = gql`
    scalar  Date

    type Query{
        _: Boolean
    }
    type Mutation {
        _:Boolean
    }

    type Subscription {
        _:Boolean
    }
`;


export default [linkSchema, userSchema, messageSchema]
