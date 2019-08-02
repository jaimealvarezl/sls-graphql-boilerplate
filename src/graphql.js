import {ApolloServer, AuthenticationError} from 'apollo-server-lambda';
import models, {sequelize} from './feature/models';
import schema from './feature/schema'
import resolvers from './feature/resolvers'
import jwt from 'jsonwebtoken';


const getCurrentUser = async req => {
    const token = req.headers.authorization;


    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (e) {
            throw new AuthenticationError('Your session expired. Sign in again.')
        }
    }
};

const eraseDatabaseOnSync = true;

const createUsersWithMessages = async () => {
    await models.User.create(
        {
            username: 'rwieruch',
            email: 'hello@robin.com',
            password: 'rwieruch',
            messages: [
                {
                    text: 'Published the Road to learn React',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );

    await models.User.create(
        {
            username: 'ddavids',
            email: 'hello@david.com',
            password: 'ddavids',
            messages: [
                {
                    text: 'Happy to release ...',
                },
                {
                    text: 'Published a complete ...',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );
};


sequelize.sync({force: eraseDatabaseOnSync}).then(async () => {
    if (eraseDatabaseOnSync) {
        await createUsersWithMessages();
    }
});


const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
        const message = error.message
            .replace('SequelizeValidationError: ', '')
            .replace('Validation error: ', '');
        return {...error, message};
    },
    context: async ({req}) => {
        const currentUser = await getCurrentUser(req);

        return ({
            models,
            currentUser,
            secret: process.env.SECRET
        })
    },
    cors: {origin: '*', credentials: true}
});


export const graphqlHandler = server.createHandler();
