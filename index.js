require('./wasm_exec');
const fs = require('fs');
const src = `
package main
func Bar(s string) string { return "Hello, " + s }
func exec() string { return Bar("World") }
`;
fs.readFile('./main.wasm', async (err, data) => {
	WebAssembly.instantiateStreaming = async (resp, importObject) => {
		const source = await WebAssembly.compile(resp);
		return await WebAssembly.instantiate(source, importObject);
	};

	const go = new Go();
	const result = await WebAssembly.instantiateStreaming(data, go.importObject);
	go.run(result);
	console.log(printMessage(src, 'exec'));
});
