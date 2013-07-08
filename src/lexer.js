'use strict';

var fs = require('fs');


var keywordArray = [
  'IF', 'DECISION', 'CASE', 'ELSEIF', 'ARM', 'EQUALS', 'AND', 'OR', 'VAR', '_'
];

var keywords = {};

keywordArray.forEach(function (k, i) {
  keywords[k] = function() { return k; };
});


// matchers consume a stream and return matched tokens and new index.  returns false if not applicable
function spaceMatcher(str, index) {
  for (var newIndex = index; newIndex < str.length && str.charAt(newIndex).search(/^\s/) != -1; newIndex++);
  if (newIndex == index) return false; else return { tokens: [], index: newIndex };  
}

function leftParenMatcher(str, index) {
  if (str.charAt(index) != '(') return false; else return { tokens: ['('], index: index + 1 };  
}

function rightParenMatcher(str, index) {
  if (str.charAt(index) != ')') return false; else return { tokens: [')'], index: index + 1 };  
}

function intMatcher(str, index) {
  var digits = "";
  for (var newIndex = index; newIndex < str.length && str.charAt(newIndex).search(/^\d/) != -1; newIndex++)
    digits += str.charAt(newIndex);
  if (newIndex == index) return false; else return { tokens: [parseInt(digits)], index: newIndex };  
}

function keywordMatcher(str, index) {
  var keyword = "";
  for (var newIndex = index; newIndex < str.length && str.charAt(newIndex).search(/^[A-Za-z_]/) != -1; newIndex++)
    keyword += str.charAt(newIndex);
  if (newIndex == index || !keywords[keyword]) return false;
  else return { tokens: [keywords[keyword]], index: newIndex };
}

function stringMatcher(str, index) {
  var string = "";
  if (str.charAt(index) != '"') return false;
  else {
    for (var newIndex = index + 1; newIndex < str.length && str.charAt(newIndex) != '"'; newIndex++)
      string += str.charAt(newIndex);
  }
  if (newIndex == str.length) return false;
  else return { tokens: [string], index: newIndex + 1 };
}


function tokenizeFileAsync(file, matchers, success, error) {
  fs.readFile(file, { encoding: 'ascii' }, function (err, stream) {
    if (err) error();
    else {
      var result = tokenize(stream, matchers);
      if (result) {
        success(result);
      }
      else {
        error();
      }
    }
  });
}



// stream: stream to tokenize - string for now
// matchers: an array of matchers to try
// returns false if failed, an array of tokens if succeeded
function tokenize(stream, matchers) {
    var index = 0;
    var matchedTokens = [];
    var currentMatch;
    while (index < stream.length) {
      currentMatch = false;
      for (var i = 0; i < matchers.length; i++) {
        currentMatch = matchers[i](stream, index);
        if (currentMatch) break;
      }
      if (currentMatch) {
        Array.prototype.push.apply(matchedTokens, currentMatch.tokens);
        index = currentMatch.index;
      }
      else {
        return false;
      }
    }
  return matchedTokens;
}

exports.tokenize = tokenize;
exports.tokenizeFileAsync = tokenizeFileAsync;
exports.matchers = {
  spaceMatcher: spaceMatcher,
  leftParenMatcher: leftParenMatcher,
  rightParenMatcher: rightParenMatcher,
  intMatcher: intMatcher,
  keywordMatcher: keywordMatcher,
  stringMatcher: stringMatcher,
  all: [
    spaceMatcher,
    leftParenMatcher,
    rightParenMatcher,
    intMatcher,
    keywordMatcher,
    stringMatcher
  ]
};
exports.keywords = keywords;
