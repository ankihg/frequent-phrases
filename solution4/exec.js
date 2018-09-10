'use strict';
module.exports = exec;

const natural = require('natural');
const tokenizer = new natural.TreebankWordTokenizer();
const utils = require('../utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10, N_TOP: 10}) {
    docStr = utils.cleanDocument(docStr);

    let sentences = utils.parseSentences(docStr);
    sentences.reduce((lookup, sentence) => {
        let words = tokenizer.tokenize(sentence);

        


    }, {});



    return

    // let grams = _generateGrams(docStr);
    // // console.log('grams');
    // // console.log(JSON.stringify(grams, null, 4));
    // grams.counts = grams.inDescLength.reduce((countsByGram, gramKey) => {
    //     if (gramKey in grams.validPhrases) {
    //         countsByGram[gramKey] = countsByGram[gramKey] || 0;
    //         countsByGram[gramKey]++;
    //         if (countsByGram[gramKey] === 2)
    //             _deleteSubgrams(gramKey, grams.validPhrases);
    //     }
    //     return countsByGram;
    // }, {});
    //
    //
    // return Object.keys(grams.counts)
    //         .filter((gramKey) => grams.counts[gramKey] > 1)
    //         .sort((gramKeyA, gramKeyB) => grams.counts[gramKeyB] - grams.counts[gramKeyA])
    //         .slice(0, options.N_TOP)
    //         // .map((gramKey) => { return {phrase: utils.splitKey(gramKey).join(' '), count: grams.counts[gramKey]}});
    //         .map((gramKey) => utils.splitKey(gramKey).join(' '));


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
