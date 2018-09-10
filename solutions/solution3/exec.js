'use strict';
module.exports = exec;

const utils = require('../utils');

function exec(docStr, options={MIN_GRAM: 3, MAX_GRAM: 7, N_TOP: 10}) {
    docStr = utils.cleanDocument(docStr);

    let sentences = utils.parseSentences(docStr);
    let tree = sentences.reduce((lookup, sentence) => {
        // console.log('\n\n\n');
        let words = utils.tokenize(sentence);

        for (let startIndex = 0; startIndex <= words.length - options.MIN_GRAM; startIndex++) {
            // console.log('\n');

            let endIndex = startIndex + options.MIN_GRAM;

            let gram = words.slice(startIndex, endIndex);
            // console.log('i', gram);
            let gramKey = utils.key(gram);
            lookup[gramKey] = lookup[gramKey] || {count: 0, next: {}};
            lookup[gramKey].count++;
            let gramNode = lookup[gramKey].next;

            let node = gramNode;
            let forwardIndex = endIndex;
            while (forwardIndex < words.length && forwardIndex < (startIndex + options.MAX_GRAM)) {
                let gram = words.slice(startIndex, forwardIndex + 1);
                // console.log('f', gram);
                let gramKey = utils.key(gram);
                node[gramKey] = node[gramKey] || {count: 0, next: {}};
                node[gramKey].count++;
                node = node[gramKey].next;
                forwardIndex++;
            }

            node = gramNode;
            let backIndex = startIndex - 1;
            while (backIndex >= 0 && (options.MAX_GRAM >= (endIndex - backIndex))) {
                let gram = words.slice(backIndex, endIndex);
                // console.log('b', gram);
                let gramKey = utils.key(gram);
                node[gramKey] = node[gramKey] || {count: 0, next: {}};
                node[gramKey].count++;
                node = node[gramKey].next;
                backIndex--;
            }

        }
        return lookup;

    }, {});


    /*
    tree is wrong
    the|quick|brown|fox
        retaliation|the|quick|brown|fox
        then|the|quick|brown|fox

        should also point to
        the|quick|brown|fox|jumped
        the|quick|brown|fox|refueled
    */

    console.log('tree');
    console.log(JSON.stringify(tree, null, 4));
    console.log('tree end');


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
                else {
                    console.log(gramKey, JSON.stringify(node, null, 4));
                    console.log('\n');
                    result[gramKey] = true;
                }
            }

        }, {});

    // console.log('result');
    // console.log(JSON.stringify(result, null, 4));
    // BUG results aren't right
    return Object.keys(result)
                .map((gramKey) => utils.splitKey(gramKey).join(' '));
}
