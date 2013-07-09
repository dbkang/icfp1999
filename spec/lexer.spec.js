'use strict';

var lexer = require('../src/lexer.js');

describe('lexer', function () {
  var LPAREN = lexer.tokens.LPAREN;
  var RPAREN = lexer.tokens.RPAREN;
  it('should tokenize a file full of spaces and parentheses given matchers for space and parentheses',
     function (done) {
       lexer.tokenizeFileAsync(
         'inputs/test/spaceParens.test',
         lexer.matchers.all,
         function (tokens) {
           expect(tokens).toEqual([ LPAREN, RPAREN, LPAREN, LPAREN, LPAREN, RPAREN,
                                    RPAREN, LPAREN, RPAREN, RPAREN ]);
           done();
         },
         function () {});
     });

  it('should tokenize a string of integers with parens', function () {
    expect(lexer.tokenize('((172 1 5)(2 52 343))', lexer.matchers.all)).toEqual(
      [LPAREN, LPAREN, 172, 1, 5, RPAREN, LPAREN, 2, 52, 343, RPAREN, RPAREN]);
  });

  it('should tokenize a string of integers, parens, strings and keywords', function () {
    expect(lexer.tokenize('(IF 172 "342")"heyMan!"', lexer.matchers.all)).toEqual(
      [LPAREN, lexer.keywords.IF, 172, "342", RPAREN, "heyMan!"]);
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
          [ LPAREN,
            LPAREN,
            0,
            LPAREN,
            lexer.keywords.IF,
            LPAREN,
            lexer.keywords.AND,
            LPAREN,
            lexer.keywords.EQUALS,
            LPAREN,
            lexer.keywords.VAR,
            'sbz_at_0',
            RPAREN,
            0,
            RPAREN,
            LPAREN,
            lexer.keywords.EQUALS,
            LPAREN,
            lexer.keywords.VAR,
            'opfmt_at_0',
            RPAREN,
            0,
            RPAREN,
            RPAREN,
            LPAREN,
            lexer.keywords.DECISION,
            0,
            'Found instruction rmode',
            RPAREN,
            LPAREN,
            LPAREN,
            lexer.keywords.ELSEIF,
            LPAREN,
            lexer.keywords.AND,
            LPAREN,
            lexer.keywords.EQUALS,
            LPAREN,
            lexer.keywords.VAR,
            'opfmt_at_0',
            RPAREN,
            1,
            RPAREN,
            RPAREN,
            LPAREN,
            lexer.keywords.DECISION,
            0,
            'Found instruction imode',
            RPAREN,
            RPAREN,
            RPAREN,
            LPAREN,
            lexer.keywords.DECISION,
            1,
            'Did not find an instruction',
            RPAREN,
            RPAREN,
            RPAREN,
            RPAREN ]);
        
        done();
      },
      function () { });
  });
  
});