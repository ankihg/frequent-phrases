'use strict';
module.exports = {
    exec: require('./exec'),
    description: `
        My goal is to collect the phrase counts in a data structure that can natively handle the storage of subphrases, so subphrases don't have to be determined and marked invalid like in Solution Two.

        One data structure I thought of was a tree where each `MIN_LENGTH` phrase would point to all the `MIN_LENGTH + 1` phrases its a subphrase of, and so on. Each node storing its count.

        This would require traversing the data structure at the end to get repeated superphrases of repeated phrases.

        Other data structures are considered were a Trie and a Suffix Tree.
    `,
    pseudo: `

    `,
};
