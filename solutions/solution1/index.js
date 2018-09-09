'use strict';
module.exports = {
    exec: require('./exec'),
    description: `

    `,
    pseudo: `
        generate all phrases
        iteratate thru all phrases to collect phrase counts
        iterate thru all phrases to filter out non-repeated phrases
        filter out subphrases of repeated phrases
        sort remaining phrases by counts
        return top N
    `,
};
