'use strict';
module.exports = exec;

const natural = require('natural');
const utils = require('./utils');

/**
The goal with this approach is to avoid collecting subphrases of repeated superphrases.

This requires visiting phrases first, so you know what subphrases to avoid.

The `_generateGrams` function handles this by returning an array (`inDescLength`) with longer phrases first.


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

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10, N_TOP: 10}) {
    let grams = _generateGrams(docStr);

    grams.inDescLength.forEach((gramKey) => {
        if (! (gramKey in grams.countsByGram)) return;

        grams.countsByGram[gramKey]++;
        if (grams.countsByGram[gramKey] > 1)
            _deleteSubgrams(gramKey, grams.countsByGram);
    });

    // require('fs').writeFile('./run4.json', JSON.stringify(grams.countsByGram, null, 4), (err) => {});
    // console.log('grams.countsByGram');
    // console.log(JSON.stringify(grams.countsByGram, null, 4));

    return Object.keys(grams.countsByGram)
            .filter((gramKey) => grams.countsByGram[gramKey] > 1)
            .sort((gramKeyA, gramKeyB) => grams.countsByGram[gramKeyB] - grams.countsByGram[gramKeyA])
            .slice(0, options.N_TOP)
            // .map((gramKey) => { return {phrase: _splitKey(gramKey).join(' '), count: grams.countsByGram[gramKey]}});
            .map((gramKey) => _splitKey(gramKey).join(' '));


    function _generateGrams(docStr) {
        let grams = { countsByGram: {}, inDescLength: [] };
        let sentences = utils.parseSentences(docStr);
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

    function _key(gram) {
      return gram.join('|');
    }

    function _splitKey(gramKey) {
      return gramKey.split('|');
    }
}
