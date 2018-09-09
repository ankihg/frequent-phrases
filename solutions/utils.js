'use strict';
module.exports = {
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
