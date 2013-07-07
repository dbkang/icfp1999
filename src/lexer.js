'use strict';

var fs = require('fs');

// matchers consume a stream and return matched tokens and new index.  returns false if not applicable
function spaceMatcher(str, index) {
  for (var newIndex = index; newIndex < str.length && str.charAt(newIndex).search(/^\s/) != -1; newIndex++);
  if (newIndex == index) return false; else return { tokens: [], index: newIndex };  
}

function leftParenMatcher(str, index) {
  if (str.charAt(index).search(/^\(/) == -1) return false; else return { tokens: ['('], index: index + 1 };  
}

function rightParenMatcher(str, index) {
  if (str.charAt(index).search(/^\)/) == -1) return false; else return { tokens: [')'], index: index + 1 };  
}


// file: file name
// matchers: an array of matchers to try
// success: success callback
// error: error callback
function lexer(file, matchers, success, error) {
  fs.readFile(file, { encoding: 'ascii' }, function (err, stream) {
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
        error();
        break;
      }
    }
    success(matchedTokens);
  });
}

exports.lexer = lexer;
exports.matchers = {
  spaceMatcher: spaceMatcher,
  leftParenMatcher: leftParenMatcher,
  rightParenMatcher: rightParenMatcher
};
