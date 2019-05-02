import { ContributionsService } from '../contribs';
import { contributionsDBService } from '../../common/db';

class FunctionManagerImpl implements ContributionsService {
  find(terms?) {
    terms = terms || {};

    return contributionsDBService.db
      .find(terms)
      .then(result => (result || []).map(functionRow => prepareForOutput(functionRow)));
  }
}

export const FunctionManager = new FunctionManagerImpl();

function prepareForOutput(functionRow) {
  // this is a legacy
  return Object.assign(
    { id: functionRow.id || functionRow._id },
    { ref: functionRow.ref },
    functionRow.schema
  );
}
