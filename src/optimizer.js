'use strict';

var lexer = require('./lexer.js');

function min(ints) {
  return ints.reduce(function (r, k) { return k < r ? k : r })
}

function max(ints) {
  return ints.reduce(function (r, k) { return k > r ? k : r })
}

function span(arms) {
  if (arms.length == 0) return 0;
  var ints = arms.map(function (k) { return k[1] }).reduce(function (r, k) { return r.concat(k) });
  if (ints.length == 0) return 0;
  var minVal = min(ints);
  var maxVal = max(ints);
  return maxVal - minVal + 1;
}

function programSize(parseTree) {
  if (parseTree instanceof Array) {
    if (parseTree.length == 0) return 0;
/*
    if (parseTree[0] == lexer.keywords.IF) return programSize(parseTree.slice(1));
    if (parseTree[0] == lexer.keywords.ELSEIF) return programSize(parseTree.slice(1));
    if (parseTree[0] == lexer.keywords.AND) return programSize(parseTree.slice(1));
    if (parseTree[0] == lexer.keywords.OR) return programSize(parseTree.slice(1));
*/
    if (parseTree[0] == lexer.keywords.DECISION) {
      if (parseTree[1] == lexer.keywords._) return 3; else return 4;
    }
    if (parseTree[0] == lexer.keywords.ARM) return programSize(parseTree[2]);
    if (parseTree[0] == lexer.keywords.EQUALS) return 6;
    if (parseTree[0] == lexer.keywords.CASE)
      return 10 + programSize(parseTree[3]) + programSize(parseTree[2]) + span(parseTree[2]);

    return parseTree.map(programSize).reduce(function (r, k) { return r + k; });
  }
  else return 0;
}

exports.programSize = programSize;
