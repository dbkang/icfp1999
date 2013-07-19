'use strict';

var fs = require('fs');
var lexer = require('./lexer.js');


// parser combinator for many
function many(parser) {
  return function(tokens, index) {
    if (index >= tokens.length) return false;
    var item;
    var result = [];
    while (item = parser(tokens, index)) {
      index = item.index;
      result.push(item.tree);
    }
    return { tree: result, index: index };
  };
}

// tuple2
function tuple2(parser1, parser2, combinator) {
  return function (tokens, index) {
    var result1 = parser1(tokens, index);
    if (!result1) return false;
    if (result1.index >= tokens.length) return false;
    var result2 = parser2(tokens, result1.index);
    if (!result2) return false;
    return {
      tree: combinator(result1.tree, result2.tree),
      index: result2.index
    }
  }
}

// parser that takes no tokens and always succeeds with a given result
function empty(value) {
  return function (tokens, index) {
    if (index >= tokens.length) return false;
    return {
      tree: value,
      index: index
    };
  };
}

function tupleMany(parsers) {
  var tuple2Curried = function (parser1, parser2) {
    return tuple2(parser1, parser2, function (a, b) {
      a.push(b);
      return a;
    });
  };
  return parsers.reduce(tuple2Curried, empty([]));
}

function or(parsers) {
  return function (tokens, index) {
    var result = false;
    for(var i = 0; i < parsers.length && !result; i++) {
      result = parsers[i](tokens, index);
    }
    return result;
  }
}

function elem(token) {
  return function (tokens, index) {
    if (token === tokens[index])
      return {
        tree: token,
        index: index + 1
      };
    else
      return false;
  }
}

function number(tokens, index) {
  if (typeof tokens[index] === 'number') return { tree: tokens[index], index: index + 1 };
  else return false;
}

function string(tokens, index) {
  if (typeof tokens[index] === 'string') return { tree: tokens[index], index: index + 1 };
  else return false;
}

var parseValueSet = function(tokens, index) {
  var result= tupleMany([elem(lexer.tokens.LPAREN), many(number), elem(lexer.tokens.RPAREN)])(tokens, index);
  if (result) return { tree: result.tree[1], index: result.index };
  else return false;
}

var parseNewState = or([number, elem(lexer.keywords._)]);

exports.parseNewState = parseNewState;
exports.parseValueSet = parseValueSet;
exports.empty = empty;
exports.elem = elem;
exports.many = many;
exports.tuple2 = tuple2;
exports.tupleMany = tupleMany;
exports.or = or;
exports.number = number;
exports.string = string;

