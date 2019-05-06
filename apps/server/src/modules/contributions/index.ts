import { ContributionsService } from '../contribs';
import { contributionsDBService } from '../../common/db';

class ContributionManagerImpl implements ContributionsService {
  /**
   * List or find contributions
   *
   * ## searchTerms
   * - name {string}  find by name with exactly this name (case insensitive)
   * - ref {string} find by url ref property with exactly this ref property (case insensitive)
   * If both search terms are provided search is executed by name
   *
   * ## options
   *    - fields {string} Possible values:
   *    - short {string} - get short version of  contributions
   *    - full {string} -  get full version of  contributions
   *    - raw {string} (deprecated) -  get raw version from db
   *
   * @param terms
   * @param terms.name {string} name of the app
   * @param terms.ref {string} url ref property
   * @param terms.type {string} type of the contribution to filter more
   * @param terms.shim {string} if the contribution is shimmable. It is mainly applicable for shimmable triggers
   */
  find(terms?) {
    return contributionsDBService.db
      .find(getDBSearchTerms(terms))
      .then(result =>
        (result || []).map(contributionRow => cleanForOutput(contributionRow))
      );
  }

  findByRef(ref) {
    return contributionsDBService.db
      .findOne({ ref })
      .then(contribution => (contribution ? cleanForOutput(contribution) : null));
  }
}

export const ContributionManager = new ContributionManagerImpl();

function cleanForOutput(contribution) {
  return Object.assign(
    {
      id: contribution.id || contribution._id,
      ref: contribution.ref,
      homepage:
        (contribution && contribution.schema && contribution.schema.homePage) || '',
    },
    contribution.schema
  );
}

function getDBSearchTerms(terms) {
  if (!terms) {
    return {};
  }
  const dbSearchTerms = { ...terms };
  if (dbSearchTerms.shim) {
    delete dbSearchTerms.shim;
    dbSearchTerms['schema.shim'] = { $exists: true };
  }
  return dbSearchTerms;
}
