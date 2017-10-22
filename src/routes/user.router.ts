// tslint:disable
const debug = require('debug')('debug/participant.router');
let express = require('express');
// tslint:enable

const UserRouter = express.Router();

UserRouter.get('/', (req: any, res: any, next: any) => {
  debug('hit participant.router GET');
  res.send('respond with a resource');
});

export { UserRouter };