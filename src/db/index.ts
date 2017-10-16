import { db } from './_db';

// Import DB Models
import { MessageModel, UserModel, StudyModel, TagModel, TaskModel } from './models';

// Define relationships between models

UserModel.hasMany(TagModel);
UserModel.belongsToMany(StudyModel, {through: 'UserStudy'});
UserModel.hasMany(MessageModel);

MessageModel.hasOne(UserModel, {as: 'sender'});
MessageModel.hasOne(UserModel, {as: 'recipient'});

StudyModel.hasMany(TagModel);
StudyModel.hasMany(TaskModel);

export default db;
