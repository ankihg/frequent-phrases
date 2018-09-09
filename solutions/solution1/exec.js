'use strict';
module.exports = exec;

const natural = require('natural');
const utils = require('../utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10, N_TOP: 10}) {
    docStr = utils.cleanDocument(docStr);

    let sentences = utils.parseSentences(docStr);

    let result = sentences.reduce((lookup, sentence) => {
        let grams = _generateGrams(sentence);

        grams.forEach((gram) => {
            let key = utils.key(gram);
            lookup[key] = lookup[key] || 0;
            lookup[key]++;
        });

        return lookup;
    }, {});

    return Object.keys(result)
            // remove non-repeated phrases
            .filter((gramKey) => result[gramKey] > 1)
            // order by word length to assist with subphrase filtering
            .sort((gramKeyA, gramKeyB) =>  utils.splitKey(gramKeyB).length - utils.splitKey(gramKeyA).length)
            // filter subphrases of repeated phrases
            .filter((potentialSubGramKey, i, phrasesInDescLength) => {
                let subgramWordLength = utils.splitKey(potentialSubGramKey).length;
                let j = -1;
                while (++j < i && subgramWordLength < utils.splitKey(phrasesInDescLength[j]).length) {
                    let potentialSuperGram = phrasesInDescLength[j];
                    if (potentialSuperGram.includes(potentialSubGramKey))
                        return false;
                }
                return true;
            })
            // sort phrases by count
            .sort((gramKeyA, gramKeyB) =>  {return result[gramKeyB] - result[gramKeyA]})
            // select top N
            .slice(0, options.N_TOP)
            // .map((gramKey) => { return {phrase: utils.splitKey(gramKey).join(' '), count: result[gramKey]} });
            .map((gramKey) => utils.splitKey(gramKey).join(' '));


    function _generateGrams(sentence) {
        let grams = [];
        for (let n = options.MIN_GRAM; n <= options.MAX_GRAM; n++) {
            grams = grams.concat(natural.NGrams.ngrams(sentence, n));
        }
        return grams;
    }

}
