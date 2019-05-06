import _ from 'lodash';
import { logger } from '../../common/logging';

/**
 * Base class of registered
 */
export class BaseRegistered {
  /**
   * constructor function
   * @param {DBService} dbService - db name or an instance of DBService. it can be local or remote db
   */
  constructor(dbService) {
    if (!dbService) {
      throw 'dbService is required';
    }

    this._dbService = dbService;
  }

  get dbService() {
    return this._dbService;
  }

  static generateID(name, version) {
    // console.log("generateActivityID, arguments: ", arguments);
    name = _.kebabCase(name);
    // console.log("name: ", name);
    // TODO need to think about how to versionable activity
    version = _.kebabCase(version);
    // console.log("version: ", version);
    // let id = this.ACTIVITIES+this.DELIMITER+name+this.DELIMITER+version;
    let id = name;
    //console.log("generateID, id: ", id);
    return id;
  }

  static constructItem(opts) {
    return {
      _id: opts.id,
      ref: opts.ref,
      name: opts.name,
      type: opts.type,
      version: opts.version,
      description: opts.description,
      keywords: opts.keywords || [],
      author: opts.author || 'Anonymous',
      schema: opts.schema,
    };
  }

  static saveItems(dbService, items, updateOnly) {
    let _items = _.cloneDeep(items); // in order to avoid the changes on the given items.
    let toInsert = [];

    for (let key in _items) {
      _items[key].createdAt = new Date().toISOString();
      _items[key].updatedAt = new Date().toISOString();

      toInsert.push(_items[key]);
    }
    return dbService.db.insertBulk(toInsert);
  }

  clean() {
    return this._dbService.db.removeAll();
  }

  syncDb(originalItems) {
    logger.verbose('updateDB');

    originalItems = originalItems || [];
    // new activities generate from package.json
    let items = {};

    // generate all the activity docs
    originalItems.forEach(item => {
      const info = item.rt;

      const version = info && info.version;
      const id = BaseRegistered.generateID(info.ref, version);

      items[id] = BaseRegistered.constructItem({
        id,
        ref: info.ref,
        name: info.name,
        type: info.type,
        version,
        description: info.description,
        keywords: item.keywords || [],
        author: info.author,
        schema: info,
      });
    });

    // console.log("!!!!!!!!activityDocs: ", activityDocs);
    return BaseRegistered.saveItems(this.dbService, items).then(result => {
      logger.verbose('updateDB done.');
      return result;
    });
  }
}
