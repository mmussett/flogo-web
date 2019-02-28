import { ResourceHooks } from './resource-hooks';
import { ResourceImporter } from './resource-importer';
import { ResourceExporter } from './resource-exporter';

export interface ResourceType<TResourceData = unknown> {
  type: string;
  ref: string;
  import: ResourceImporter<TResourceData>;
  export: ResourceExporter<TResourceData>;
}

export interface ResourceExtensionRegistrar {
  addType(type: ResourceType);
  useHooks(resourceHooks: ResourceHooks);
}

export interface PluginServer {
  resources: ResourceExtensionRegistrar;
}

export interface FlogoPlugin {
  register(server: PluginServer);
}
