package main

import (
	"syscall/js"

	"github.com/traefik/yaegi/interp"
)

func printMessage(this js.Value, inputs []js.Value) interface{} {
	src := inputs[0].String()
	function := inputs[1].String()
	i := interp.New(interp.Options{})

	_, err := i.Eval(src)
	if err != nil {
		panic(err)
	}

	v, err := i.Eval("main." + function)
	if err != nil {
		panic(err)
	}

	bar := v.Interface().(func() string)

	r := bar()
	return r
}

func main() {
	c := make(chan bool)
	js.Global().Set("printMessage", js.FuncOf(printMessage))
	<-c
}
