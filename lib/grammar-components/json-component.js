var Set = require("../set");

var coreTokens = new Set([
  {matcher: "[0-9]", token:"\"DIGIT\""},
  {matcher:"\"true\"", token: "\"TRUE\""},
  {matcher:"\"false\"", token: "\"FALSE\""},
  {matcher:"[\\.]", token: "\"DOT\""},
  {matcher:"[e]", token: "\"e\"", priority:.8},
  {matcher:"[E]", token: "\"E\"", priority:.8},
  {matcher:"\"null\"", token: "\"NULL\""},
  {matcher:"\"+\"", token: "\"PLUS\""},
  {matcher:"\"-\"", token: "\"HYPHON\""},
  {matcher:"\"\\\"\"", token: "\"DOUBLE_QUOTE\""},
  {matcher:"\"\\\\\\\\\"", token: "\"FULLY_ESCAPED\"", priority:.49},
  {matcher:"\"\\\\\"", token: "\"ESCAPE_CHAR\""},
  {matcher:"\":\"", token: "\":\""},
  {matcher:"\"{\"", token: "\"{\""},
  {matcher:"\"}\"", token: "\"}\""},
  {matcher:"\"[\"", token: "\"[\""},
  {matcher:"\"]\"", token: "\"]\""},
  {matcher:"\",\"", token: "\",\""},
], (a,b) => {return a.matcher === b.matcher})

function grammars(ommissionTokens){
  var ommissions = ommissionTokens.getUnique()
    .map((x) => {return x.token})
    .reduce((red, x) => {
       red += `| ${x} -> $1\n`
       return red;
    }, "");

    return `json
      : object -> $1
      | array -> $1
      | escapeString -> $1
      | boolean -> $1 === "true"
      | jsNumber {
        $$ = JSON.parse($1)
      }
      | NULL -> null
      ;

    optionalWhiteSpace
      : /**/ -> ""
      | WHITE_SPACE -> $1
      ;

    boolean
      : TRUE -> "true"
      | FALSE -> "false"
      ;

    number
      : DIGIT -> $1
      | number DIGIT -> $1
      ;

    tokensNoEscapeOrQuote
      : "}" -> $1
      | DOT -> $1
      | "{" -> $1
      | ":" -> $1
      | "[" -> $1
      | "]" -> $1
      | "," -> $1
      | NULL -> $1
      | "e" -> $1
      | "E" -> $1
      | HYPHON -> $1
      | PLUS -> $1
      | boolean -> $1
      | DIGIT -> $1
      ${ommissions}
      ;

      decimal
          : number frac -> $1 + $2
          ;

      frac
          : DOT number -> $1 + $2
          ;

      intOrDecimal
          : HYPHON number -> $1 + $2
          | number -> $1
          | HYPHON decimal -> $1 + $2
          | decimal -> $1
          ;

      scientific
          : intOrDecimal "e" number -> $1 + $2 + $3
          | intOrDecimal "e" HYPHON number -> $1 + $2 + $3 + $4
          | intOrDecimal "e" PLUS number -> $1 + $2 + $3 + $4
          | intOrDecimal "E" number -> $1 + $2 + $3
          | intOrDecimal "E" HYPHON number -> $1 + $2 + $3 + $4
          | intOrDecimal "E" PLUS number -> $1 + $2 + $3 + $4
          ;

      jsNumber
          : intOrDecimal -> $1
          | scientific -> $1
          ;

      escapedChar
          : ESCAPE_CHAR tokensNoEscapeOrQuote -> $1 + $2
          | FULLY_ESCAPED -> $1
          | ESCAPE_CHAR DOUBLE_QUOTE -> $1 + $2
          ;

      escapeStringContent
          : escapedChar -> $1
          | tokensNoEscapeOrQuote -> $1
          | escapeStringContent escapedChar -> $1 + $2
          | escapeStringContent tokensNoEscapeOrQuote -> $1 + $2
          ;

      escapeString
          : DOUBLE_QUOTE escapeStringContent DOUBLE_QUOTE -> $2
          | DOUBLE_QUOTE DOUBLE_QUOTE -> ""
          ;
      value
          : optionalWhiteSpace escapeString  {
              $$ = $2;
            }
          | optionalWhiteSpace object {
              $$ = $2;
            }
          | optionalWhiteSpace array  {
              $$ = $2;
            }
          | optionalWhiteSpace boolean  {
              $$ = $2 === "true";
            }
          | optionalWhiteSpace NULL  {
              $$ = null;
            }
          | optionalWhiteSpace jsNumber  {
              $$ = JSON.parse($2);
            }
          ;

      array
          : "[" optionalWhiteSpace "]" -> []
          | "[" elements "]" -> $2
          ;

      elements
          : value optionalWhiteSpace {
            $$ = [$1];
          }
          | elements "," value optionalWhiteSpace {
            $1.push($3);
            $$ = $1;
          }
          ;

      object
          : "{" optionalWhiteSpace "}" -> {}
          | "{" members "}" -> $2
          ;

      members
          : pair optionalWhiteSpace -> $1
          | members "," pair optionalWhiteSpace {
            var obj = $1;
            for(var i in $3){
              obj[i] = $3[i];
            }

            $$ = obj;
          }
          ;

      pair
          : optionalWhiteSpace key ":" value {
            var obj = {};
            obj[$2] = $4;
            $$ = obj;
          }
          ;

      key
          : escapeString optionalWhiteSpace -> $1
          ;

  jsonCollection
            : WHITE_SPACE json {
              $$ = [$2];
            }
            | jsonCollection WHITE_SPACE json {
              $1.push($3);
              $$ = $1;
            }
            ;

  optionalJsonCollection
            : /**/ -> []
            | jsonCollection -> $1
            ;
    `
}

module.exports = {
  coreTokens:coreTokens,
  grammars: grammars
}
