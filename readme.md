# url-join [![npm](https://badgen.net/npm/v/url-join)](https://www.npmjs.com/package/url-join) [![CircleCI](https://circleci.com/gh/scttcper/url-join.svg?style=svg)](https://circleci.com/gh/scttcper/url-join) [![coverage](https://badgen.net/codecov/c/github/scttcper/url-join)](https://codecov.io/gh/scttcper/url-join) [![bundlesize](https://badgen.net/bundlephobia/min/@ctrl/url-join)](https://bundlephobia.com/result?p=@ctrl/url-join)

> A typescript fork of [jfromaniello/url-join](https://github.com/jfromaniello/url-join) with additional options.

### Install
```
npm install @ctrl/url-join
```

### Use

```ts
import { urlJoin } from '@ctrl/url-join';

const url = urlJoin('http://www.example.com', 'a', '/b/cd', '?foo=123')
// http://www.example.com/a/b/cd?foo=123
```

##### Preserve trailing slash

Preserves trailing slashes between each provided string. Not recommended with query parameters.

```ts
import { customUrlJoin } from '@ctrl/url-join';

const trailingUrlJoin = customUrlJoin({ trailingSlash: true });

trailingUrlJoin('https://example.com', 'results', '/')
// https://example.com/results/

trailingUrlJoin('https://example.com', '#foobar')
// https://example.com/#foobar

trailingUrlJoin('https://example.com', '#', 'foobar')
// https://example.com/#/foobar

trailingUrlJoin('https://example.com', 'results', '?q=foo', '&page=1')
// https://example.com/results/?q=foo/&page=1 - Probably not what you want
```

### See Also
- [jfromaniello/url-join](https://github.com/jfromaniello/url-join) original source
- [sindresorhus/query-string](https://github.com/sindresorhus/query-string) properly parsing and formatting query strings
- [sindresorhus/normalize-url](https://github.com/sindresorhus/normalize-url)
