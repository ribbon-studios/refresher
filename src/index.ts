import { LogLevel, Logger, Refreshly } from '@refreshly/core';
import { AWS } from '@refreshly/aws';
import { GitHub } from '@refreshly/github';

Logger.setLevel(LogLevel.SILLY);

Refreshly(
  new AWS.Source({
    prefix: 'CI_ONLY_',
    targets: [
      new GitHub.Target({
        orgs: ['rain-cafe'],
      }),
    ],
  })
);
