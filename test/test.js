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
    'brown-fox': '["the quick brown fox jumped over","the lazy dog"]',
    'lazy-dog': '["the quick brown fox jumped over","over the lazy dog","the quick fox"]',
    'sentence-division': '["the quick brown fox jumped over","peeved to be"]',
};


describe('test algorithms', () => {

    it('run4', () => {
        _.each(resources, (expectedOutput, filename) => {
            let data = fs.readFileSync(`${ __dirname }/resources/${ filename }.txt`);

            let documentString = data.toString();
            documentString = documentString.toLowerCase(); // TODO discuss handling to capitalization

            let output = run(documentString);
            expect(JSON.stringify(output)).equal(expectedOutput);

            console.log(JSON.stringify(output));
        });
    });


});
