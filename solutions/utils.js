'use strict';
module.exports = {
    cleanDocument(documentString) {
        return documentString.toLowerCase(); // TODO discuss handling to capitalization
    },
    parseSentences(str) {
        // TODO better sentence parser
        return str.split(/\.\s+/);
    },

    key(gram) {
        return gram.join('|');
    },
    splitKey(gramKey) {
        return gramKey.split('|');
    }
};
