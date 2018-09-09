const fs = require('fs');
const expect = require('chai').expect;
const _ = require('underscore');

let run = require('../run3');
// let run = require('../run4');

const solutions = {
    'run3': require('../run3'),
    'run4': require('../run4'),
};

const resources = {
    'brown-fox': ["the quick brown fox jumped over","the lazy dog"],
    'lazy-dog': ["the quick brown fox jumped over","over the lazy dog","the quick fox"],
    'sentence-division': ["the quick brown fox jumped over","peeved to be"],
    'nytimes-oped': [ 'do what we can to', 'the work of the', 'to do what', 'the president s', 'of the administration', 'the white house', 'that many of' ],
};

const performance = {};

describe('test algorithms', () => {

    it('run4', () => {
        _.each(resources, (expectedOutput, filename) => {
            let data = fs.readFileSync(`${ __dirname }/resources/${ filename }.txt`);
            let documentString = data.toString();
            documentString = documentString.toLowerCase(); // TODO discuss handling to capitalization

            performance[filename] = {};
            _.each(solutions, (execSolution, solutionKey) => {

                let startTime = Date.now();
                let output = execSolution(documentString);
                let endTime = Date.now();

                let unexpecedOutput = _isUnexpectedOutput(expectedOutput, output);
                if (unexpecedOutput) console.log(unexpecedOutput);
                expect(unexpecedOutput).not.exist;
                performance[filename][solutionKey] = endTime - startTime;

            });
        });

        console.log('\n\n\n');
        console.log(JSON.stringify(performance, null, 4));
    });


});

function _isUnexpectedOutput(expected, output) {
    if (output.length !== expected.length) return { expected, output };
    let outputValueHash = output.reduce((hash, value) => { hash[value] = true; return hash }, {});
    for (let expectedValue of expected)
        if (! (expectedValue in outputValueHash)) return { expected, output };
}
