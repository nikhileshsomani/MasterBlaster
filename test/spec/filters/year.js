'use strict';

describe('Filter: year', function () {

  // load the filter's module
  beforeEach(module('sachinRtApp'));

  // initialize a new instance of the filter before each test
  var year;
  beforeEach(inject(function ($filter) {
    year = $filter('year');
  }));

  it('should return the input prefixed with "year filter:"', function () {
    var text = 'angularjs';
    expect(year(text)).toBe('year filter: ' + text);
  });

});
