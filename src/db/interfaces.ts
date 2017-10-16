// Interfaces for all DB models
// tslint:disable
import { Instance } from 'sequelize';

export type RoleType =
  'TEACHER'
  | 'STUDENT'
  | 'ADMIN'
  | 'PARENT'
  | 'OTHER';

export const Roles = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  OTHER: 'OTHER',
}

export type MessageType =
  'SURVEY'
  | 'REMINDER'
  | 'CUSTOM';

export type MediumType =
  'EMAIL'
  | 'SMS'
  | 'APP';

export type TaskType =
  'SMS'
  | 'EMAIL'
  | 'REMINDER'
  | 'MESSAGE'
  | 'RESET';

export interface IMessage {
  text: string;
  type: MessageType;
}

export interface IResearcher {
  name: string;
  email: string;
  tel: string;
  username: string;
  password: string;
}

export interface IResearcherInstance extends Instance<IResearcher> {
  dataValues: IResearcher;
}

export interface IStudy {
  title: string;
  description: string;
  metadata: string;
}

export interface ITag {
  text: string;
  color: string;
}

export interface ITask {
  timestamp: string;
  type: TaskType;
  message: string;
  completed: boolean;
}

export interface IParticipant {
  name: string;
  email: string;
  tel: string;
  role: RoleType;
  notes: string;
}

export interface IParticipantInstance extends Instance<IParticipant> {
  dataValues: IParticipant;
}
