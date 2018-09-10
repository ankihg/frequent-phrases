'use strict';
module.exports = {
    exec: require('./exec'),
    description: `
        My goal is to collect the phrase counts in a data structure that can natively handle the storage of subphrases, so subphrases don't have to be determined and marked invalid like in Solution Two.

        One data structure that I considered using was a Trie but


        This would require traversing the data structure at the end to get subphrases for non-repeated phrases.

    `,
    pseudo: `

    `,
};
