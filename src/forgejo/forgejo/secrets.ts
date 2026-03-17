import { rfetch, RibbonFetchOptions } from '@ribbon-studios/js-utils';
import { getEncryptedValueForGitHub } from '../utils/sodium';
import { KeyInfo } from '@refreshly/core';

export type BaseRequest = {
  token: string;
  orgs: string[];
  baseUrl?: string;
};

export type SecretsRequest = BaseRequest & {
  keyInfos: KeyInfo[];
};

export type PublicKey = {
  org: string;
  keyId: string;
  key: string;
};

function forgejoFetch<T>(
  path: string,
  token: string,
  baseUrl = 'https://codeberg.org',
  options: RibbonFetchOptions = {}
): Promise<T> {
  return rfetch<T>(`${baseUrl}/api/v1${path}`, {
    ...options,
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export async function getOrgPublicKeys({ token, orgs, baseUrl }: BaseRequest): Promise<PublicKey[]> {
  return Promise.all(
    orgs.map(async (org) => {
      const data = await forgejoFetch<{ key_id: string; key: string }>(
        `/orgs/${org}/actions/secrets/public-key`,
        token,
        baseUrl
      );
      return {
        org,
        keyId: data.key_id,
        key: data.key,
      };
    })
  );
}

export async function createOrUpdateOrgSecrets({ token, orgs, keyInfos, baseUrl }: SecretsRequest): Promise<void> {
  const publicKeys = await getOrgPublicKeys({ token, orgs, baseUrl });

  await Promise.all(
    publicKeys.map(async ({ keyId, key, org }) => {
      await Promise.all(
        keyInfos.map(async (keyInfo) => {
          await forgejoFetch(`/orgs/${org}/actions/secrets/${keyInfo.name}`, token, baseUrl, {
            method: 'PUT',
            body: JSON.stringify({
              key_id: keyId,
              encrypted_value: await getEncryptedValueForGitHub(key, keyInfo.value),
            }),
          });
        })
      );
    })
  );
}
