import { ApolloServer, AuthenticationError } from 'apollo-server-lambda';
import jwt from 'jsonwebtoken';
import models, { sequelize } from './feature/models';
import schema from './feature/schema';
import resolvers from './feature/resolvers';


const getCurrentUser = async (req) => {
  console.log({ req });

  const token = req.headers.authorization;


  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

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


sequelize.sync();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
    return { ...error, message };
  },
  context: async ({ event, ...rest }) => {
    const currentUser = await getCurrentUser(event);

    return ({
      models,
      currentUser,
      secret: process.env.SECRET,
    });
  },
  cors: { origin: '*', credentials: true },
});


export const graphqlHandler = server.createHandler();
