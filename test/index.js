var tap = require('agraddy.test.tap')(__filename);
var fs = require('fs');
var path = require('path');

var mod = require('../');

var actual;
var expected;

process.chdir('test');

actual = mod('AA', getText('basic.txt'));
expected = getJSON('basic.json');
console.log('actual');
console.log(actual);
console.log('expected');
console.log(expected);
tap.assert.deepEqual(actual, expected, 'Should be equal.');


function getText(input) {
	return fs.readFileSync(path.join('fixtures', input)).toString();
}

function getJSON(input) {
	return require('./fixtures/' + input);
}
