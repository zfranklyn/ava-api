import { db } from './_db';

// Import DB Models
import { Message, Participant, Schedule, Study, Tag } from './models';

// Define relationships between models

Participant.hasMany(Tag);
Participant.belongsToMany(Study, {through: 'ParticipantStudy'});

Study.hasMany(Tag);
