import { googleServices } from './google-services';

describe('googleServices', () => {
  it('should work', () => {
    expect(googleServices()).toEqual('google-services');
  });
});
