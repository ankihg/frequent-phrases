const fs = require('fs');
const expect = require('chai').expect;

let run = require('../run4');

const resources = [
    {filename: 'brown-fox', output: '["the lazy dog","the quick brown fox jumped over"]'},
    {filename: 'lazy-dog', output: '["the lazy dog","the quick brown fox jumped over"]'},
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
