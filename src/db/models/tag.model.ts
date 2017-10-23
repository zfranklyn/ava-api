import * as Sequelize from 'sequelize';
import { db } from './../_db';

export interface ITag {
  text: string;
  color: Color;
}

export enum Color {
  BLUE = '#0E5A8A',
  GREEN = '#0A6640',
  ORANGE = '#A66321',
  RED = '#A82A2A',
  VERMILLION = '#9E2B0E',
  ROSE = '#A82255',
  VIOLET = '#5C255C',
  INDIGO = '#5642A6',
  COBALT = '#1F4B99',
  TURQUOISE = '#008075',
  FOREST = '#1D7324',
  LIME = '#728C23',
  GOLD = '#A67908',
  SEPIA = '#63411E',
}

export const TagModel = db.define('tag', {
  text: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  color: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '#137CBD',
  },
});
