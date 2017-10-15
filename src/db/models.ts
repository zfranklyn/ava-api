import * as Sequelize from 'sequelize';

import { db } from './_db';

// tslint:disable
export const Researcher = db.define('researcher', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    tel: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

export const Participant = db.define('participant', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    tel: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // teacher, student, administrator, parent
    role: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
});

export const Message = db.define('message', {
    text: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    // Survey, Reminder, or Custom Message?
    type: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    // Email or SMS?
    medium: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});

export const Tag = db.define('tag', {
    text: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#137CBD',
    }
});

export const Study = db.define('study', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    metadata: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '{}', // stringified JSON
    }
});

export const Task = db.define('task', {
    timestamp: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    type: {
        type: Sequelize.ENUM('SMS', 'EMAIL', 'REMINDER', 'MESSAGE', 'RESET'),
        allowNull: false,
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
})
