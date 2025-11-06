/* This file is the command parser for the Polar's admin CLI */
package admin

import "fmt"

type ArgumentType int

const (
	String ArgumentType = iota
	Integer
	Boolean /* ON | OFF */
	Enum    /* e.g. BN | COLOR */
)

type Argument struct {
	Type     ArgumentType
	Name     string /* The argument name is used to identify the arg e.g. --help */
	Required bool
	Value    string /* This value is set after the command parsing */
}

type Command struct {
	Name      string /* Command identifier (unique) */
	Arguments []Argument
	Desc      string
	Usage     string
}

func NewCommand(name string, desc string, usage string) *Command {
	return &Command{
		Name:      name,
		Desc:      desc,
		Usage:     usage,
		Arguments: nil,
	}
}

func (c *Command) run() {
	fmt.Println("Running command ", c.Name)
}
