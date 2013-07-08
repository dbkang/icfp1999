'use strict';

var lexer = require('../src/lexer.js');

describe('lexer', function () {
  it('should tokenize a file full of spaces and parentheses given matchers for space and parentheses',
     function (done) {
       lexer.tokenizeFileAsync(
         'inputs/test/spaceParens.test',
         lexer.matchers.all,
         function (tokens) {
           expect(tokens).toEqual([ '(', ')', '(', '(', '(', ')', ')', '(', ')', ')' ]);
           done();
         },
         function () {});
     });

  it('should tokenize a string of integers with parens', function () {
    expect(lexer.tokenize('((172 1 5)(2 52 343))', lexer.matchers.all)).toEqual(
      ['(', '(', 172, 1, 5, ')', '(', 2, 52, 343, ')', ')']);
  });

  it('should tokenize a string of integers, parens, strings and keywords', function () {
    expect(lexer.tokenize('(IF 172 "342")"heyMan!"', lexer.matchers.all)).toEqual(
      ['(', lexer.keywords.IF, 172, "342", ')', "heyMan!"]);
  });


  it('should fail to tokenize when unrecognized keywords are found', function () {
    expect(lexer.tokenize('(IFS 172 "342")"heyMan!"', lexer.matchers.all)).toBe(false);
  });

  it('should fail to tokenize when closing double quotes are missing', function () {
    expect(lexer.tokenize('(IF 172 "342")"heyMan!', lexer.matchers.all)).toBe(false);
  });

  it('should successfully tokenize test input file alpha0.icfp', function (done) {
    lexer.tokenizeFileAsync(
      'inputs/alpha0.icfp',
      lexer.matchers.all,
      function (tokens) {
        expect(tokens).toEqual(
          [ '(',
            '(',
            0,
            '(',
            lexer.keywords.IF,
            '(',
            lexer.keywords.AND,
            '(',
            lexer.keywords.EQUALS,
            '(',
            lexer.keywords.VAR,
            'sbz_at_0',
            ')',
            0,
            ')',
            '(',
            lexer.keywords.EQUALS,
            '(',
            lexer.keywords.VAR,
            'opfmt_at_0',
            ')',
            0,
            ')',
            ')',
            '(',
            lexer.keywords.DECISION,
            0,
            'Found instruction rmode',
            ')',
            '(',
            '(',
            lexer.keywords.ELSEIF,
            '(',
            lexer.keywords.AND,
            '(',
            lexer.keywords.EQUALS,
            '(',
            lexer.keywords.VAR,
            'opfmt_at_0',
            ')',
            1,
            ')',
            ')',
            '(',
            lexer.keywords.DECISION,
            0,
            'Found instruction imode',
            ')',
            ')',
            ')',
            '(',
            lexer.keywords.DECISION,
            1,
            'Did not find an instruction',
            ')',
            ')',
            ')',
            ')' ]);
        
        done();
      },
      function () { });
  });
  
});