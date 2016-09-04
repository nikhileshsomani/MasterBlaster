'use strict';

describe('Service: apiServices', function () {

  // load the service's module
  beforeEach(module('sachinRtApp'));

  // instantiate service
  var apiServices;
  beforeEach(inject(function (_apiServices_) {
    apiServices = _apiServices_;
  }));

  it('should do something', function () {
    expect(!!apiServices).toBe(true);
  });

});
