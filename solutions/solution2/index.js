'use strict';
module.exports = {
    exec: require('./exec'),
    description: `
        
    `,
    pseudo: `
        gen all grams from MIN_GRAM to MAX_GRAM
        build hash of grams to count=0 [countsByGram]
        build gramOrder array that has grams by length, longests first
        for (gram in gramOrder)
            if (gram not in countsByGram) continue;

            countsByGram[gram]++
            if (countsByGram[gram] > 1)
                gen subgrams of all length
                delete each subgram from countsByGram

    `,
};
