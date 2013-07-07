'use strict';

var lexer = require('../src/lexer.js');

describe('lexer', function () {
  it('should correctly tokenize a file full of spaces and parentheses given matchers for space and parentheses',
     function (done) {
       lexer.lexer(
         'inputs/test/spaceParens.test',
         [lexer.matchers.spaceMatcher,
          lexer.matchers.leftParenMatcher,
          lexer.matchers.rightParenMatcher],
         function (tokens) {
           expect(tokens).toEqual([ '(', ')', '(', '(', '(', ')', ')', '(', ')', ')' ]);
           done();
         },
         function () {});
     });
});