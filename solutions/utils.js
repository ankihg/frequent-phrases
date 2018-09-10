'use strict';
const natural = require('natural');
const tokenizer = new natural.TreebankWordTokenizer();

module.exports = {
    cleanDocument(documentString) {
        return documentString.toLowerCase(); // TODO discuss handling to capitalization
    },
    parseSentences(str) {
        // TODO better sentence parser
        return str.split(/\.\s+/);
    },
    tokenize(str) {
        return tokenizer.tokenize(str);
    },
    ngrams(phrase, n) {
        return natural.NGrams.ngrams(phrase, n)
    },

    key(gram) {
        return gram.join('|');
    },
    splitKey(gramKey) {
        return gramKey.split('|');
    }
};
