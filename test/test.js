const fs = require('fs');
const expect = require('chai').expect;
const _ = require('underscore');
const natural = require('natural');
const tokenizer = new natural.TreebankWordTokenizer();

const solutions = {
    'solution1': require('../solutions/solution1'),
    'solution2': require('../solutions/solution2'),
};

const resources = {
    'brown-fox': { include: ["the quick brown fox jumped over","the lazy dog"], exclude: ["the quick brown","quick brown fox","the quick brown fox jumped","the lazy"] },
    'lazy-dog': { include: ["the quick brown fox jumped over","over the lazy dog","the quick fox"], exclude: ["the lazy dog", "the quick brown fox"] },
    'sentence-division': { include: ["the quick brown fox jumped over","peeved to be"] },
    'nytimes-oped': { include: [ 'trump ’ s', 'it ’ s' ] },
    'perf-test': {
        prepare: _formantDocumentString,
        expect: { include: [ 'down the river' ] },
    },
    'perf-test-2': {
        prepare: _formantDocumentString,
        expect: { include: [ 'the poet ’ s', 'o ’ er the', '’ d to' ] },
    },
};

const performance = {};

describe('test algorithms', function() {

    it('run4', function() {
        this.timeout(50000);
        _.each(resources, (file, filename) => {
            let prepare = file.prepare || ((a) => a);
            let expectedOutput = file.expect || file;

            let data = fs.readFileSync(`${ __dirname }/resources/${ filename }.txt`);
            let documentString = prepare(data.toString());

            performance[filename] = {
                numWords: tokenizer.tokenize(documentString).length,
                expect: expectedOutput,
            };
            _.each(solutions, (solution, solutionKey) => {

                let startTime = Date.now();
                let output = solution.exec(documentString);
                let endTime = Date.now();

                let unexpecedOutput = _isUnexpectedOutput(expectedOutput, output);
                if (unexpecedOutput) console.log(filename, solutionKey, unexpecedOutput);
                expect(unexpecedOutput).not.exist;
                performance[filename][solutionKey] = {
                    output: output,
                    runtime: endTime - startTime,
                };

            });
        });

        console.log('\n\n\n');
        console.log('PERFORMANCE SUMMARY');
        console.log(JSON.stringify(performance, null, 4));
    });


});

function _isUnexpectedOutput(expected, output) {
    if (output.length < expected.include.length) return { expected, output };
    let outputValueHash = output.reduce((hash, value) => { hash[value] = true; return hash }, {});
    for (let expectedValue of expected.include || [])
        if (! (expectedValue in outputValueHash)) return { expected, output };
    for (let expectedValue of expected.exclude || [])
        if (expectedValue in outputValueHash) return { expected, output };
}

function _formantDocumentString(documentString) {
    return documentString.replace(/\n/g, ' ')
}
