import { BaseRegistered } from '../base-registered/index';

import { logger } from '../../common/logging/index';
import { contributionsDBService } from '../../common/db';

/*
 * Server start logic
 *
 * 1. register default activities and triggers.
 * 2. initialise the default engine (the test engine) and build engine.
 * 3. start the test engine.
 * 4. configure the server and start listening
 */

export function syncTasks(engine) {
  const contributionsRegistrator = new BaseRegistered(contributionsDBService);
  return contributionsRegistrator
    .clean()
    .then(() => contributionsRegistrator.syncDb(engine.getActivities()))
    .then(() => {
      logger.verbose('registerActivities success');
      return true;
    })
    .catch(err => {
      logger.error('registerActivities error');
      return Promise.reject(err);
    })
    .then(() => contributionsRegistrator.syncDb(engine.getTriggers()))
    .then(() => {
      logger.verbose('registerTriggers success');
      return true;
    })
    .catch(err => {
      logger.error('registerTriggers error');
      return Promise.reject(err);
    })
    .then(() => contributionsRegistrator.syncDb(engine.getFunctions()))
    .then(() => {
      logger.verbose('registerFunctions success');
      return true;
    })
    .catch(err => {
      logger.error('registerFunctions error');
      return Promise.reject(err);
    });
}
