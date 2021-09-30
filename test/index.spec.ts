import test from 'ava';

import { customUrlJoin, urlJoin } from '../src/index.js';

test('should work for simple case', t => {
  t.is(
    urlJoin('http://www.example.com/', 'foo/bar', '?test=123'),
    'http://www.example.com/foo/bar?test=123',
  );
});

test('should test readme example', t => {
  t.is(
    urlJoin('http://www.example.com', 'a', '/b/cd', '?foo=123'),
    'http://www.example.com/a/b/cd?foo=123',
  );
});

test('should work for simple case with new syntax', t => {
  t.is(
    urlJoin(['http://www.example.com/', 'foo/bar', '?test=123']),
    'http://www.example.com/foo/bar?test=123',
  );
});

test('should work for hashbang urls', t => {
  t.is(
    urlJoin(['http://www.example.com', '#!', 'foo/bar', '?test=123']),
    'http://www.example.com/#!/foo/bar?test=123',
  );
});

test('should be able to join protocol', t => {
  t.is(
    urlJoin('http:', 'www.example.com/', 'foo/bar', '?test=123'),
    'http://www.example.com/foo/bar?test=123',
  );
});

test('should be able to join protocol with slashes', t => {
  t.is(
    urlJoin('http://', 'www.example.com/', 'foo/bar', '?test=123'),
    'http://www.example.com/foo/bar?test=123',
  );
});

test('should remove extra slashes', t => {
  t.is(
    urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123'),
    'http://www.example.com/foo/bar?test=123',
  );
});

test('should not remove extra slashes in an encoded URL', t => {
  t.is(
    urlJoin('http:', 'www.example.com///', 'foo/bar', '?url=http%3A//Ftest.com'),
    'http://www.example.com/foo/bar?url=http%3A//Ftest.com',
  );

  t.is(urlJoin('http://a.com/23d04b3/', '/b/c.html'), 'http://a.com/23d04b3/b/c.html');
  t.not(urlJoin('http://a.com/23d04b3/', '/b/c.html'), 'http://a.com/23d04b3//b/c.html');
});

test('should support anchors in urls', t => {
  t.is(
    urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123', '#faaaaa'),
    'http://www.example.com/foo/bar?test=123#faaaaa',
  );
});

test('should support protocol-relative urls', t => {
  t.is(urlJoin('//www.example.com', 'foo/bar', '?test=123'), '//www.example.com/foo/bar?test=123');
});

test('should support file protocol urls', t => {
  t.is(urlJoin('file:/', 'android_asset', 'foo/bar'), 'file://android_asset/foo/bar');

  t.is(urlJoin('file:', '/android_asset', 'foo/bar'), 'file://android_asset/foo/bar');
});

test('should support absolute file protocol urls', t => {
  t.is(urlJoin('file:', '///android_asset', 'foo/bar'), 'file:///android_asset/foo/bar');
  t.is(urlJoin('file:///', 'android_asset', 'foo/bar'), 'file:///android_asset/foo/bar');
  t.is(urlJoin('file:///', '//android_asset', 'foo/bar'), 'file:///android_asset/foo/bar');
  t.is(urlJoin('file:///android_asset', 'foo/bar'), 'file:///android_asset/foo/bar');
});

test('should merge multiple query params properly', t => {
  t.is(
    urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123', '?key=456'),
    'http://www.example.com/foo/bar?test=123&key=456',
  );

  t.is(
    urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123', '?boom=value', '&key=456'),
    'http://www.example.com/foo/bar?test=123&boom=value&key=456',
  );

  t.is(
    urlJoin('http://example.org/x', '?a=1', '?b=2', '?c=3', '?d=4'),
    'http://example.org/x?a=1&b=2&c=3&d=4',
  );
});

test('should merge slashes in paths correctly', t => {
  t.is(urlJoin('http://example.org', 'a//', 'b//', 'A//', 'B//'), 'http://example.org/a/b/A/B/');
});

test('should merge colons in paths correctly', t => {
  t.is(urlJoin('http://example.org/', ':foo:', 'bar'), 'http://example.org/:foo:/bar');
});

test('should merge just a simple path without URL correctly', t => {
  t.is(urlJoin('/', 'test'), '/test');
});

test('should merge a path with colon properly', t => {
  t.is(urlJoin('/users/:userId', '/cars/:carId'), '/users/:userId/cars/:carId');
});

test('should merge slashes in protocol correctly', t => {
  t.is(urlJoin('http://example.org', 'a'), 'http://example.org/a');
  t.is(urlJoin('http:', '//example.org', 'a'), 'http://example.org/a');
  t.is(urlJoin('http:///example.org', 'a'), 'http://example.org/a');
  t.is(urlJoin('file:///example.org', 'a'), 'file:///example.org/a');

  t.is(urlJoin('file:example.org', 'a'), 'file://example.org/a');

  t.is(urlJoin('file:/', 'example.org', 'a'), 'file://example.org/a');
  t.is(urlJoin('file:', '/example.org', 'a'), 'file://example.org/a');
  t.is(urlJoin('file:', '//example.org', 'a'), 'file://example.org/a');
});

test('should skip empty strings', t => {
  t.is(urlJoin('http://foobar.com', '', 'test'), 'http://foobar.com/test');
  t.is(urlJoin('', 'http://foobar.com', '', 'test'), 'http://foobar.com/test');
});

test('should return an empty string if no arguments are supplied', t => {
  t.is(urlJoin(), '');
});

test('should skip intermediary slashes', t => {
  t.is(
    urlJoin('http://me.ly.com:3002', '/', '/demo/scrollbar'),
    'http://me.ly.com:3002/demo/scrollbar',
  );

  t.is(urlJoin('http://me.ly.com:3002', '//', 'foo/bar/'), 'http://me.ly.com:3002/foo/bar/');

  t.is(
    urlJoin('http://me.ly.com:3002', '//', 'foo', '/', 'bar/'),
    'http://me.ly.com:3002/foo/bar/',
  );
});

test('should preserve trailing slashes between each argmuent passed', t => {
  const trailingUrlJoin = customUrlJoin({ trailingSlash: true });

  t.is(urlJoin('https://example.com', '#', 'foobar'), 'https://example.com#/foobar');

  t.is(trailingUrlJoin('https://example.com', '#', 'foobar'), 'https://example.com/#/foobar');

  t.is(trailingUrlJoin('https://example.com', '#foobar'), 'https://example.com/#foobar');
  t.is(
    trailingUrlJoin('https://example.com', '#foobar', '?foo=123', '?test=abc'),
    'https://example.com/#foobar/?foo=123/&test=abc',
  );

  t.is(urlJoin(['https://example.com', '#']), 'https://example.com#');

  t.is(trailingUrlJoin('https://example.com', '#'), 'https://example.com/#');

  t.is(trailingUrlJoin('https://example.com', 'results', '/'), 'https://example.com/results/');

  t.is(urlJoin(['https://example.com', '#/something']), 'https://example.com#/something');

  t.is(trailingUrlJoin('https://example.com', '#/something'), 'https://example.com/#/something');
});
