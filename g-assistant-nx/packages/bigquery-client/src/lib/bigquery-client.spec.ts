import { bigqueryClient } from './bigquery-client';

describe('bigqueryClient', () => {
  it('should work', () => {
    expect(bigqueryClient()).toEqual('bigquery-client');
  });
});
