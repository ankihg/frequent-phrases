const natural = require('natural');
const MIN_GRAM = 3;
const MAX_GRAM = 10;

/**
NOTE NOT GOOD ALGORITHM OR STRUCTURE
brown,fox,jumped,over"
SHOULD BE EXCLUDED CUZ IN "the quick brown fox jumped over"

"brown,fox,jumped": {
     "count": 2,
     "next": {
         "brown,fox,jumped,over": {
             "count": 2,
             "next": {
                 "brown,fox,jumped,over,the": {
                     "count": 1,
                     "next": {}
                 },
                 "brown,fox,jumped,over,ten": {
                     "count": 1,
                     "next": {}
                 }
             }
         }
     }
 },


**/


let docStr = 'The quick brown fox jumped over the lazy dog. The lazy dog, peeved to be labeled lazy, jumped over a snoring turtle. In retaliation the quick brown fox jumped over ten snoring turtles.'

// DISCUSS handling to capitalization
docStr = docStr.toLowerCase();

let sentences = docStr.split('. ');

let result = sentences.reduce((lookup, sentence) => {
    let grams = _generateGrams(sentence);
    console.log(grams);

    grams.forEach((gram) => {
        let key = _key(gram);
        lookup[key] = lookup[key] || 0;
        lookup[key]++;
    });


    // console.log(grams);
    console.log('\n\n\n');
    return lookup;
}, {});

// console.log(JSON.stringify(result, null, 4));

let sorted = Object.keys(result)
                .sort((aGram, bGram) =>  result[bGram] - result[aGram])
                .map((gram) => { return { gram: gram, count: result[gram], length: gram.split('|').length } });

console.log('\n\n\n');
console.log(JSON.stringify(sorted, null, 4));

let top_frequent = sorted.slice(0, 10);

console.log('\n\n\n');
console.log(JSON.stringify(top_frequent, null, 4));

let topSortedByLength = top_frequent.sort((a, b) => b.length - a.length);

console.log('\n\n\n');
console.log(JSON.stringify(topSortedByLength, null, 4));

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

console.log('\n\n\n');
console.log(JSON.stringify(fitleredFrequentPhrases, null, 4));


// let grams = natural.NGrams.ngrams('some other words here for you', 4)
// console.log(grams);



function _generateGrams(sentence) {
    let grams = [];
    for (let n = MIN_GRAM; n <= MAX_GRAM; n++) {
        grams = grams.concat(natural.NGrams.ngrams(sentence, n));
    }
    return grams;
}

function _key(gram) {
  return gram.join('|');
}
