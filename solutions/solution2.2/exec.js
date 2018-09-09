'use strict';
module.exports = exec;

const natural = require('natural');
const utils = require('../utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10, N_TOP: 10}) {
    docStr = utils.cleanDocument(docStr);

    let grams = _generateGrams(docStr);
    // console.log('grams');
    // console.log(JSON.stringify(grams, null, 4));
    let results = grams.inDescLength.reduce((results, gramKey) => {
        if (gramKey in grams.validPhrases) {
            results.counts[gramKey] = results.counts[gramKey] || 0;
            results.counts[gramKey]++;
            if (results.counts[gramKey] === 2) {
                _deleteSubgrams(gramKey, grams.validPhrases);
                results.repeated.push(gramKey);
            }
        }
        return results;
    }, {
        counts: {},
        repeated: [],
    });


    return results.repeated
            .sort((gramKeyA, gramKeyB) => results.counts[gramKeyB] - results.counts[gramKeyA])
            .slice(0, options.N_TOP)
            // .map((gramKey) => { return {phrase: utils.splitKey(gramKey).join(' '), count: results.counts[gramKey]}});
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
