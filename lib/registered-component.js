var registry = require("./pipertron-component-registry");
var globalIdx = 0;

class RegisteredComponent{
  constructor(name){
      this._classInstanceId = globalIdx;
      globalIdx++;
      this._className = name || new.target.name;
      registry.add("#Components:" + this._className + ":" + this._classInstanceId, this);
    }

    _free(){
      registry.remove("#Components:" + this._className + ":" + this._classInstanceId);
    }

    componentSearch(pattern){
      return registry.getPattern(pattern).map((d) => {return d.document});
    }
    static componentSearch(pattern){
      return registry.getPattern(pattern).map((d) => {return d.document});
    }
}

module.exports = RegisteredComponent;
