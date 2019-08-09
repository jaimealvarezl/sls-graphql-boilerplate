import Sequelize from 'sequelize';
import User from './user/user.model'
import Message from './message/message.model'

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DATABASE_HOST
    },
);

const models = {
    User: sequelize.import('User', require('./user/user.model')),
    Message: sequelize.import('Message', Message)
};

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export {sequelize};
export default models;
