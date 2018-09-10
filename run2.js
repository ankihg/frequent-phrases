const natural = require('natural');
const MIN_GRAM = 3;
const MAX_GRAM = 5;

/**
its the same problem as run.js
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

/**
MIN_GRAM_LENGTH = 3
MAX_GRAM_LENGTH = 5
DOCUMENT_STRING


lookup = {}
SPLIT DOCUMENT_STRING INTO SENTENCES
FOR EACH SENTENCE
  SPLIT SENTENCE INTO WORDS
  FOR (startIndex = 0; startIndex < WORDS.length - MIN_GRAM_LENGTH)
    endIndex = startIndex + MIN_GRAM_LENGTH
    min_gram = WORDS.slice(startIndex, endIndex)
    lookup[min_gram] = lookup[min_gram] || { count: 0, next: {} }
    lookup[min_gram].count++
    lookup = lookup[min_gram].next
    let j = endIndex + 1
    WHILE (j < WORDS.length)
      next_gram = WORDS.slice(startIndex, j)
      lookup[next_gram] = lookup[next_gram] || { count: 0, next: {} }
      lookup = lookup[next_gram].next

**/


let docStr = 'The quick brown fox jumped over the lazy dog. The lazy dog, peeved to be labeled lazy, jumped over a snoring turtle. In retaliation the quick brown fox jumped over ten snoring turtles.'
let sentences = docStr.split('. ');

const countsByGram = {};
let result = sentences.reduce((lookup, sentence) => {
    let words = sentence.split(' ');
    for (let startIndex = 0; startIndex < words.length - MIN_GRAM; startIndex++) {
        lookup = countsByGram;
        let endIndex = startIndex + MIN_GRAM;
        let gram = words.slice(startIndex, endIndex);
        console.log(gram);
        lookup[gram] = lookup[gram] || { count: 0, next: {} };
        // console.log(lookup[gram]);
        lookup[gram].count++;
        // console.log(lookup);
        lookup = lookup[gram].next;
        while ( ++endIndex < words.length ) {
            let gram = words.slice(startIndex, endIndex);
            lookup[gram] = lookup[gram] || { count: 0, next: {} };
            lookup[gram].count++;
            lookup = lookup[gram].next;
        }
    }

    console.log('\n\n\n');
    return lookup;

}, countsByGram);
// console.log(countsByGram);
console.log(JSON.stringify(countsByGram, null, 4));
