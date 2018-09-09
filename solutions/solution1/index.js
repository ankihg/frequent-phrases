'use strict';
module.exports = {
    exec: require('./exec'),
    description: `
        The goal with this solution was to have as simple a counting process as possible and leave the complicated work, like removing subphrases, to the end.

        The cleanup work to be done after counting ends up being quite complicated and extremely innefficient, as it requires iterating through all the phrases several times.

        I don't recommend this approach.

    `,
    pseudo: `
        generate all phrases from MIN_LENGTH to MAX_LENGTH
        iteratate thru all phrases to collect phrase counts
        iterate thru all phrases to filter out non-repeated phrases
        filter out subphrases of repeated phrases
        sort remaining phrases by counts
        return top N
    `,
};
