
var Component = require("../lib/component");
var buildJison = require("../lib/build");
var jison = require("jison");

var just = new Component({type:"start",name:"JUST", token:"JUST", expression:"justExpression", args:["WHITE_SPACE", "json", "optionalWhiteSpace"], action: function(yy, token, white, jsonObj){
  return yy.LIBS.Rx.Observable.of(jsonObj);
}});


var from = new Component({type:"start",name:"FROM", token:"FROM", args:["optionalJsonCollectionWithWhiteSpace"], action: function(yy, token, white, jsonObj){
  return yy.LIBS.Rx.Observable.from(jsonObj);
}});

var plus = new Component({name:"ADD", token:"ADD", args:["WHITE_SPACE", "json", "optionalWhiteSpace"], action: function(yy, obs, pipe, white, token, white, num){
  return obs.map((r) => {
    return r + num;
  })
}});

var merge = new Component({name:"MERGE", token:"MERGE", args:["WHITE_SPACE", "subExpression", "optionalWhiteSpace"], action: function(yy, obs, pipe, white, token, white, val){
  return yy.LIBS.Rx.Observable.merge(obs, val);
}});

var label = new Component({name:"LABEL", token:"LABEL", expression:"labelExpression", args:["WHITE_SPACE", "json", "optionalWhiteSpace"], action: function(yy, obs, pipe, white, token, white, label){
  return obs.map((r) => {
    var obj = {};
    obj[label] = r;
    return obj;
  })
}});


var parser = jison.Generator(buildJison([just, plus, label, from, merge]), {type:"lalr"}).createParser();
parser.yy = {COMPONENTS:{JUST:just, ADD:plus, LABEL:label, MERGE:merge}};
parser.yy.LIBS = {Rx: require("@reactivex/rxjs")};

parser.parse('JUST 5 | ADD 3 | MERGE ( JUST 5 | MERGE ( JUST 5 ) )| LABEL "ham" ').subscribe((v) => {
  console.log(v)
});
