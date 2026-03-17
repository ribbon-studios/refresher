import { KeyInfo, TargetModule, getEnv, PartiallyRequired } from '@refreshly/core';
import { createOrUpdateOrgSecrets } from './forgejo/secrets';

export class ForgejoTargetModule extends TargetModule {
  private options: PartiallyRequired<Omit<ForgejoTargetModule.Options, keyof TargetModule.Options>, 'token'>;

  constructor({ prefix, token, ...options }: ForgejoTargetModule.Options) {
    super({ prefix });

    this.options = {
      ...options,
      //
      token: getEnv('token', token, 'FORGEJO_TOKEN'),
    };
  }

  get name(): string {
    return 'forgejo';
  }

  async target(keyInfos: KeyInfo[]): Promise<void> {
    await createOrUpdateOrgSecrets({
      keyInfos,
      token: this.options.token,
      orgs: this.options.orgs,
    });
  }
}

export namespace ForgejoTargetModule {
  export type Options = {
    url: string;
    token?: string;
    prefix?: string;
    orgs: string[];
  } & TargetModule.Options;
}
