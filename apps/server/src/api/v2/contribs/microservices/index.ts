import { ContributionManager } from '../../../../modules/contributions';
import { getContribInstallationController as getInstallationController } from '../../../../modules/engine';
import { config } from '../../../../config/app-config';
import { logger } from '../../../../common/logging';
import { install as installContributionToEngine } from '../../../../modules/contrib-installer/microservice';
import { TYPE_ACTIVITY, TYPE_TRIGGER, TYPE_FUNCTION } from '../../../../common/constants';
import { ERROR_TYPES, ErrorManager } from '../../../../common/errors';

const contributionTypes = {
  activity: {
    installerOpts: {
      type: TYPE_ACTIVITY,
    },
  },
  trigger: {
    installerOpts: {
      type: TYPE_TRIGGER,
    },
  },
  function: {
    installerOpts: {
      type: TYPE_FUNCTION,
    },
  },
};

const CONTRIBUTION_TYPE = new Map([
  ['activity', 'flogo:activity'],
  ['trigger', 'flogo:trigger'],
  ['function', 'flogo:function'],
]);

export function contribs(router) {
  router.get(`/contributions/microservices`, listContributions);
  router.post(`/contributions/microservices`, installContribution);
}

/**
 * Get all the contributions installed in the engine. The request have following optional query params:
 * filter[name] {string} name of the contribution which needs to be fetched.
 * filter[ref] {string} reference of the contribution which needs to be fetched.
 * filter[type] {string} can contain 'activity' or 'trigger' to fetch all contributions of one type.
 *                       If nothing provided, all the contributions for a microservices will be returned
 *
 */
async function listContributions(ctx) {
  const searchTerms: { name?: string; ref?: string; shim?: string; type?: string } = {};
  const filterName = ctx.request.query['filter[name]'];
  const filterRef = ctx.request.query['filter[ref]'];
  const filterShim = ctx.request.query['filter[shim]'];
  const filterType = CONTRIBUTION_TYPE.get(ctx.request.query['filter[type]']);

  if (filterName) {
    searchTerms.name = filterName;
  }
  if (filterRef) {
    searchTerms.ref = filterRef;
  }
  if (filterShim) {
    searchTerms.shim = filterShim;
  }
  if (filterType) {
    searchTerms.type = filterType;
  }

  const foundContributions = await ContributionManager.find(searchTerms);
  ctx.body = {
    data: foundContributions || [],
  };
}

/**
 * Install new Trigger or Activity to the engine. The POST request need to have the following properties in the body:
 * url {string} Url to the contribution to be installed
 * type {string} Type of contribution to be installed. Should contain either 'activity' / 'trigger'
 *
 */
async function installContribution(ctx, next) {
  ctx.req.setTimeout(0);
  const url = ctx.request.body.url;
  const contribType = contributionTypes[ctx.request.body.type];

  if (!contribType) {
    throw ErrorManager.createRestError('Unknown type of contribution', {
      type: ERROR_TYPES.ENGINE.INSTALL,
      message: 'Unknown type of contribution',
      params: {
        body:
          'Should be in the pattern: {"url": "path_to_contribution", "type": "activity"}',
      },
    });
  }

  logger.info(`[log] Install ${contribType.installerOpts.type}: '${url}'`);
  const installController = await getInstallationController(
    config.defaultEngine.path,
    (contribRef, engine) =>
      installContributionToEngine(contribRef, contribType.installerOpts.type, engine)
  );

  const result = await installController.install(url);
  ctx.body = { data: { ...result, originalUrl: url } };

  next();
}
