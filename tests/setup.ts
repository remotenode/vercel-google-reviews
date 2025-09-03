// Test setup file for Jest
import { jest } from '@jest/globals';

// Global test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

// Global test utilities
global.testUtils = {
  // Helper to create mock request objects
  createMockRequest: (overrides = {}) => ({
    method: 'GET',
    url: '/test',
    headers: {},
    query: {},
    body: {},
    ...overrides,
  }),

  // Helper to create mock response objects
  createMockResponse: () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.removeHeader = jest.fn().mockReturnValue(res);
    res.header = jest.fn().mockReturnValue(res);
    res.on = jest.fn().mockReturnValue(res);
    return res;
  },

  // Helper to wait for async operations
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to create test data
  createTestReview: (overrides = {}) => ({
    id: 'test-review-id',
    userName: 'Test User',
    userImage: 'https://example.com/avatar.jpg',
    content: 'This is a test review',
    score: 5,
    date: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  // Helper to create test options
  createTestOptions: (overrides = {}) => ({
    appId: 'com.test.app',
    country: 'us',
    lang: 'en',
    num: 10,
    ...overrides,
  }),
};

// Type declaration for global test utilities
declare global {
  var testUtils: {
    createMockRequest: (overrides?: any) => any;
    createMockResponse: () => any;
    wait: (ms: number) => Promise<void>;
    createTestReview: (overrides?: any) => any;
    createTestOptions: (overrides?: any) => any;
  };
}
