/**
 * @file tests/load/searchLoadTest.js
 * @description اختبارات الحمولة للبحث الدلالي باستخدام k6
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const searchDuration = new Trend('search_duration');

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.05'],
  },
};

const queries = [
  'quarterly earnings analysis',
  'revenue growth forecast',
  'market volatility assessment',
  'investment portfolio optimization'
];

export default function () {
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  const payload = JSON.stringify({
    query: query,
    topK: 10,
    threshold: 0.7
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.API_TOKEN}`,
    },
  };

  const response = http.post('http://localhost:3000/api/v1/semantic-search', payload, params);
  
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'has results': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.results && body.results.length > 0;
      } catch (e) {
        return false;
      }
    }
  });

  if (!success) errorRate.add(1);
  searchDuration.add(response.timings.duration);

  sleep(Math.random() * 2 + 1);
}