'use strict';

var fs = require('fs');
var lexer = require('./lexer.js');


// value-set ::= ({int}) -> [{int}]
function parseValueSet(tokens, index) {
  var result = [];
  if (tokens[index] != lexer.tokens.LPAREN) return false;
  else {
    for (var i = index + 1; i < tokens.length && (typeof tokens[i] === 'number'); i++) {
      result.push(tokens[i]);
    }
    if (i < tokens.length && tokens[i] === lexer.tokens.RPAREN)
      return { tree: result, index: i + 1 };
    else
      return false;
  }
}

function parseNewState(tokens, index) {
  if (typeof tokens[index] === 'number' || tokens[index] === lexer.keywords._)
    return  { tree: tokens[index], index: i + 1 };
  else
    return false;
}


exports.parseNewState = parseNewState;
exports.parseValueSet = parseValueSet;
