import Sequelize from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DATABASE_HOST
    },
);

const modelsToMap = ['User', 'Message'];

const models = modelsToMap.reduce((acc, model) => {
    acc[model] = sequelize.import('./' + model.toLowerCase() + "/" + model + ".model");

    return acc;
}, {});

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export {sequelize};
export default models;
