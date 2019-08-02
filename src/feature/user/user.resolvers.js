import jwt from 'jsonwebtoken';
import {AuthenticationError, UserInputError} from "apollo-server-lambda";

const createToken = async (user, secret, expiresIn) => {
    const {id, email, username} = user;
    return await jwt.sign({id, email, username}, secret, {expiresIn});
};

const userResolvers = {
    Query: {
        users: async (parent, args, {models}) => {
            return models.User.findAll();
        },
        user: async (parent, {id}, {models}) => {
            return models.User.findByPk(id);
        },
        me: async (parent, args, {models, currentUser}) => {
            if (!currentUser) {
                return null;
            }
            return models.User.findByPk(currentUser.id);
        },
    },

    Mutation: {
        signUp: async (parent, {username, email, password}, {models, secret}) => {
            const user = await models.User.create({
                username, email, password
            });

            return {token: await createToken(user, secret, '30m')}
        },
        signIn: async (
            parent,
            {login, password},
            {models, secret},
        ) => {
            const user = await models.User.findByLogin(login);

            if (!user) {
                throw new UserInputError(
                    'No user found with this login credentials.',
                );
            }

            const isValid = await user.validatePassword(password);

            if (!isValid) {
                throw new AuthenticationError('Invalid password.');
            }

            return {token: await createToken(user, secret, '30m')};
        },
    },

    User: {
        messages: async (user, args, {models}) => {
            return models.Message.findAll({
                where: {
                    userId: user.id,
                },
            });
        },
    },
};

export default userResolvers;
