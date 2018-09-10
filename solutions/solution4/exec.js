'use strict';
module.exports = exec;

const natural = require('natural');
const tokenizer = new natural.TreebankWordTokenizer();
const utils = require('../utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 10, N_TOP: 10}) {
    docStr = utils.cleanDocument(docStr);

    let sentences = utils.parseSentences(docStr);
    let tree = sentences.reduce((lookup, sentence) => {
        let words = tokenizer.tokenize(sentence);

        for (let startIndex = 0; startIndex <= words.length - options.MIN_GRAM; startIndex++) {
            let endIndex = startIndex + options.MIN_GRAM;

            let gram = words.slice(startIndex, endIndex);
            let gramKey = utils.key(gram);
            lookup[gramKey] = lookup[gramKey] || {count: 0, next: {}};
            lookup[gramKey].count++;
            let gramNode = lookup[gramKey].next;

            let node = gramNode;
            let forwardIndex = endIndex + 1;
            while (forwardIndex < words.length && forwardIndex <= (options.MAX_GRAM - options.MIN_GRAM)) {
                let gram = words.slice(startIndex, forwardIndex);
                let gramKey = utils.key(gram);
                node[gramKey] = node[gramKey] || {count: 0, next: {}};
                node[gramKey].count++;
                node = node[gramKey].next;
                forwardIndex++;
            }

            node = gramNode;
            let backIndex = startIndex - 1;
            while (backIndex >= 0 && backIndex > (startIndex - (options.MAX_GRAM - options.MIN_GRAM))) {
                let gram = words.slice(backIndex, endIndex);
                let gramKey = utils.key(gram);
                node[gramKey] = node[gramKey] || {count: 0, next: {}};
                node[gramKey].count++;
                node = node[gramKey].next;
                backIndex--;
            }

        }
        return lookup;

    }, {});

    console.log('tree');
    console.log(JSON.stringify(tree, null, 4));

    let result = Object.keys(tree).
        reduce((result, minGramKey) => {
            let minGramNode = tree[minGramKey];
            if (minGramNode.count < 2) return result;

            _traverse(minGramKey, minGramNode, result);
            return result;

            function _traverse(gramKey, node, result) {
                // console.log('_traverse', gramKey, result);
                let nextRepeatGramKeys = Object.keys(node.next).filter((gramKey) => node.next[gramKey].count > 1);
                if (nextRepeatGramKeys.length)
                    nextRepeatGramKeys.forEach((gramKey) => _traverse(gramKey, node.next[gramKey], result));
                else result[gramKey] = true;
            }

        }, {});

    console.log('result');
    console.log(JSON.stringify(result, null, 4));

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
