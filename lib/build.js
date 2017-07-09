var Set = require("./set");
var jsonComponents = require("./grammar-components/json-component");
var lexer = require("./grammar-components/lexer");

function buildExpressions(components){
  var starts = components.filter((x) => {
    return x.type === "start"
  })

  var startExpression = `
start
  : /**/ {
    throw new Error("No Start expression found")
  }
  `;

  startExpression = starts.reduce((red, x) => {
    red += " | " + x.expression + " -> $1\n"
    return red;
  }, startExpression);
  startExpression += " ;\n"

  var nonStarts = components.filter((x) => {
    return x.type !== "start"
  })

  var expressions = `
expressions
  : start -> $1
  `
  expressions = nonStarts.reduce((red, x) => {
    red += " | " + x.expression + " -> $1\n"
    return red;
  }, expressions);
  expressions += " ;\n"

  return {start:startExpression, expression:expressions};
}

function buildJison(components){
  var lexerTokens =components.reduce((red, x) => {
    return Set.union(red, x.getCoreTokens());
  },
   Set.union(jsonComponents.coreTokens, lexer.coreTokens));

  var lex = lexer.buildLexer(lexerTokens);

  var jsonOmissionTokens = components.reduce((red, x) => {
    return Set.union(red, x.getCoreTokens());
  }, lexer.coreTokens);

  var grammars = jsonComponents.grammars(jsonOmissionTokens);
  var componentExpressions = components.reduce((red, x) => {
    red += x.buildExpression()
    return red;
  }, "");

  var {start, expression} = buildExpressions(components);

  return `${lex}
/* operator associations and precedence */

%start j

%% /* language grammar */
  j
  : expressions EOF {
    return $1
  }
  ;
  ${start}

  ${expression}

  ${grammars}

  ${componentExpressions}
`
}
module.exports = buildJison
