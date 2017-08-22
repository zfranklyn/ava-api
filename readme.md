# AVA Database Schema

The following notes outline the relational database schema for AVA's backend system. We'll use [Sequelize](http://docs.sequelizejs.com/), a Node.js ORM for RDBs, and host our Postgres DBs on Amazon Redshift.


### Participant
Participant can be created in three ways: 1) manually created by a Researcher, 2) be sent a customized link to a Participant creation form, 3) navigate to a vanilla creation page and create themselves from scratch.

##### Fields:
* name
* tel (SMS authentication for login)
* email
* notes (custom text description of user)

##### Associations:
* Participant hasMany Messages
* Participant hasOne Thread
* Participant hasMany Studies
* Participant belongsTo Group
* Participant hasMany Tags
* Researcher

##### Fields:
* name
* tel
* email
* username
* password

##### Associations:
* Researcher hasMany Studies
* Researcher hasMany Messages
* Researcher hasMany Tags
* Researcher BelongsToMany Groups
* Researcher BelongsToMany Studies

### Message
A message is a generic communication class. Researchers can send dynamic messages with interpolated data. Even automatic system messages have an associated Researcher, because it is the Researcher who set up the automated sending.

##### Fields:
* text
* format (enum: “sms”, “email”)
* timestamp
* payload (JSON object allows us to interpolate dynamic data into string)
* automated (boolean)
* type (message, reminder, survey)

##### Associations:
* Message belongsTo Participant
* Message belongsTo Researcher
* Message belongsTo Study
* Messages are either sent as part of a Study, or they are not (ad hoc messages)
	* This allows us to see which messages have been sent as part of a Study
* Message belongsTo Thread
* Message hasMany Tags
* Thread
* Messages can only exist between two parties (group messages don’t make sense in a system like this), therefore Messages must belong to a Thread. 

##### Fields:
* name
* permissions (TBD)

##### Associations:
*Thread hasMany Messages
* Thread hasMany Researchers
* All communication between researchers (from various different studies) and the participant belong in a single thread
* Thread belongsTo Participant
* Thread hasMany Tags

### Group
##### Description:
Group can be a school, a company etc. Specific subcategories (e.g., teachers, students, administrators) are set using Tags. You can also create your own groups out of participants from different schools (i.e., there can be overlaps). You can create studies within Groups.

##### Fields:
* name
* tags
* description
* location?

##### Associations:
* Group hasMany Tags
* Group hasMany Participants
* Group hasMany Researchers
* Group hasMany Studies

### Tags
##### Description:
Tags are a way to assign unstructured data to various other pieces of data. For instance, a participant may be associated with “Teacher”, or with a custom tag of “Does not want to receive messages”; a Group (e.g., school) can also be associated with a tag of “SMS-only”. 

##### Characteristics (Tags should be...):
* Renameable (all corresponding items should be renamed)
* Deletable (all corresponding items should remove the tag)

##### Fields:
* name
* description

##### Associations:
* NA

### Study
A Study must have a corresponding “parent” Group, and cannot be standalone (if you want to create an intra-group study, you must first create a new Group). 

A study is essentially a single scheduled message with follow-up reminders

A study should have a set of Tasks, where researchers can predefine messages to send. Researcher should be able to send “informal messages” to subsets of participants.

##### Fields:
* name
* description
* active (boolean)
* message_schedule (array of strings, each a timestamp)
* reminder_schedule (array of strings, each a timestamp)
* start_date
* end_date

##### Associations:
* Study hasMany Participants
* Study belongsToMany Researchers
* Study hasMany Tags
* Study belongsTo Group

## Scheduling System Overview
Active studies contain messages that are sent automatically according to a Researcher-defined schedule. How does it work?

Every time one of the following happens:
* API server is reset
* A Study is activated/deactivated
* CRUD actions are performed on a Study
* 00:00 CT has passed

The API server will query the DB for all studies, and use setTimeout to schedule associated tasks. For instance, the API server will iterate through every single active study, and create tasks from startup until 00:00



