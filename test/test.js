const fs = require('fs');
const expect = require('chai').expect;

let run = require('../run4');

const resources = [
    {filename: 'brown-fox', output: '["the quick brown fox jumped over","the lazy dog"]'},
    {filename: 'lazy-dog', output: '["the quick brown fox jumped over","over the lazy dog","the quick fox"]'},
    {filename: 'sentence-division', output: '["the quick brown fox jumped over","peeved to be"]'},
];


describe('test algorithms', () => {

    it('run4', () => {
        resources.forEach((resource) => {
            let data = fs.readFileSync(`${ __dirname }/resources/${ resource.filename }.txt`);

            let documentString = data.toString();
            documentString = documentString.toLowerCase(); // TODO discuss handling to capitalization

            let output = run(documentString);
            expect(JSON.stringify(output)).equal(resource.output);

            console.log(JSON.stringify(output));
        });
    });


});
