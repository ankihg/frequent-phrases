const natural = require('natural');
const MIN_GRAM = 3;
const MAX_GRAM = 10;

/**
TODO idea, plz shoot holes

gen all grams from MIN_GRAM to MAX_GRAM
build hash of grams to count=0 [countsByGram]
build gramOrder array that has grams by length, longests first
for (gram in gramOrder)
    if (gram not in countsByGram) continue;

    countsByGram[gram]++
    if (countsByGram[gram] > 1)
        gen subgrams of all length
        delete each subgram from countsByGram

**/


let docStr = 'The quick brown fox jumped over the lazy dog. The lazy dog, peeved to be labeled lazy, jumped over a snoring turtle. In retaliation the quick brown fox jumped over ten snoring turtles.';
docStr = docStr.toLowerCase(); // TODO discuss handling to capitalization
let grams = _generateGrams(docStr);

grams.inDescLength.forEach((gramKey) => {
    if (! (gramKey in grams.countsByGram)) return;

    grams.countsByGram[gramKey]++;
    if (grams.countsByGram[gramKey] > 1)
        _deleteSubgrams(gramKey, grams.countsByGram);
});

let repeatedPhrases = _filterSingles(grams.countsByGram).map((gramKey) => _splitKey(gramKey).join(' '));

console.log(JSON.stringify(repeatedPhrases, null, 4));


function _generateGrams(docStr) {
    let grams = { countsByGram: {}, inDescLength: [] };
    let sentences = docStr.split('. '); // TODO better sentence parser

    for (let n = MIN_GRAM; n <= MAX_GRAM; n++) {
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
    for (let n = MIN_GRAM; n < gram.length; n++) {
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
