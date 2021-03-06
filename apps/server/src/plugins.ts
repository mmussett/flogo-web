import { flowPlugin } from '@flogo-web/plugins/flow-server';
import { ExtensionsServer } from './extension';

export function loadPlugins(flogoServer: ExtensionsServer) {
  flogoServer.use(flowPlugin);
}
