import * as Sequelize from 'sequelize';

const dbURI = 'abc';

export const db  = new Sequelize(dbURI, {
    define: {
        timestamps: true,
        underscored: true,
    },
    logging: false,
});
