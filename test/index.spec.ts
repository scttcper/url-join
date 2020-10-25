import { describe, it, expect } from '@jest/globals';

import { urlJoin, customUrlJoin } from '../src';

describe('url join', () => {
  it('should work for simple case', () => {
    expect(urlJoin('http://www.example.com/', 'foo/bar', '?test=123')).toBe(
      'http://www.example.com/foo/bar?test=123',
    );
  });

  it('should test readme example', () => {
    expect(urlJoin('http://www.example.com', 'a', '/b/cd', '?foo=123')).toBe(
      'http://www.example.com/a/b/cd?foo=123',
    );
  });

  it('should work for simple case with new syntax', () => {
    expect(urlJoin(['http://www.example.com/', 'foo/bar', '?test=123'])).toBe(
      'http://www.example.com/foo/bar?test=123',
    );
  });

  it('should work for hashbang urls', () => {
    expect(urlJoin(['http://www.example.com', '#!', 'foo/bar', '?test=123'])).toBe(
      'http://www.example.com/#!/foo/bar?test=123',
    );
  });

  it('should be able to join protocol', () => {
    expect(urlJoin('http:', 'www.example.com/', 'foo/bar', '?test=123')).toBe(
      'http://www.example.com/foo/bar?test=123',
    );
  });

  it('should be able to join protocol with slashes', () => {
    expect(urlJoin('http://', 'www.example.com/', 'foo/bar', '?test=123')).toBe(
      'http://www.example.com/foo/bar?test=123',
    );
  });

  it('should remove extra slashes', () => {
    expect(urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123')).toBe(
      'http://www.example.com/foo/bar?test=123',
    );
  });

  it('should not remove extra slashes in an encoded URL', () => {
    expect(urlJoin('http:', 'www.example.com///', 'foo/bar', '?url=http%3A//Ftest.com')).toBe(
      'http://www.example.com/foo/bar?url=http%3A//Ftest.com',
    );

    expect(urlJoin('http://a.com/23d04b3/', '/b/c.html')).toBe('http://a.com/23d04b3/b/c.html');
    expect(urlJoin('http://a.com/23d04b3/', '/b/c.html')).not.toBe(
      'http://a.com/23d04b3//b/c.html',
    );
  });

  it('should support anchors in urls', () => {
    expect(urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123', '#faaaaa')).toBe(
      'http://www.example.com/foo/bar?test=123#faaaaa',
    );
  });

  it('should support protocol-relative urls', () => {
    expect(urlJoin('//www.example.com', 'foo/bar', '?test=123')).toBe(
      '//www.example.com/foo/bar?test=123',
    );
  });

  it('should support file protocol urls', () => {
    expect(urlJoin('file:/', 'android_asset', 'foo/bar')).toBe('file://android_asset/foo/bar');

    expect(urlJoin('file:', '/android_asset', 'foo/bar')).toBe('file://android_asset/foo/bar');
  });

  it('should support absolute file protocol urls', () => {
    expect(urlJoin('file:', '///android_asset', 'foo/bar')).toBe('file:///android_asset/foo/bar');
    expect(urlJoin('file:///', 'android_asset', 'foo/bar')).toBe('file:///android_asset/foo/bar');
    expect(urlJoin('file:///', '//android_asset', 'foo/bar')).toBe('file:///android_asset/foo/bar');
    expect(urlJoin('file:///android_asset', 'foo/bar')).toBe('file:///android_asset/foo/bar');
  });

  it('should merge multiple query params properly', () => {
    expect(urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123', '?key=456')).toBe(
      'http://www.example.com/foo/bar?test=123&key=456',
    );

    expect(
      urlJoin('http:', 'www.example.com///', 'foo/bar', '?test=123', '?boom=value', '&key=456'),
    ).toBe('http://www.example.com/foo/bar?test=123&boom=value&key=456');

    expect(urlJoin('http://example.org/x', '?a=1', '?b=2', '?c=3', '?d=4')).toBe(
      'http://example.org/x?a=1&b=2&c=3&d=4',
    );
  });

  it('should merge slashes in paths correctly', () => {
    expect(urlJoin('http://example.org', 'a//', 'b//', 'A//', 'B//')).toBe(
      'http://example.org/a/b/A/B/',
    );
  });

  it('should merge colons in paths correctly', () => {
    expect(urlJoin('http://example.org/', ':foo:', 'bar')).toBe('http://example.org/:foo:/bar');
  });

  it('should merge just a simple path without URL correctly', () => {
    expect(urlJoin('/', 'test')).toBe('/test');
  });

  it('should merge a path with colon properly', () => {
    expect(urlJoin('/users/:userId', '/cars/:carId')).toBe('/users/:userId/cars/:carId');
  });

  it('should merge slashes in protocol correctly', () => {
    expect(urlJoin('http://example.org', 'a')).toBe('http://example.org/a');
    expect(urlJoin('http:', '//example.org', 'a')).toBe('http://example.org/a');
    expect(urlJoin('http:///example.org', 'a')).toBe('http://example.org/a');
    expect(urlJoin('file:///example.org', 'a')).toBe('file:///example.org/a');

    expect(urlJoin('file:example.org', 'a')).toBe('file://example.org/a');

    expect(urlJoin('file:/', 'example.org', 'a')).toBe('file://example.org/a');
    expect(urlJoin('file:', '/example.org', 'a')).toBe('file://example.org/a');
    expect(urlJoin('file:', '//example.org', 'a')).toBe('file://example.org/a');
  });

  it('should skip empty strings', () => {
    expect(urlJoin('http://foobar.com', '', 'test')).toBe('http://foobar.com/test');
    expect(urlJoin('', 'http://foobar.com', '', 'test')).toBe('http://foobar.com/test');
  });

  it('should return an empty string if no arguments are supplied', () => {
    expect(urlJoin()).toBe('');
  });

  it('should skip intermediary slashes', () => {
    expect(urlJoin('http://me.ly.com:3002', '/', '/demo/scrollbar')).toBe(
      'http://me.ly.com:3002/demo/scrollbar',
    );

    expect(urlJoin('http://me.ly.com:3002', '//', 'foo/bar/')).toBe(
      'http://me.ly.com:3002/foo/bar/',
    );

    expect(urlJoin('http://me.ly.com:3002', '//', 'foo', '/', 'bar/')).toBe(
      'http://me.ly.com:3002/foo/bar/',
    );
  });

  it('should preserve trailing slashes between each argmuent passed', () => {
    const trailingUrlJoin = customUrlJoin({ trailingSlash: true });

    expect(urlJoin('https://example.com', '#', 'foobar')).toBe('https://example.com#/foobar');

    expect(trailingUrlJoin('https://example.com', '#', 'foobar')).toBe(
      'https://example.com/#/foobar',
    );

    expect(trailingUrlJoin('https://example.com', '#foobar')).toBe('https://example.com/#foobar');
    expect(trailingUrlJoin('https://example.com', '#foobar', '?foo=123', '?test=abc')).toBe(
      'https://example.com/#foobar/?foo=123/&test=abc',
    );

    expect(urlJoin(['https://example.com', '#'])).toBe('https://example.com#');

    expect(trailingUrlJoin('https://example.com', '#')).toBe('https://example.com/#');

    expect(trailingUrlJoin('https://example.com', 'results', '/')).toBe(
      'https://example.com/results/',
    );

    expect(urlJoin(['https://example.com', '#/something'])).toBe('https://example.com#/something');

    expect(trailingUrlJoin('https://example.com', '#/something')).toBe(
      'https://example.com/#/something',
    );
  });
});
