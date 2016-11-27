'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var personalityCtrlStub = {
  index: 'personalityCtrl.index',
  show: 'personalityCtrl.show',
  create: 'personalityCtrl.create',
  upsert: 'personalityCtrl.upsert',
  patch: 'personalityCtrl.patch',
  destroy: 'personalityCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var personalityIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './personality.controller': personalityCtrlStub
});

describe('Personality API Router:', function() {
  it('should return an express router instance', function() {
    expect(personalityIndex).to.equal(routerStub);
  });

  describe('GET /api/personalitys', function() {
    it('should route to personality.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'personalityCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/personalitys/:id', function() {
    it('should route to personality.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'personalityCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/personalitys', function() {
    it('should route to personality.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'personalityCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/personalitys/:id', function() {
    it('should route to personality.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'personalityCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/personalitys/:id', function() {
    it('should route to personality.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'personalityCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/personalitys/:id', function() {
    it('should route to personality.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'personalityCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
