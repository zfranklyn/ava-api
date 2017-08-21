# AVA: Automated Virtual Assessment (API)

## AVA Database Schema
#### Participant
##### Fields:
- name
- tel
- email

Associations:
Participant hasMany Messages
Participant hasMany Studies
Participant belongsTo Group
Participant hasMany Tags
Researcher
Fields:
name
tel
email
username
password

Associations:
Researcher hasMany Studies
Researcher hasMany Messages
Message
Fields:
text
format (enum: “sms”, “email”)
timestamp
type (message, reminder, survey)

Associations:
Message belongsTo Participant
Message belongsTo Participant
Message belongsTo Study
Message hasMany Tags

Tags
Fields:
name
description

Associations:
NA

Participant
Fields:
name
tel
email
notes (text)

Associations:
Participant hasMany Messages
Participant hasMany Studies

Study
A study should have a set of Tasks, where researchers can predefine messages to send. Researcher should be able to send “informal messages” to subsets of participants.
Fields:
- name
- description
- message_schedule (CRON)
- reminder_schedule (CRON)
- start_date
- end_date

Associations:
- Study hasMany Participants
- Study belongsToMany Researchers



