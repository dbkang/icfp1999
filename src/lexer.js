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
  rightParenMatcher: rightParenMatcher
};
