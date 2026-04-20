const db = require('../../backend/database');
const bcrypt = require('bcrypt');

describe('Database operations', () => {
  // Test Database
  beforeAll(() => {
    db.run('DELETE FROM users WHERE username LIKE "test%"');
  });

  afterAll((done) => {
    db.close(done);
  });

  it('should insert a new user', (done) => {
    const username = 'testuser_' + Date.now();
    const password = 'secret';

    bcrypt.hash(password, 10, (err, hash) => {
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hash],
        function(err) {
          expect(err).toBeNull();
          expect(this.lastID).toBeDefined();
          done();
        }
      );
    });
  });

  it('should find a user by username', (done) => {
    const username = 'findme_' + Date.now();
    const password = 'secret';

    bcrypt.hash(password, 10, (err, hash) => {
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], () => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
          expect(err).toBeNull();
          expect(row.username).toBe(username);
          done();
        });
      });
    });
  });
});