import { LogLevel, Logger, Refreshly } from '@refreshly/core';
import { AWS } from '@refreshly/aws';
import { GitHub } from '@refreshly/github';
import { Forgejo } from '@refreshly/forgejo';

Logger.setLevel(LogLevel.SILLY);

Refreshly(
  new AWS.Source({
    prefix: 'CI_ONLY_',
    targets: [
      new GitHub.Target({
        orgs: ['ribbon-studios'],
      }),
      new Forgejo.Target({
        url: 'https://codeberg.org',
        orgs: ['ribbon-studios'],
      }),
    ],
  })
);
