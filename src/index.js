#!/usr/bin/env node

/**
 * Provides functions to get contributors from commit history, process and write those contributors to `package.json`.
 * @module @mocha/contributors
 */

'use strict';

const childProcess = require('child_process');
const symbols = require('log-symbols');
const readPkgUp = require('read-pkg-up');
const {dirname} = require('path');
const writePkg = require('write-pkg');
const parseAuthor = require('parse-author');
const fs = require('fs');

// this needs to remain the same across calls in order for sorting to be
// consistent.  if someone wants to change this, we can provide an option.
const DEFAULT_LOCALE = 'en-US';
const DEFAULT_LOCALE_OPTS = {sensitivity: 'accent'};

/**
 * Get list of contributors to Git repo at path `cwd`, excluding names/emails defined in `exclude`.  `locale` and `localeOpts` must be consistent between calls in order to avoid too much churn in the contributors list.
 * @param {Object} [opts={}] Options
 * @param {string[]|Set<string>} [opts.exclude=[]] - A list of authors/emails to ignore; must be exact match
 * @param {string} [opts.cwd] - Working copy dir; defaults to `process.cwd()`
 * @param {string|string[]} [opts.locale=en-US] - Locale(s) to pass to `String.prototype.localeCompare`
 * @param {Object} [opts.localeOpts={sensitivity: 'accent'}] - Options for `String.prototype.localeCompare`
 * @public
 * @see https://git-scm.com/docs/git-log
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
 * @returns {string[]} Sorted list of contributors
 * @example
 * // get list of contributors for your package (without Guy Fieri)
 * const {getContributors} = require('@mocha/contributors');
 * getContributors(
 *   ['Guy Fieri <guy@flavortown.com>'],
 *   '/path/to/working/copy/',
 *   'en-US',
 *   {sensitivity: 'accent'}
 * ); // returns Array of contributors
 */
exports.getContributors = ({
  exclude = [],
  cwd = process.cwd(),
  locale = DEFAULT_LOCALE,
  localeOpts = DEFAULT_LOCALE_OPTS
} = {}) => {
  const output = childProcess.execSync('git log --format="%aN <%aE>"', {cwd});
  const uniqueContributors = new Set(output.trim().split(/\r?\n/));
  return Array.from(uniqueContributors)
    .filter(contributor => !new Set(exclude).has(contributor))
    .sort((a, b) => a.localeCompare(b, locale, localeOpts));
};

/**
 * Given a path to a package.json `pkg`, update Git contributors in the property defined by `property`, excluding those in the `exclude` array.
 *
 * @param {Object} [opts] - Options
 * @param {string} [opts.pkg] - Path to `package.json`; searches for closest by default
 * @param {string[]|Set<string>} [opts.exclude] - A list of authors/emails to ignore; defaults to `author` prop of found `package.json`
 * @param {string} [opts.property=contributors] - Property name to update
 * @returns {string} Resulting `package.json`
 * @public
 */
exports.updateContributors = ({
  pkg,
  exclude,
  property = 'contributors'
} = {}) => {
  const cwd = pkg ? dirname(pkg) : process.cwd();
  const pkgJson = readPkgUp.sync(cwd);
  const currentCount = Array.isArray(pkgJson[property])
    ? pkgJson[property].length
    : 0;

  if (typeof exclude === 'undefined' && pkgJson.author) {
    const {name, email} = parseAuthor(pkgJson.author);
    exclude = [`${name} <${email}>`];
  }

  const contributors = exports.getContributors({exclude, cwd});

  const newCount = contributors.length;

  if (newCount !== currentCount) {
    pkgJson[property] = contributors;
    writePkg.sync(pkg, pkgJson);

    console.error(
      newCount < currentCount
        ? `${symbols.warning} Reducing contributor count by ${currentCount -
            newCount}! It's because you're using a blacklist or .mailmap, right?`
        : `${symbols.success} Wrote ${newCount -
            currentCount} new contributors to ${pkg}`
    );
  } else {
    console.error(`${symbols.info} No new contributors; nothing to do.`);
  }

  return fs.readFileSync(pkg, 'utf8');
};
