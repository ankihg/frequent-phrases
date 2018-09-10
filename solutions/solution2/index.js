'use strict';
module.exports = {
    exec: require('./exec'),
    description: `
        The goal with this approach is to avoid collecting subphrases of repeated phrases so they don't have to be filtered out at the end.

        This requires visiting longer phrases first, so you know what subphrases to avoid collecting.

        The \`_generateGrams\` helper function handles this by returning an array (\`inDescLength\`) with longer phrases first. This will be the order that we iterate through the phrases in.

        A possible improvement to the efficiency would be, at phrase generation time, to build a lookup from a phrase to its subphrases. That way, when you see that a phrase has repeated you can lookup which subphrases to delete from the valid phrases lookup, instead of regenerating the subphrases for that phrase, as the algorithm is currently doing. This would require writing a custom ngram generation function, sacrificing maintainability, so I've decided not to implement.
    `,
    pseudo: `
        generate all phrases from MIN_LENGTH to MAX_LENGTH
        build hash of valid phrases
        build phraseOrder array that has phrases by length, longests first
        for (phrase in phraseOrder)
            if (phrase not in validPhrases)
                countsByGram[gram] = countsByGram[gram] || 0
                countsByGram[gram]++
                if (countsByGram[gram] > 1)
                    gen subphrases of all length for phrase
                    delete each subphrase from validPhrases
    `,
};
