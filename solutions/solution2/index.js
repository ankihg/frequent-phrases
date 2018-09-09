'use strict';
module.exports = {
    exec: require('./exec'),
    description: `
        The goal with this approach is to avoid collecting subphrases of repeated superphrases so they don't have to be filtered out at the end.

        This requires visiting longer phrases first, so you know what subphrases to avoid collecting.

        The \`_generateGrams\` helper function handles this by returning an array (\`inDescLength\`) with longer phrases first.



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
