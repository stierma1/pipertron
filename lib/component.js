var Set = require("./set")
var RegisteredComponent = require("./registered-component");

class Component extends RegisteredComponent{
  constructor({type, name, token, priority, args, action}){
    super(name);
    this.type = type;
    this.name = name;
    this.token = token;
    this.priority = priority;
    this.args = args || [];
    this.action = action;
  }

  getCoreTokens(){
    return new Set([{token:"'" + this.token + "'", matcher: "'" + this.token + "'", priority:this.priority}])
  }

  buildSemanticAction(){
    var s = []
    if(this.type !== "start"){
      s.push("expressions");
      s.push("|")
      s.push("optionalWhiteSpace")

    }
    s.push(this.token);
    s = s.concat(this.args)
    var argsStr = s.map((x, i) => {return "$" + (i + 1)}).join(", ");
    return `{
      $$ = yy.COMPONENTS.${this.name}.action(yy${argsStr !== ""? ", " + argsStr : ""});
}    `
  }

  buildExpression(){
    if(this.type === "start"){
      return `
${this.name.toLowerCase() + "Expression"}
  : ${this.token}${this.args.reduce((red, x) => {red += " " + x; return red }, "")} ${this.buildSemanticAction()}
  ;`
    }

    if(this.type !== "start"){
      return `
${this.name.toLowerCase() + "Expression"}
  : expressions "|" optionalWhiteSpace ${this.token}${this.args.reduce((red, x) => {red += " " + x; return red }, "")} ${this.buildSemanticAction()}
  ;`
    }
  }

}


module.exports = Component;
