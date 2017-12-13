// tslint:disable
const debug = require('debug')('debug/cron');
// tslint:enable
import { CronJob } from 'cron';
import { TaskModel } from './../db/models/index';
import * as moment from 'moment';
import { messageService } from './../services/message.service';
import {
  MESSAGE_MEDIUM,
  MediumType,
  MessageType,
} from './../db/sharedTypes/index';

export const schedule = new CronJob('0,30 * * * * *', () => {
  // console.log('Time');
  TaskModel.findAll({
    where: {
      completed: 'false',
      scheduledTime: {
        lt: moment(Date()).add(30, 'seconds').format(),
      },
    },
  })
  .then((allUpcomingTasks: any[]) => {
    /*
    Execution Steps:
    1. Get the original study
    2. Get the original study's users
    3. Send message to those users
    */
    if (allUpcomingTasks.length) {
      allUpcomingTasks.forEach(async (task: any) => {
        task.completed = true;
        await task.save();
        return task.getStudy()
        .then((study: any) => {
          return study.getUsers()
            .then((allUsers: any[]) => {
              allUsers.forEach((user: any ) => {
                let { mediumType, messageType, message, subject } = task;

                const dataToInterpolate = Object.assign(
                  {},
                  JSON.parse(study.metadata),
                  user.dataValues,
                  JSON.parse(user.dataValues.metadata),
                );

                try {
                  message = messageService.interpolateMessage(message, dataToInterpolate);
                  debug(`Interpolated message:`);
                  debug(`${message}`);
                } catch (err) {
                  debug(err);
                  return;
                }

                debug('Sending message:');
                switch (mediumType) {
                  case MESSAGE_MEDIUM.SMS:
                    messageService.sendSMSHelper({
                      message,
                      recipient: user.tel,
                    }, (err: Error, data: any) => {
                      if (err) {
                        debug(`Failed: SMS failed to send`);
                        debug(err);
                      } else {
                        debug(`Success: SMS Sent`);
                        messageService.createMessage({
                          message,
                          mediumType: MESSAGE_MEDIUM.SMS as MediumType,
                          messageType: messageType as MessageType,
                          userId: user.id,
                        })
                          .then(() => {
                            debug('Success: message record created');
                          })
                          .catch((errorCreate: Error) => {
                            debug('Failed: message record creation failed');
                            debug(errorCreate);
                          });
                      }
                    });
                    break;
                  case MESSAGE_MEDIUM.EMAIL:
                    messageService.sendEmailHelper({
                      messageType,
                      message,
                      subject,
                      userId: user.id,
                      emailAddress: user.email,
                    }, (err: Error, data: any) => {
                      if (err) {
                        debug(`Failed: email failed to send`);
                        debug(err);
                      } else {
                        debug(`Success: email sent`);
                        debug(data);
                        messageService.createMessage({
                          message,
                          mediumType: MESSAGE_MEDIUM.EMAIL as MediumType,
                          messageType,
                          userId: user.id,
                        })
                          .then(() => {
                            debug('Success: message record created');
                          })
                          .catch((messageCreationError: Error) => {
                            debug('Success: message record created');
                            debug(messageCreationError);
                          });
                      }
                    });
                    break;
                  case MESSAGE_MEDIUM.APP:
                    debug(`UNIMPLEMENTED: sending APP message`);
                    break;
                  default:
                    debug(`Default`);
                    break;
                }
              });
            });
        });
      });
    } else {
      // debug('No Tasks');
    }
  });
});
