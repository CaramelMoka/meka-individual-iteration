const request = require('supertest');
const app = require('../../backend/server');

// mock LLM
jest.mock('../../backend/llm', () => ({
  callLLM: jest.fn().mockResolvedValue("Mock AI response")
}));

/*iteration1*/

describe('Iteration 1 - Authentication', () => {

describe('POST /api/register', () => {
  
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'newuser', password: 'pass123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('newuser');
  });

  it('should reject duplicate username', async () => {
    await request(app)
      .post('/api/register')
      .send({ username: 'duplicate', password: 'pass123' });

      const res = await request(app)
      .post('/api/register')
      .send({ username: 'duplicate', password: 'pass123' });
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });
});
});


/*iteration2*/

describe('Iteration 2 - Chat & History', () => {

  describe('POST /api/chat', () => {

    it('should return AI response', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'Hello AI' });

      expect(res.statusCode).toBe(200);
      expect(res.body.response).toBe("Mock AI response");
    });

    it('should require prompt', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({});

      expect(res.statusCode).toBe(400);
    });

  });

  describe('GET /api/history', () => {

    it('should reject if not logged in', async () => {
      const res = await request(app)
        .get('/api/history');

      expect(res.statusCode).toBe(401);
    });

  });

  describe('GET /api/search', () => {

    it('should return 400 if missing params', async () => {
      const res = await request(app)
        .get('/api/search');

      expect(res.statusCode).toBe(400);
    });

  });

});

