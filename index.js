require('./wasm_exec');
const fs = require('fs');
const src = `
package main
func Bar(s string) string { return "Hello, " + s }
func exec() string { return Bar("World") }
`;
fetch(
  'https://github.com/Innovativenut/wasm-with-go/blob/master/main.wasm?raw=true'
)
  .then(async data => {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await WebAssembly.compile(resp);
      return await WebAssembly.instantiate(source, importObject);
    };

    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
      data,
      go.importObject
    );
    go.run(result);
    console.log(printMessage(src, 'exec'));
  })
  .catch();
