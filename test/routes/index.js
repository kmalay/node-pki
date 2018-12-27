describe('Routes: Index', () => {
  describe('GET /', () => {

    it('should be able to consume the route / with a valid JWT', done => {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjbGllbnQxIiwiaWF0IjoxNTQ1NDE5NDExNjI1fQ.ELF7evyXfYCFiS8YQm1xerH53uSGE7fn-C07h5Xvkk4';

      request
        .get('/')
        .set({ Authorization: token })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

  });
});
