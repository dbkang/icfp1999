'use strict';

var fs = require('fs');
var lexer = require('../src/lexer.js');
var parser = require('../src/parser.js');
var optimizer = require('../src/optimizer.js');

describe('optimizer', function () {

  it('programSize should return the correct size of programs', function () {
    expect(optimizer.programSize(parser.parseFile('inputs/alpha1.icfp'))).toBe(24);
    expect(optimizer.programSize(parser.parseFile('inputs/alpha0.icfp'))).toBe(30);
  });
});

