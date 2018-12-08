#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const {contributors} = require('..');

const argv = yargs
  .scriptName('contributors')
  .usage('$0')
  .options({
    blacklist: {
      alias: ['b'],
      defaultDescription: '(author in package.json)',
      description: 'Blacklist author/email from list (repeatable)',
      type: 'array',
      coerce: blacklist => new Set(blacklist)
    },
    package: {
      alias: ['p', 'pkg'],
      defaultDescription: '(closest package.json)',
      description: 'Path of package.json to update',
      normalize: true,
      requiresArg: true
    },
    property: {
      default: 'contributors',
      description: 'Name of property to update',
      requiresArg: true,
      type: 'string'
    }
  })
  .config()
  .pkgConf('contributors')
  .wrap(process.stdout.columns ? Math.min(process.stdout.columns, 80) : 80)
  .check(argv => {})
  .parse();

contributors(argv);
