var mod = function(boundary, input) {
	var i;
	var j;
	var output = [];
	var line;
	var lines = input.split(/\r?\n/g);
	var state = 'header';
	var started = false;
	var ended = false;
	var finished = false;
	var type = 'text';

	var content = '';
	var headers = {};
	var rawHeaders = [];

	for(i = 0; i < lines.length; i++) {
		if(state == 'header' && lines[i] == '') {
			state = 'message';
		} else {
			line = lines[i];

			// Unfold headers: https://tools.ietf.org/html/rfc5322#section-2.2.3
			if(state == 'header') {
				// Check while lines wrapped
				while((i + 1) < lines.length && /^\s/.test(lines[i + 1])) {
					i++;
					line += lines[i].replace(/(^\s*)/, '');
				}
			}

			//console.log('LINE: ' + line);
			handleLine(line);
		}
	}

	function handleHeader(input) {
		//console.log('HEADER INPUT: ' + input);
		var header;

		// Look for first boundary
		if(input.indexOf('--' + boundary) != -1) {
		} else {
			header = input.split(':');

			headers[header[0].trim().toLowerCase()] = header[1].trim();

			rawHeaders.push(header[0].trim());
			rawHeaders.push(header[1].trim());
		}
	}

	function handleLine(input) {
		//console.log('LINE INPUT: ' + input);
		var header;
		if(state == 'header') {
			handleHeader(input);
		} else {
			handleContent(input);
		}
	}

	function handleContent(input) {
		// Looking for end
		if(input.indexOf('--' + boundary) != -1) {
			// Remove last empty newline
			content = content.slice(0, -1);
			output.push({
				content: content,
				headers: headers,
				rawHeaders: rawHeaders
			});

			content = '';
			headers = {};
			rawHeaders = [];

			state = 'header';
		} else {
			content += input + '\n';
		}
	}

	return output;
}

module.exports = mod;
