// Load environment variables for testing
require('dotenv').config({ path: '.env.test' });

// Set up global test timeout
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

// Add chai plugins
chai.use(chaiHttp);

// Set global timeout
const TEST_TIMEOUT = 10000; // 10 seconds

global.expect = expect;
global.chai = chai;
global.request = chai.request;
global.TEST_TIMEOUT = TEST_TIMEOUT;
