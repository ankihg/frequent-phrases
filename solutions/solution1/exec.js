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
                    .filter((gramKey) => result[gramKey] > 1)
                    .sort((gramKeyA, gramKeyB) =>  _splitKey(gramKeyB).length - _splitKey(gramKeyA).length)
                    .filter((potentialSubGramKey, i, phrasesInDescLength) => {
                        for (let j = 0; j < i; j++) { // TODO switch to while loop
                            let potentialSuperGram = phrasesInDescLength[j];
                            if (_splitKey(potentialSubGramKey).length >= _splitKey(potentialSuperGram).length) break;
                            if (potentialSuperGram.includes(potentialSubGramKey))
                                return false;
                        }
                        return true;
                    })
                    .sort((gramKeyA, gramKeyB) =>  {return result[gramKeyB] - result[gramKeyA]})
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
