'use strict';
module.exports = exec;

const natural = require('natural');
const utils = require('./utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10}) {

    let sentences = utils.parseSentences(docStr);

    let result = sentences.reduce((lookup, sentence) => {
        let grams = _generateGrams(sentence);
        // console.log(grams);

        grams.forEach((gram) => {
            let key = _key(gram);
            lookup[key] = lookup[key] || 0;
            lookup[key]++;
        });


        // console.log(grams);
        // console.log('\n\n\n');
        return lookup;
    }, {});

    let output = Object.keys(result)
                            .filter((gramKey) => result[gramKey] > 1)
                            .sort((aGramKey, bGramKey) =>  _splitKey(bGramKey).length - _splitKey(aGramKey).length)
                            .filter((potentialSubGram, i, phrasesInDescLength) => {
                                console.log('phrasesInDescLength', i);
                                console.log(phrasesInDescLength);
                                for (let j = 0; j < i; j++) {
                                    let potentialSuperGram = phrasesInDescLength[j];
                                    if (potentialSubGram.length < potentialSuperGram.length && potentialSuperGram.includes(potentialSubGram))
                                        return false;
                                }
                                return true;
                            })
                            .map((gramKey) => _splitKey(gramKey).join(' '));

    console.log('output');
    console.log(output);
    return output;


    let sorted = Object.keys(result)
                    .sort((aGram, bGram) =>  result[bGram] - result[aGram])
                    .map((gram) => { return { gram: gram, count: result[gram], length: gram.split('|').length } })
                    .map;

    let top_frequent = sorted.slice(0, 10);

    let topSortedByLength = top_frequent.sort((a, b) => b.length - a.length);

    // remove subphrases
    let fitleredFrequentPhrases = topSortedByLength
      .filter((potentialSubGram, i) => {
            for (let j = 0; j < i; j++) {
              let potentialSuperGram = topSortedByLength[j];
              if (potentialSubGram.length < potentialSuperGram.length && potentialSuperGram.gram.includes(potentialSubGram.gram))
                return false;
            }
            return true;
      });

     return fitleredFrequentPhrases;


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
