import { db } from './_db';

// Import DB Models
import { UserModel } from './models/user.model';
import { MessageModel } from './models/message.model';
import { StudyModel } from './models/study.model';
import { TagModel } from './models/tag.model';
import { TaskModel } from './models/task.model';

// Define relationships between models
UserModel.hasMany(TagModel);
UserModel.belongsToMany(StudyModel, {through: 'UserStudy'});
StudyModel.belongsToMany(UserModel, {through: 'UserStudy'});
UserModel.hasMany(MessageModel);
MessageModel.belongsTo(StudyModel);

StudyModel.hasMany(TagModel);
StudyModel.belongsTo(UserModel, {as: 'Creator'});
StudyModel.hasMany(TaskModel);
TaskModel.belongsTo(StudyModel);

export default db;
