'use strict';

var lexer = require('../src/lexer.js');
var parser = require('../src/parser.js');

describe('parser', function () {
  var LPAREN = lexer.tokens.LPAREN;
  var RPAREN = lexer.tokens.RPAREN;

  it('empty should take a value and return a parser returns the value as parsed result', function () {
    var emptyParser = parser.empty("The Man");
    expect(emptyParser([1, 2, 5],0)).toEqual({ tree: "The Man", index: 0 });
    expect(emptyParser([1, 2, 5],3)).toBe(false);
  });

  it('elem should return a parser that returns the matched element', function () {
    var elemParser = parser.elem(LPAREN);
    expect(elemParser([LPAREN, RPAREN], 0)).toEqual( { tree: LPAREN, index: 1});
    expect(elemParser([LPAREN, RPAREN], 1)).toBe(false);
  });

  it('tuple2 should take two parsers and return a parser that runs them in order', function () {
    var l = parser.elem(LPAREN);
    var r = parser.elem(RPAREN);
    var lr = parser.tuple2(l, r, function (a, b) { return [a, b]; });
    expect(lr([LPAREN, RPAREN, 1, 2, 3], 0)).toEqual( { tree: [LPAREN, RPAREN], index: 2 });
    expect(lr([LPAREN, 1, RPAREN, 1, 2, 3], 0)).toBe(false);
  });


  it('tupleMany should take an array of parsers and return a parser that runs them in order', function () {
    var l = parser.elem(LPAREN);
    var r = parser.elem(RPAREN);
    var lrlr = parser.tupleMany([l, r, l, r]);
    expect(lrlr([1, LPAREN, RPAREN, LPAREN, RPAREN], 1)).toEqual({
      tree: [LPAREN, RPAREN, LPAREN, RPAREN], index: 5
    });
    expect(lrlr([LPAREN, RPAREN, RPAREN, LPAREN, 2, 3], 0)).toBe(false);
  });

  it('many should take a parser and return a parser that matches as many times as needed', function () {
    var l = parser.elem(LPAREN);
    var lMany = parser.many(l);
    expect(lMany([1, 2, LPAREN, LPAREN, LPAREN, 5 ,3, 2], 2)).toEqual({
      tree: [LPAREN, LPAREN, LPAREN], index: 5
    });
    expect(lMany([1, 2, LPAREN, LPAREN, LPAREN, 5 ,3, 2], 1)).toEqual({
      tree: [], index: 1
    });
    expect(lMany([1, 2, LPAREN, LPAREN, LPAREN, 5 ,3, 2], 8)).toBe(false);
  });

  it('or should take an array of parsers and return a parser that tries each till it matches', function () {
    var l = parser.elem(LPAREN);
    var r = parser.elem(RPAREN);
    var either = parser.or([l, r]);
    expect(either([5, 2, LPAREN, LPAREN, RPAREN, RPAREN, 6], 2)).toEqual({
      tree: LPAREN, index: 3
    });
    expect(either([5, 2, LPAREN, LPAREN, RPAREN, RPAREN, 6], 4)).toEqual({
      tree: RPAREN, index: 5
    });
    expect(either([5, 2, LPAREN, LPAREN, RPAREN, RPAREN, 6], 0)).toBe(false);
  });


  it('number should take one number and return it as the result', function () {
    expect(parser.number([LPAREN, 5, 2, RPAREN], 1)).toEqual({ tree: 5, index: 2 });
    expect(parser.number([LPAREN, 5, 2, RPAREN], 2)).toEqual({ tree: 2, index: 3 });
    expect(parser.number([LPAREN, 5, 2, RPAREN], 0)).toBe(false);
    expect(parser.number([LPAREN, 5, 2, RPAREN], 4)).toBe(false);
  });

  it('string should take one string and return it as the result', function () {
    expect(parser.string([LPAREN, "Five", "Two", RPAREN], 1)).toEqual({ tree: "Five", index: 2 });
    expect(parser.string([LPAREN, "Five", "Two", RPAREN], 2)).toEqual({ tree: "Two", index: 3 });
    expect(parser.string([LPAREN, 5, 2, RPAREN], 0)).toBe(false);
    expect(parser.string([LPAREN, 5, 2, RPAREN], 4)).toBe(false);
  });


  it('parseValueSet should parse according to ValueSet production rule', function () {
    expect(parser.valueSet([LPAREN, RPAREN], 0)).toEqual({ tree: [], index: 2});
    expect(parser.valueSet([1, 2, LPAREN, 5, 2, 3, RPAREN], 2)).toEqual({
      tree: [5, 2, 3],
      index: 7
    });
    expect(parser.valueSet([1, 2, LPAREN, 5, 2, RPAREN, 3], 2)).toEqual({
      tree: [5, 2],
      index: 6
    });
    expect(parser.valueSet([1, 5, LPAREN, 5, 2])).toBe(false);
  });

  it('parseNewState should parse according to NewState production rule', function () {
    expect(parser.newState([5, lexer.keywords._, LPAREN], 0)).toEqual({
      tree: 5, index: 1
    });
    expect(parser.newState([5, lexer.keywords._, LPAREN], 1)).toEqual({
      tree: lexer.keywords._, index: 2
    });

    expect(parser.newState([5, lexer.keywords._, LPAREN], 2)).toBe(false);
    expect(parser.newState([5, lexer.keywords._, LPAREN], 3)).toBe(false);

  });

});