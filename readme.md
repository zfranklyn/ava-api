# AVA Database Schema

The following notes outline the relational database schema for AVA's backend system. We'll use [Sequelize](http://docs.sequelizejs.com/), a Node.js ORM for RDBs, and host our Postgres DBs on Amazon RDS. Supplementary NoSQL databases will use AWS DynamoDB.

### Studies
User creates a study in order to schedule a survey for a group of participants. It represents one interaction with a group of people. 

User creates a study, specifying:
* What survey link to send
* Who the survey is sent to
* How the survey is sent (SMS, Email, App)
* How many reminders to set

User can also specify the specific text used in the messages.

User can also send mass announcements to users, and also filter that announcement by completion status.

### Recruitment
Participants are recruited to the platform through a few ways:

1. Sign up
Participants proactively go to a link, fill out a complete form.

2. Text signup link
Participants text a number, and receive a custom link to a semi-completed form

3. Manual Add
User can add a participant manually into the system

### Send Messages

### Tasks
A scheduled task can be specified to send a message, initiate a reset (to a data collection period), send a reminder, or simply send an announcement. 

The system will run a check every minute, and run tasks as they come up.

Example: we have a task that stipulates sending a survey to every student at Yale at 12:00PM. At 12:00PM, the system checks and discovers an active task at that minute, and executes it. It sends a couple thousand messages. 

How do we keep track of who's done a message, and who has not?

A Task is associated with a Study, which in turn is associated with Participants. Therefore, we should know exactly how many participants are involved. We need some way to keep track of who's done the survey and who hasn't. I think this should be linked to each individual task, because once a task is completed, it's done (and we want historic reference too, trackable back to participants).

If it's a survey task, then create a 'status' for every user, and use that to keep track of response rates.

That means reminders need to be linked with a 'parent' survey, so that they know who has/hasn't completed the survey.