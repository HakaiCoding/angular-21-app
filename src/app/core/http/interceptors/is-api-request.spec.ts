import { isApiRequest } from './is-api-request';

describe('isApiRequest', () => {
  it('returns true for same-origin requests when base path is root', () => {
    expect(isApiRequest('https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com'))
      .toBe(true);
    expect(isApiRequest('https://jsonplaceholder.typicode.com', 'https://jsonplaceholder.typicode.com/'))
      .toBe(true);
  });

  it('returns true only for matching subpaths when base path is not root', () => {
    expect(isApiRequest('https://api.example.com/api', 'https://api.example.com/api')).toBe(true);
    expect(isApiRequest('https://api.example.com/api/posts', 'https://api.example.com/api')).toBe(true);
    expect(isApiRequest('https://api.example.com/api-v2/posts', 'https://api.example.com/api')).toBe(false);
    expect(isApiRequest('https://api.example.com/other/posts', 'https://api.example.com/api')).toBe(false);
  });

  it('returns false for different origins', () => {
    expect(isApiRequest('https://api.other.com/posts', 'https://api.example.com')).toBe(false);
  });

  it('returns false for malformed urls', () => {
    expect(isApiRequest('https://api.example.com/posts', '://bad-url')).toBe(false);
  });
});
