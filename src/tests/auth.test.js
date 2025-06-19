const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { User } = require('../models');
const { sequelize } = require('../config/database');

chai.use(chaiHttp);
const { expect } = chai;

describe('Authentication API', () => {
  before(async () => {
    // Sync all models that aren't already in the database
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    // Clean up the database after each test
    await User.destroy({ where: {}, truncate: true });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('user');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user).to.not.have.property('password');
      expect(res.body.data.user.email).to.equal('test@example.com');
    });

    it('should not register with duplicate email', async () => {
      // First registration
      await User.create({
        name: 'Existing User',
        email: 'exists@example.com',
        password: 'password123',
      });

      // Try to register with same email
      const res = await chai
        .request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'exists@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('User already exists with this email');
    });

    it('should validate required fields', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/register')
        .send({});

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.have.lengthOf.at.least(2);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      name: 'Login Test User',
      email: 'login@example.com',
      password: 'password123',
    };

    before(async () => {
      // Create a test user
      await User.create({
        ...testUser,
        password: await require('bcryptjs').hash(testUser.password, 10),
      });
    });

    it('should login with valid credentials', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('user');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user.email).to.equal(testUser.email);
    });

    it('should not login with invalid password', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    const testUser = {
      name: 'Protected Test User',
      email: 'protected@example.com',
      password: 'password123',
    };

    let authToken;

    before(async () => {
      // Create a test user and get token
      const user = await User.create({
        ...testUser,
        password: await require('bcryptjs').hash(testUser.password, 10),
      });

      // Generate token
      authToken = require('jsonwebtoken').sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    });

    it('should access protected route with valid token', async () => {
      const res = await chai
        .request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.message).to.equal('You have accessed a protected route');
    });

    it('should not access protected route without token', async () => {
      const res = await chai.request(app).get('/api/protected');

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('success', false);
    });
  });
});
