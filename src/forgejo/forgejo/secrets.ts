import { rfetch } from '@ribbon-studios/js-utils';
import { KeyInfo } from '@refreshly/core';

export type SecretsRequest = {
  url: string;
  token: string;
  orgs: string[];
  keyInfos: KeyInfo[];
};

export async function createOrUpdateOrgSecrets({ url, token, orgs, keyInfos }: SecretsRequest): Promise<void> {
  await Promise.all(
    orgs.map(async (org) => {
      await Promise.all(
        keyInfos.map(async (keyInfo) => {
          await rfetch(`${url}/api/v1/orgs/${org}/actions/secrets/${keyInfo.name}`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              Authorization: `token ${token}`,
            },
            body: {
              data: keyInfo.value,
            },
          });
        })
      );
    })
  );
}
