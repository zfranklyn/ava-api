import * as Sequelize from 'sequelize';

const dbURI = 'postgres://localhost:5432/';

export const db  = new Sequelize(dbURI, {
    define: {
        timestamps: true,
        underscored: true,
    },
    logging: false,
});
