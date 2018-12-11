'use strict';

const expect = require('unexpected')
  .clone()
  .use(require('unexpected-sinon'));
const sinon = require('sinon');
const childProcess = require('child_process');
const {readFileSync} = require('fs');
const contributors = require('..');
const pkgUp = require('pkg-up');
const writePkg = require('write-pkg');
const fs = require('fs');

const gitLogOutput = readFileSync(
  require.resolve('./git-log-output.txt'),
  'utf8'
);
const expectedContributors = readFileSync(
  require.resolve('./expected.txt'),
  'utf8'
)
  .trim()
  .split(/\r?\n/);

const originalPkgJson = require('../package.json');

describe('contributors', function() {
  let sandbox;
  let pkgJson;
  beforeEach(function() {
    sandbox = sinon.createSandbox();
    pkgJson = Object.assign({}, originalPkgJson);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('getContributors()', function() {
    beforeEach(function() {
      sandbox.stub(childProcess, 'execSync').returns(gitLogOutput);
    });

    it('should return a sorted, unique list', function() {
      expect(contributors.getContributors(), 'to equal', expectedContributors);
    });
  });

  describe('updateContributors()', function() {
    let processedContributors;

    beforeEach(function() {
      processedContributors = expectedContributors.filter(
        contributor => !/boneskull/.test(contributor)
      );
      sandbox.stub(pkgUp, 'sync').returns('/some/path/to/package.json');
      sandbox.stub(writePkg, 'sync');
      sandbox
        .stub(contributors, 'getContributors')
        .returns(processedContributors);
      sandbox.stub(fs, 'readFileSync').returns(JSON.stringify(pkgJson));
      sandbox.stub(process, 'cwd').returns('/some/dir');
    });

    it('should filter out author by default', function() {
      contributors.updateContributors({pkg: '/some/path/to/package.json'});
      expect(contributors.getContributors, 'to have a call satisfying', [
        {
          exclude: ['Christopher Hiller <boneskull@boneskull.com>'],
          cwd: '/some/path/to'
        }
      ]);
    });

    it('should write the result from `getContributors()` to the path at `pkg`', function() {
      contributors.updateContributors({pkg: '/some/path/to/package.json'});
      expect(writePkg.sync, 'to have a call satisfying', [
        '/some/path/to/package.json',
        Object.assign({}, pkgJson, {
          contributors: processedContributors
        })
      ]);
    });

    it('should return the resulting package.json as a string', function() {
      // too much of a pain to mock this, sorry
      expect(
        contributors.updateContributors({pkg: '/some/path/to/package.json'}),
        'to be a string'
      );
    });

    it('should attempt to find a package.json if none given', function() {
      contributors.updateContributors();
      expect(pkgUp.sync, 'to have a call satisfying', ['/some/dir']);
    });

    it('should throw when package.json cannot be found', function() {
      pkgUp.sync.restore();
      sandbox.stub(pkgUp, 'sync').returns(null);
      expect(
        () => contributors.updateContributors(),
        'to throw',
        /cannot find/i
      );
    });

    it('should throw when package.json cannot be read', function() {
      sandbox.stub(JSON, 'parse').throws();
      expect(() => contributors.updateContributors(), 'to throw');
    });
  });
});
