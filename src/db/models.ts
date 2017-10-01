import * as Sequelize from 'sequelize';

import { db } from './db';

// tslint:disable
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
    }
});

export const Message = db.define('message', {
    sender: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    recipient: {
        type: Sequelize.STRING,
        allowNull: false,
    },
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
    }
});

export const Study = db.define('study', {
    surveyLink: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isURL: true,
        }
    },
    reminderText: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    timezone: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

export const Schedule = db.define('schedule', {
    startDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    // seconds elapsed since 00:00
    mondayTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 86400,
        }
    },
    tuesdayTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 86400,
        }
    },
    wednesdayTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 86400,
        }
    },
    thursdayTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 86400,
        }
    },
    fridayTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 86400,
        }
    },
    saturdayTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 86400,
        }
    },
    sundayTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 86400,
        }
    },

})
