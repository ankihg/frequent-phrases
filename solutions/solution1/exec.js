'use strict';
module.exports = exec;

const natural = require('natural');
const utils = require('../utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10, N_TOP: 10}) {

    let sentences = utils.parseSentences(docStr);

    let result = sentences.reduce((lookup, sentence) => {
        let grams = _generateGrams(sentence);

        grams.forEach((gram) => {
            let key = _key(gram);
            lookup[key] = lookup[key] || 0;
            lookup[key]++;
        });

        return lookup;
    }, {});

    return Object.keys(result)
            // remove non-repeated phrases
            .filter((gramKey) => result[gramKey] > 1)
            // order by word length to assist with subphrase filtering
            .sort((gramKeyA, gramKeyB) =>  _splitKey(gramKeyB).length - _splitKey(gramKeyA).length)
            // filter subphrases of repeated phrases
            .filter((potentialSubGramKey, i, phrasesInDescLength) => {
                let subgramWordLength = _splitKey(potentialSubGramKey).length;
                let j = -1;
                while (++j < i && subgramWordLength < _splitKey(phrasesInDescLength[j]).length) {
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
            // .map((gramKey) => { return {phrase: _splitKey(gramKey).join(' '), count: result[gramKey]} });
            .map((gramKey) => _splitKey(gramKey).join(' '));


    function _generateGrams(sentence) {
        let grams = [];
        for (let n = options.MIN_GRAM; n <= options.MAX_GRAM; n++) {
            grams = grams.concat(natural.NGrams.ngrams(sentence, n));
        }
        return grams;
    }

    function _key(gram) {
      return gram.join('|');
    }

    function _splitKey(gramKey) {
      return gramKey.split('|');
    }

}
