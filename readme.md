# Automated Virtual Assessment (AVA): API

### Introduction
Data collection in psychological research suffers from a critical problem of low response rates. Surveys are typically sent en masse via email or hardcopy, and their accompanying reminders fail to distinguish between participants who have completed the survey and those who have not. Automated Virtual Assessment (AVA) is a web-based research suite that allows researchers to enroll participants and send scheduled messages (via both email and SMS) to these participants. This system attempts to increase response rates in two ways: first, it allows participants to receive survey links and accompanying reminders via SMS - a medium less cluttered than email inboxes; second, the system allows researchers to send personalized reminders (based on whether a participant as completed a survey) without compromising user identity, thus providing a secure channel to prompt users. 

This github repository contains code for AVA's API.

### How to Run Locally
In order to run AVA, you must run both `ava-ui` and `ava-api` concurrently. To run `ava-api`, do the following:
1. Clone the repository: `git clone https://github.com/zfranklyn/ava-api.git`
2. Install Postgres locally [link](https://www.postgresql.org/download/)
3. `cd` into the root directory `/ava-api`
4. Run `yarn` to install relevant packages
5. Run `yarn start`. Server will be listening on `localhost:8080`

### Backend Design and Implementation
AVA’s server-side code was written in Typescript using the following libraries:
* Node.js, which enabled development with server-side Javascript (compiled from Typescript)
* Express, which created an easily customizable web server
* Sequelize ORM, which enabled interaction with a Postgres database

#### Database and Schema Design
While writing feature specifications for AVA, the author realized that there were many relationships between users, studies, tasks, and messages, and that this was best represented with a relational database. The author picked Postgres because it was open source, and also because it supported arrays as a data type.

The relationships between concepts is best illustrated in the following (hopefully self-documenting) [code snippet](/src/db/index.ts):
```
  UserModel.hasMany(TagModel);
  UserModel.belongsToMany(StudyModel, {through: 'UserStudy'});
  StudyModel.belongsToMany(UserModel, {through: 'UserStudy'});
  UserModel.hasMany(MessageModel);
  MessageModel.belongsTo(StudyModel);

  StudyModel.hasMany(TagModel);
  StudyModel.belongsTo(UserModel, {as: 'Creator'});

  StudyModel.hasMany(TaskModel, { onDelete: 'cascade'});
  TaskModel.belongsTo(StudyModel);
  TaskModel.hasMany(StatusModel, { as: 'SurveyStatus', onDelete: 'cascade'});
  UserModel.hasMany(StatusModel, { as: 'SurveyStatus', onDelete: 'cascade' });
  TaskModel.hasOne(TaskModel, { // reminders are associated with a Parent Survey
    as: 'ParentSurveyTask',
    onDelete: 'cascade'},
  );
  TaskModel.hasMany(TaskModel, { as: 'Reminders'});

```

### Task Scheduling System
One of the core features of AVA is the ability to execute scheduled tasks. This feature was implemented using a CRON job that polled the database every 30 seconds for tasks within the current minute. If tasks were found, then the server would execute the task and mark it as complete.


### Messaging System
One core component to message sending is text interpolation — this is achieved by looking for variables enclosed with ${}, and replacing their contents with data associated with either a study or a user. This allows researchers to send personalized messages with ease, and without compromising user identity.

AVA leverages the Twilio API to send SMS, and Amazon’s Simple Email Service (SES) to send bulk messages. 
