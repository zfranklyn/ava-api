import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as cors from 'cors';

import {
  MainRouter,
} from './routes';

const app: express.Application = express();

// view engine setup
// app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
app.use('/', MainRouter);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction): any => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500);
    res.json({
      error: err,
      message: err.message,
    });
  });
}

// production error handler
// no stacktraces leaked to user
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   res.status(err.status || 500);
//   res.send({
//     error: {},
//     message: err.message,
//   });
// });

export { app };
