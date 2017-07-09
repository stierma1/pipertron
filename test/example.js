
var Component = require("../lib/component");
var buildJison = require("../lib/build");
var jison = require("jison");

var just = new Component({type:"start",name:"JUST", token:"JUST", expression:"justExpression", args:["WHITE_SPACE", "json", "optionalWhiteSpace"], action: function(yy, token, white, jsonObj){
  return yy.LIBS.Rx.Observable.of(jsonObj);
}});

var plus = new Component({name:"ADD", token:"ADD", expression:"addExpression", args:["WHITE_SPACE", "json", "optionalWhiteSpace"], action: function(yy, obs, pipe, white, token, white, num){
  return obs.map((r) => {
    return r + num;
  })
}});

var label = new Component({name:"LABEL", token:"LABEL", expression:"labelExpression", args:["WHITE_SPACE", "json", "optionalWhiteSpace"], action: function(yy, obs, pipe, white, token, white, label){
  return obs.map((r) => {
    var obj = {};
    obj[label] = r;
    return obj;
  })
}});


var parser = jison.Parser(buildJison([just, plus, label]));
parser.yy = {COMPONENTS:{JUST:just, ADD:plus, LABEL:label}};
parser.yy.LIBS = {Rx: require("@reactivex/rxjs")};

parser.parse('JUST 5 | ADD 3 | LABEL "ham"').subscribe((v) => {
  console.log(v)
});
