'use strict';
module.exports = exec;

const natural = require('natural');
const utils = require('./utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10}) {

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
                    .filter((gramKey) => result[gramKey] > 1)
                    .sort((aGramKey, bGramKey) =>  _splitKey(bGramKey).length - _splitKey(aGramKey).length)
                    .filter((potentialSubGram, i, phrasesInDescLength) => {
                        for (let j = 0; j < i; j++) { // TODO switch to while loop
                            let potentialSuperGram = phrasesInDescLength[j];
                            if (potentialSubGram.length >= potentialSuperGram.length) break;
                            if (potentialSuperGram.includes(potentialSubGram))
                                return false;
                        }
                        return true;
                    })
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
