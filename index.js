
var Component = require("./lib/component");
var buildJison = require("./lib/build");
var Set = require("./lib/set");

var jison = require("jison");

class PiperTron{
  constructor(components, libs){
    this.jisonString = buildJison(components || [])
    var parser = jison.Parser(this.jisonString);
    var COMPONENTS = {};

    components.map((c) => {
      COMPONENTS[c.name] = c;
    });

    parser.yy = {COMPONENTS:COMPONENTS};
    parser.yy.LIBS = libs;

    this.parser = parser;
  }

  execute(string){
    return this.parser.parse(string);
  }

  static execute(components, libs, string){
    var p = new PiperTron(components, libs);
    return p.parse(string);
  }
}

module.exports = {
  Component:Component,
  Set: Set,
  PiperTron:PiperTron
}
