function normalize(options: UrlJoinOptions, strArray: string[]): string {
  const resultArray: string[] = [];
  if (strArray.length === 0) {
    return '';
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (/^[^/:]+:\/*$/.test(strArray[0]) && strArray.length > 1) {
    const first = strArray.shift() as string;
    strArray[0] = first + strArray[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (strArray[0].startsWith('file:///')) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
  }

  for (let i = 0; i < strArray.length; i++) {
    let component = strArray[i];

    if (component === '') {
      continue;
    }

    // Removing the intermediary strings made up of slashes, e.g. '///'
    if (i > 0 && i < strArray.length - 1 && /^[/]+$/.test(component)) {
      continue;
    }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[/]+/, '');
    }

    if (i < strArray.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[/]+$/, '');
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[/]+$/, '/');
    }

    resultArray.push(component);
  }

  let str = resultArray.join('/');
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  if (!options.trailingSlash) {
    // Remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!]|#$)/g, '$1');
  }

  // Replace ? in parameters with &
  let parts = str.split('?');
  str = parts.shift() as string + (parts.length > 0 ? '?' : '') + parts.join('&');

  return str;
}

type UrlJoinOptions = {
  /**
   * Preserves trailing slashes between each provided string that is not a query string
   */
  trailingSlash?: boolean;
};

export function customUrlJoin(options: UrlJoinOptions = {}) {
  // eslint-disable-next-line func-names
  return function joinUrl(...args: string[] | string[][]): string {
    let input: string[];

    if (typeof args[0] === 'object') {
      input = args[0];
    } else {
      input = [].slice.call(args);
    }

    return normalize(options, input);
  };
}

export const urljoin = customUrlJoin();
