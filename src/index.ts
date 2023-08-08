import { Refreshly } from '@refreshly/core';
import { AWS } from '@refreshly/aws';
import { GitHub } from '@refreshly/github';

Refreshly(
  new AWS.Source({
    user: 'rain-ci',
    prefix: 'CI_ONLY_',
    targets: [
      new GitHub.Target({
        org: 'rain-cafe',
      }),
      new GitHub.Target({
        org: 'rain-cafe-xiv',
      }),
      new GitHub.Target({
        org: 'rain-cafe-mc',
      }),
    ],
  })
);
