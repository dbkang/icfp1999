'use strict';

var lexer = require('../src/lexer.js');
var parser = require('../src/parser.js');

describe('parser', function () {
  var LPAREN = lexer.tokens.LPAREN;
  var RPAREN = lexer.tokens.RPAREN;

  it('should parse sentences according to ValueSet production rule', function () {
    expect(parser.parseValueSet([LPAREN, RPAREN], 0)).toEqual({ tree: [], index: 2});
    expect(parser.parseValueSet([1, 2, LPAREN, 5, 2, 3, RPAREN], 2)).toEqual({
      tree: [5, 2, 3],
      index: 7
    });
    expect(parser.parseValueSet([1, 2, LPAREN, 5, 2, RPAREN, 3], 2)).toEqual({
      tree: [5, 2],
      index: 6
    });
    expect(parser.parseValueSet([1, 5, LPAREN, 5, 2])).toBe(false);
  });

});