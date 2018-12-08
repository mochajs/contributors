#!/usr/bin/env node

'use strict';

const {execSync} = require('child_process');
const symbols = require('log-symbols');
const readPkgUp = require('read-pkg-up');
const {dirname} = require('path');
const writePkg = require('write-pkg');

exports.contributors = ({pkg, blacklist, property} = {}) => {
  const cwd = pkg ? dirname(pkg) : process.cwd();
  const json = readPkgUp.sync(cwd);
  const contributorCount = Array.isArray(json[property])
    ? json[property].length
    : 0;

  // could use `| sort | uniq` here but didn't want to assume 'nix
  // see `man git-log` for info about the format
  const output = execSync('git log --format="%aN <%aE>"', {cwd});

  // result will be many lines of contributors, one or more per commit.
  // we wrap it in a `Set` to get unique values, then attempt to get
  // a consistent sort.
  const contributors = Array.from(new Set(output.trim().split(/\r?\n/)))
    .filter(contributor => !blacklist.has(contributor))
    .sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'accent'}));

  const newContributorCount = contributors.length;

  if (newContributorCount !== contributorCount) {
    json[property] = contributors;
    writePkg.sync(pkg, json);

    console.log(
      newContributorCount < contributorCount
        ? `${symbols.warning} Reducing contributor count by ${contributorCount -
            newContributorCount}! It's because you're using a blacklist or .mailmap, right?`
        : `${symbols.success} Wrote ${newContributorCount -
            contributorCount} new contributors to ${pkg}`
    );
  } else {
    console.log(`${symbols.info} No new contributors; nothing to do.`);
  }
};
