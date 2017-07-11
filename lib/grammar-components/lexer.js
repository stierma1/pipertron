var Set = require("../set");

var coreTokens = new Set([{matcher: "\\s+", token:"\"WHITE_SPACE\"", priority:0},
  {matcher:"\"(\"", token:"\"(\""}, {matcher:"\")\"", token:"\")\""},
  {matcher:"\"|\"", token: "\"|\""}, {matcher:"(.)", token:"\"UNKNOWN_CHAR\"", priority:1},
  {matcher:"<<EOF>>", token:"'EOF'", priority:2}], (a,b) => {return a.matcher === b.matcher})

function buildLexer(tokens){
  var tokenList = tokens.getUnique();
  tokenList.sort((a,b) => {
    return (a.priority !== undefined ? a.priority : .5)  - (b.priority !== undefined ? b.priority : .5)
  })

  var listStr = tokenList.reduce((red, ele) => {
    red += ele.matcher + "\treturn " + ele.token + "\n"
    return red;
  }, "");

  return `/* description: Parses and executes mathematical expressions. */

  /* lexical grammar */
%lex
%%
${listStr}


/lex
`
}

module.exports = {
  coreTokens: coreTokens,
  buildLexer: buildLexer
}
