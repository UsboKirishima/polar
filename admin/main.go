package main

import "fmt"

type ArgumentType int

const (
	String ArgumentType = iota
	Integer
	Double
	Option
	Boolean
)

type Argument struct {
	argType  ArgumentType
	name     string
	required bool
	value    string
}

type Command struct {
	name      string
	arguments []Argument
	desc      string
	usage     string
}

func (c *Command) removeCommand() int {
	return 1
}

func main() {

	for {
		fmt.Print("admin> ")

		var command string
		fmt.Scan(&command)

		c := Command{
			name:      "ciao",
			desc:      "ciao",
			arguments: nil,
		}

		c.removeCommand()

	}
}
