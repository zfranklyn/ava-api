import { db } from './_db';

// Import DB Models
import {
  UserModel,
  MessageModel,
  StudyModel,
  TagModel,
  TaskModel,
  StatusModel,
} from './models/index';

// Define relationships between models
UserModel.hasMany(TagModel);
UserModel.belongsToMany(StudyModel, {through: 'UserStudy'});
StudyModel.belongsToMany(UserModel, {through: 'UserStudy'});
UserModel.hasMany(MessageModel);
MessageModel.belongsTo(StudyModel);

StudyModel.hasMany(TagModel);
StudyModel.belongsTo(UserModel, {as: 'Creator'});

// tasks
StudyModel.hasMany(TaskModel);
TaskModel.belongsTo(StudyModel);
TaskModel.hasOne(StatusModel, { as: 'SurveyStatus'});
UserModel.hasMany(StatusModel, { as: 'SurveyStatus' });

export default db;
