import { ContributionSchema, ActionSchema, ContributionType } from '@flogo-web/core';
import { ResourcePluginRegistry } from '../../extension';
import { inject, injectable } from 'inversify';
import { TOKENS } from '../../core';
import { ContributionsService } from '../contribs';

const toPairs = c => [c.ref, c] as [string, any];

@injectable()
export class AllContribsService {
  constructor(
    private pluginRegistry: ResourcePluginRegistry,
    @inject(TOKENS.ContributionsManager)
    private contributionsManager: ContributionsService
  ) {}

  async loadAll(): Promise<ContributionSchema[]> {
    const contributions = await this.contributionsManager.find();
    return [...contributions, ...this.getResourceSchemas()];
  }

  async allByRef(): Promise<Map<string, ContributionSchema>> {
    const allContribs = await this.loadAll();
    return new Map<string, ContributionSchema>(allContribs.map(toPairs));
  }

  private getResourceSchemas(): ContributionSchema[] {
    return this.pluginRegistry.resourceTypes.allTypes().map(({ ref }) => {
      return {
        type: ContributionType.Action,
        ref,
      } as ActionSchema;
    });
  }
}
