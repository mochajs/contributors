#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const {updateContributors} = require('..');

const argv = yargs
  .scriptName('contributors')
  .usage('$0 [options]')
  .options({
    exclude: {
      alias: ['x'],
      defaultDescription: '(author prop of package.json)',
      description: 'Exclude author/email from list (repeatable)',
      type: 'array',
      coerce: exclude => new Set(exclude)
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
    },
    outputFile: {
      alias: ['o', 'out'],
      description: 'File path to write',
      requiresArg: true,
      type: 'string'
    }
  })
  .pkgConf('@mocha/contributors')
  .parse();

updateContributors(argv);
