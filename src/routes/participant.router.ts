let express = require('express');

const ParticipantRouter = express.Router();

ParticipantRouter.get('/', (req: any, res: any, next: any) => {
  res.send('respond with a resource');
});

export { ParticipantRouter };
