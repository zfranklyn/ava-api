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
UserModel.hasMany(MessageModel);

MessageModel.belongsTo(StudyModel);

StudyModel.hasMany(UserModel);
StudyModel.hasMany(TagModel);
StudyModel.hasMany(TaskModel);

export default db;
