# AVA Database Schema

The following notes outline the relational database schema for AVA's backend system. We'll use [Sequelize](http://docs.sequelizejs.com/), a Node.js ORM for RDBs, and host our Postgres DBs on Amazon Redshift.


### Participant
Participant can be created in three ways: 1) manually created by a Researcher, 2) be sent a customized link to a Participant creation form, 3) navigate to a vanilla creation page and create themselves from scratch.

##### Fields:
* name
* tel (SMS authentication for login)
* email
* notes (custom text description of user)

### Message
How are messages sent?
* email
* SMS
This categorization directs messages to different APIs — SMS uses Twilio, email uses SendGrid

What types of messages are there?
* survey
* reminder
* custom message
This distinction is necessary to track when last surveys were sent, when last reminders were sent.

##### Fields
* title
* message
* medium (SMS, email)
* type (survey, reminder, customMessage)

### Tag
Tags are tagged onto entities in order to filter things. For instance, you could have a geographic tag of "Bhutan", or a functional tag of "biweekly survey". I'll leave it up to the Researcher to manage these tags. Why? Because I don't want to hardcode any preexisting categories for filtering in case the model we adopt now becomes obsolete.

### Metadata
Metadata can be associated with various types of users. For instance, researchers can define `noSMS: true` for a user that doesn't want to receive SMSs. 

This allows us to eventually build up more complicated logic (should need be). This should be defined in a NoSQL database.

### Study
A study is a scheduled messaging regime. It's probably safe to assume that in our MVP, we only need to consider surveys. A study needs to specify its base survey link and custom text.

Custom text interpolates the survey link and variables wherever users specify. Variables interpolatable include `userID`, user names, telephones etc (essentially whatever metadata we have on the users).

### Schedule
Schedule is an object that specifies when to do something.

### Task
Tasks are generated based off of schedules. Every time a study is edited, the server generates a list of tasks based off of their schedules. The server will then check every single minute to see if a task needs to be executed.

The task will pull data (text, survey links) from the most updated study information. Keep task data at a minimum (only time, study, target audience)

##### Creating a Study
1. Study is created with schedule (e.g., Monday & Wednesdsay at 4PM for the next eight weeks)
2. When you hit "Save", the server generates a list of tasks based on the schedule

##### Editing a study
