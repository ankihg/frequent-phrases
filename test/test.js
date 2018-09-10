const fs = require('fs');
const expect = require('chai').expect;
const _ = require('underscore');

const solutions = {
    'solution1': require('../solutions/solution1'),
    'solution2': require('../solutions/solution2'),
};

const resources = {
    'brown-fox': { include: ["the quick brown fox jumped over","the lazy dog"] },
    'lazy-dog': { include: ["the quick brown fox jumped over","over the lazy dog","the quick fox"] },
    'sentence-division': { include: ["the quick brown fox jumped over","peeved to be"] },
    'nytimes-oped': { include: [ 'do what we can to', 'the work of the', 'to do what', 'the president s', 'of the administration', 'the white house', 'that many of' ] },
    'perf-test': { include: [ 'to see the', 'mother said norman', 'in the evening' ] },
    'perf-test-2': { include: [ "o er the", "of shakespeare and", "the poet s", "in order to","of all the","it will be","of the eighteenth century","with all the" ] },
    // 'perf-test-3': { include: [ "o er the", "of shakespeare and", "the poet s", "in order to","of all the","it will be","of the eighteenth century","with all the" ] },
};

const performance = {};

describe('test algorithms', function() {

    it('run4', function() {
        this.timeout(18000);
        _.each(resources, (expectedOutput, filename) => {
            let data = fs.readFileSync(`${ __dirname }/resources/${ filename }.txt`);
            let documentString = data.toString();

            performance[filename] = {};
            _.each(solutions, (solution, solutionKey) => {

                let startTime = Date.now();
                let output = solution.exec(documentString);
                let endTime = Date.now();
                // if (filename === 'perf-test-2') console.log(JSON.stringify(output));

                let unexpecedOutput = _isUnexpectedOutput(expectedOutput, output);
                if (unexpecedOutput) console.log(filename, solutionKey, unexpecedOutput);
                expect(unexpecedOutput).not.exist;
                performance[filename][solutionKey] = endTime - startTime;

            });
        });

        console.log('\n\n\n');
        console.log(JSON.stringify(performance, null, 4));
    });


});

function _isUnexpectedOutput(expected, output) {
    if (output.length < expected.include.length) return { expected, output };
    let outputValueHash = output.reduce((hash, value) => { hash[value] = true; return hash }, {});
    for (let expectedValue of expected.include)
        if (! (expectedValue in outputValueHash)) return { expected, output };
}
