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
      return a.concat([b]);
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

function compose(parser, f) {
  return function(tokens, index) {
    var result = parser(tokens, index);
    if (result) return { tree: f(result.tree), index: result.index };
    else return false;
  };
}

function stripFirstLast(k) {
  k.pop();
  k.shift();
  return k;
}

var lparen = elem(lexer.tokens.LPAREN);
var rparen = elem(lexer.tokens.RPAREN);

var tupleManyParens = function(parsers) {
  parsers = parsers.concat(rparen);
  parsers.unshift(lparen);
  return compose(tupleMany(parsers), stripFirstLast);
}

var elemParens = function(parser) {
  var parsers = [lparen, parser, rparen];
  return compose(tupleMany(parsers), function (k) { return k[1]; });  
}


var valueSet = elemParens(many(number));
                      
var newState = or([number, elem(lexer.keywords._)]);

var variable = tupleManyParens([elem(lexer.keywords.VAR), string]);

// essentially forward declarations since Javascript is eager
var conditionRec = function(tokens, index) { return condition(tokens, index) };
var statementRec = function(tokens, index) { return statement(tokens, index) };


var condition = or([tupleManyParens([elem(lexer.keywords.EQUALS), variable, number]),
                    compose(tupleMany([lparen, elem(lexer.keywords.AND), many(conditionRec), rparen]),
                            function (k) { k[2].unshift(k[1]); return k[2]}),
                    compose(tupleMany([lparen, elem(lexer.keywords.OR), many(conditionRec), rparen]),
                            function (k) { k[2].unshift(k[1]); return k[2]})]);

var arm = tupleManyParens([elem(lexer.keywords.ARM), valueSet, statementRec]);

var elseif = tupleManyParens([elem(lexer.keywords.ELSEIF), condition, statementRec]);

var arms = elemParens(many(arm));
var elseifs = elemParens(many(elseif));

var statement = or([tupleManyParens([elem(lexer.keywords.IF), condition, statementRec, elseifs, statementRec]),
                    tupleManyParens([elem(lexer.keywords.DECISION), newState, string]),
                    tupleManyParens([elem(lexer.keywords.CASE), variable, arms, statementRec])]);

var rule = tupleManyParens([many(number), statement]);

var character = elemParens(many(rule));

function parseFile(filename) {
  var file = fs.readFileSync(filename, { encoding: 'ascii' });
  var tokens = lexer.tokenize(file, lexer.matchers.all);
  var characterParsed = character(tokens, 0);
  return characterParsed.tree;
}


exports.newState = newState;
exports.valueSet = valueSet;
exports.empty = empty;
exports.elem = elem;
exports.many = many;
exports.tuple2 = tuple2;
exports.tupleMany = tupleMany;
exports.or = or;
exports.number = number;
exports.string = string;

exports.variable = variable;
exports.condition = condition;

exports.character = character;

exports.parseFile = parseFile;
