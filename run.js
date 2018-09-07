const natural = require('natural');
const MIN_GRAM = 3;
const MAX_GRAM = 5;


let docStr = 'The quick brown fox jumped over the lazy dog. The lazy dog, peeved to be labeled lazy, jumped over a snoring turtle. In retaliation the quick brown fox jumped over ten snoring turtles.'
let sentences = docStr.split('. ');

sentences.forEach((sentence) => {
    _generateGrams(sentence)
});



// let grams = natural.NGrams.ngrams('some other words here for you', 4)
// console.log(grams);



function _generateGrams(sentence) {
    let maxGrams = natural.NGrams.ngrams(sentence, MAX_GRAM);

    let firstGram = maxGrams[0];
    let toMinGramsStart = firstGram.reduce((grams, token, i) => {
        if (i >= MIN_GRAM && i < MAX_GRAM)
            grams.push(firstGram.slice(0, i));
        return grams;
    }, []);

    let endGram = maxGrams[maxGrams.length - 1];
    let toMinGramsEnd = endGram.reduce((grams, token, i) => {
        let distanceToEnd = endGram.length - i;
        if (distanceToEnd >= MIN_GRAM && distanceToEnd < MAX_GRAM)
            grams.push(endGram.slice(i));
        return grams;
    }, []);

    console.log('maxGrams', maxGrams);
    console.log('toMinGramsStart', toMinGramsStart);
    console.log('toMinGramsEnd', toMinGramsEnd);
    console.log('\n\n\n');
}
