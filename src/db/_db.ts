import * as Sequelize from 'sequelize';
import * as AWS from 'aws-sdk';

const dbURI = 'postgres://localhost:5432/';
const dynamoURI = 'localhost:8000';

export const db  = new Sequelize(dbURI, {
    define: {
        timestamps: true,
    },
    logging: false,
});

AWS.config.update({region: 'us-west-2'});

export const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
