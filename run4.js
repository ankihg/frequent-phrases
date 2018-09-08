'use strict';
module.exports = exec;

const natural = require('natural');

/**
TODO idea, plz shoot holes

gen all grams from options.MIN_GRAM to options.MAX_GRAM
build hash of grams to count=0 [countsByGram]
build gramOrder array that has grams by length, longests first
for (gram in gramOrder)
    if (gram not in countsByGram) continue;

    countsByGram[gram]++
    if (countsByGram[gram] > 1)
        gen subgrams of all length
        delete each subgram from countsByGram

**/

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10}) {
    console.log(docStr);
    console.log(options);
    let grams = _generateGrams(docStr);

    grams.inDescLength.forEach((gramKey) => {
        if (! (gramKey in grams.countsByGram)) return;

        grams.countsByGram[gramKey]++;
        if (grams.countsByGram[gramKey] > 1)
            _deleteSubgrams(gramKey, grams.countsByGram);
    });

    let repeatedPhrases = _filterSingles(grams.countsByGram).map((gramKey) => _splitKey(gramKey).join(' '));
    return repeatedPhrases;

    console.log(JSON.stringify(repeatedPhrases, null, 4));


    function _generateGrams(docStr) {
        let grams = { countsByGram: {}, inDescLength: [] };
        let sentences = docStr.split(/\.\s+/); // TODO better sentence parser
        console.log('sentences',sentences); // TODO TODO TODO NOW address sentence split failure
        for (let n = options.MAX_GRAM; n >= options.MIN_GRAM; n--) {
            sentences.forEach((sentence) => {
                natural.NGrams.ngrams(sentence, n)
                    .forEach((gram) => {
                        let gramKey = _key(gram);
                        grams.countsByGram[gramKey] = 0;
                        grams.inDescLength.push(gramKey);
                    });
            });
        }
        // console.log(JSON.stringify(grams.inDescLength, null, 4));
        return grams;
    }

    function _deleteSubgrams(gramKey, keyHolder) {
        let gram = _splitKey(gramKey);
        for (let n = options.MIN_GRAM; n < gram.length; n++) {
            natural.NGrams.ngrams(gram, n)
                .forEach((gram) => {
                    let gramKey = _key(gram);
                    delete keyHolder[gramKey];
                });
        }
    }

    function _filterSingles(countsByGram) {
        return Object.keys(countsByGram)
                    .filter((gramKey) => countsByGram[gramKey] > 1);
    }

    function _key(gram) {
      return gram.join('|');
    }

    function _splitKey(gramKey) {
      return gramKey.split('|');
    }
}
