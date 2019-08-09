import {ForbiddenError} from 'apollo-server-lambda';

const messageResolvers = {
    Query: {
        messages: async (parent, args, {models, user}) => {
            console.log({user});

            return models.Message.findAll();
        },
        message: async (parent, {id}, {models}) => {
            return models.Message.findByPk(id);
        },
    },

    Mutation: {
        createMessage: async (parent, {text}, {me, models}) => {
            if (!me) {
                throw new ForbiddenError('Not Authenticated as user.')
            }


            try {
                return await models.Message.create({
                    text,
                    userId: me.id
                });
            } catch (e) {
                throw new Error(e);
            }
        },

        deleteMessage: async (parent, {id}, {models}) => {
            return models.Message.destroy({where: {id}});
        },
        updateMessage: async (parent, {message}, {models}) => {
            const {id, text} = message;
            const {[id]: messageToUpdate} = models.messages;

            const messageToupdate = await models.Message.findByPk(id);
            if (!messageToupdate) {
                return null;
            }

            await messageToupdate.update({
                text
            });

            return messageToUpdate;
        }
    },

    Message: {
        user: async (message, args, {models}) => {
            return models.User.findByPk(message.userId);
        },
    },
};

export default messageResolvers;
