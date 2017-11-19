
var Component = require("./lib/component");
var buildJison = require("./lib/build");
var Set = require("./lib/set");

var jison = require("jison");
var registry = require("./lib/pipertron-component-registry");

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

  static executeUsingRegistry(libs, string){
    var components = registry.getPattern("#Components:*").map((d) => {
      return d.document;
    });
    return PiperTron.execute(components, libs, string);
  }

  static buildFromRegistry(libs){
    var components = registry.getPattern("#Components:*").map((d) => {
      return d.document;
    });

    return new PiperTron(components, libs);
  }

  static getRegistry(){
    return registry;
  }

  static setRegistry(replacement){
    registry = replacement;
  }
}

module.exports = {
  Component:Component,
  Set: Set,
  PiperTron:PiperTron
}
