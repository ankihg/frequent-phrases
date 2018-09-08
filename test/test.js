const fs = require('fs');
const expect = require('chai').expect;

let run = require('../run4');


describe('test algorithms', () => {

    it('run4', (done) => {
        fs.readFile(__dirname + '/resources/brown-fox.txt', (err, data) => {
            expect(err).not.exist;

            let documentString = data.toString();
            documentString = documentString.toLowerCase(); // TODO discuss handling to capitalization

            let output = run(documentString);
            console.log(output);
            return done();
        })
    });


});
