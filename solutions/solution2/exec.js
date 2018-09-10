'use strict';
module.exports = exec;

const natural = require('natural');
const utils = require('../utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10, N_TOP: 10}) {
    docStr = utils.cleanDocument(docStr);

    let grams = _generateGrams(docStr);

    let result = grams.inDescLength.reduce((result, gramKey) => {
        if (gramKey in grams.validPhrases) {
            result.counts[gramKey] = result.counts[gramKey] || 0;
            result.counts[gramKey]++;
            if (result.counts[gramKey] === 2) {
                _deleteSubgrams(gramKey, grams.validPhrases);
                result.repeated.push(gramKey);
            }
        }
        return result;
    }, {
        counts: {},
        repeated: [],
    });

    return result.repeated
            .sort((gramKeyA, gramKeyB) => result.counts[gramKeyB] - result.counts[gramKeyA])
            .slice(0, options.N_TOP)
            // .map((gramKey) => { return {phrase: utils.splitKey(gramKey).join(' '), count: result.counts[gramKey]}});
            .map((gramKey) => utils.splitKey(gramKey).join(' '));


    function _generateGrams(docStr) {
        let grams = { validPhrases: {}, inDescLength: [] };
        let sentences = utils.parseSentences(docStr);
        for (let n = options.MAX_GRAM; n >= options.MIN_GRAM; n--) {
            sentences.forEach((sentence) => {
                natural.NGrams.ngrams(sentence, n)
                    .forEach((gram) => {
                        let gramKey = utils.key(gram);
                        grams.validPhrases[gramKey] = true;
                        grams.inDescLength.push(gramKey);
                    });
            });
        }
        return grams;
    }

    function _deleteSubgrams(gramKey, keyHolder) {
        let gram = utils.splitKey(gramKey);
        for (let n = options.MIN_GRAM; n < gram.length; n++) {
            natural.NGrams.ngrams(gram, n)
                .forEach((gram) => {
                    let gramKey = utils.key(gram);
                    delete keyHolder[gramKey];
                });
        }
    }
}
