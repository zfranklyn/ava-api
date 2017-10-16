// tslint:disable
const debug = require('debug')('debug/study-method');

import { StudyModel, IStudy } from './../models/study.model';

interface INewStudy {
  title: string;
  description: string;
  metadata: any; // should come in as a JS object
}

const createStudy = (params: INewStudy) => {
  debug('Creating Study');
  const newStudyParams: IStudy = {
    title: params.title,
    description: params.description,
    metadata: JSON.stringify(params.metadata),
  };

  return StudyModel.create(newStudyParams);
};
