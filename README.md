# @mocha/contributors

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Add & update list of Git contributors in `package.json`

This module uses `git` to find all committers to a repo; it respects [`.mailmap`](https://www.git-scm.com/docs/git-check-mailmap#_mapping_authors), if present.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

```shell
$ npm i @mocha/contributors -D
```

## Usage

```plain
contributors [options]

Options:
  --help                Show help                                      [boolean]
  --version             Show version number                            [boolean]
  --exclude, -x         Exclude author/email from list (repeatable)
                                [array] [default: (author prop of package.json)]
  --package, -p, --pkg  Path of package.json to update
                                      [string] [default: (closest package.json)]
  --property            Name of property to update
                                              [string] [default: "contributors"]
```

Configuration can be specified using the `@mocha/contributors` property of your `package.json`, e.g.:

```json
{
  "@mocha/contributors": {
    "exclude": ["some", "people"],
    "package": "/path/to/package.json",
    "property": "contributors"
  }
}
```

## API

<!-- AUTO-GENERATED-CONTENT:START (JSDOC:files=src/index.js&heading-depth=3&module-index-format=none&global-index-format=none) -->
<a name="module_@mocha/contributors"></a>

### @mocha/contributors
Provides functions to get contributors from commit history, process and write those contributors to `package.json`.


* [@mocha/contributors](#module_@mocha/contributors)
    * [.getContributors([opts])](#module_@mocha/contributors.getContributors) ⇒ <code>Array.&lt;string&gt;</code>
    * [.updateContributors([opts])](#module_@mocha/contributors.updateContributors) ⇒ <code>string</code>

<a name="module_@mocha/contributors.getContributors"></a>

#### @mocha/contributors.getContributors([opts]) ⇒ <code>Array.&lt;string&gt;</code>
Get list of contributors to Git repo at path `cwd`, excluding names/emails defined in `exclude`.  `locale` and `localeOpts` must be consistent between calls in order to avoid too much churn in the contributors list.

**Kind**: static method of [<code>@mocha/contributors</code>](#module_@mocha/contributors)
**Returns**: <code>Array.&lt;string&gt;</code> - Sorted list of contributors
**Access**: public
**See**

- https://git-scm.com/docs/git-log
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | <code>{}</code> | Options |
| [opts.exclude] | <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> | <code>[]</code> | A list of authors/emails to ignore; must be exact match |
| [opts.cwd] | <code>string</code> |  | Working copy dir; defaults to `process.cwd()` |
| [opts.locale] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <code>&quot;en-US&quot;</code> | Locale(s) to pass to `String.prototype.localeCompare` |
| [opts.localeOpts] | <code>Object</code> | <code>{sensitivity: &#x27;accent&#x27;}</code> | Options for `String.prototype.localeCompare` |

**Example**
```js
// get list of contributors for your package (without Guy Fieri)
const {getContributors} = require('@mocha/contributors');
getContributors(
  ['Guy Fieri <guy@flavortown.com>'],
  '/path/to/working/copy/',
  'en-US',
  {sensitivity: 'accent'}
); // returns Array of contributors
```
<a name="module_@mocha/contributors.updateContributors"></a>

#### @mocha/contributors.updateContributors([opts]) ⇒ <code>string</code>
Given a path to a package.json `pkg`, update Git contributors in the property defined by `property`, excluding those in the `exclude` array.

**Kind**: static method of [<code>@mocha/contributors</code>](#module_@mocha/contributors)
**Returns**: <code>string</code> - Resulting `package.json`
**Access**: public

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  | Options |
| [opts.pkg] | <code>string</code> |  | Path to `package.json`; searches for closest by default |
| [opts.exclude] | <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> |  | A list of authors/emails to ignore; defaults to `author` prop of found `package.json` |
| [opts.property] | <code>string</code> | <code>&quot;contributors&quot;</code> | Property name to update |


<!-- AUTO-GENERATED-CONTENT:END -->

## Maintainers

[@boneskull](https://github.com/boneskull)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Apache-2.0 © 2018 JS Foundation & Contributors
