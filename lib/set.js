
class Set {
  constructor(elements, equalityOperator){
    this.elements = (elements && elements.map((x) => {return x})) || [];
    this.equalityOperator = equalityOperator || function(a, b){
      return JSON.stringify(a) === JSON.stringify(b);
    }

  }

  contains(element){
    for(var ele of this.elements){
      if(this.equalityOperator(ele, element)){
        return true;
      }
    }
    return false;
  }

  remove(element){
    for(var i = this.elements.length - 1; i >= 0; i--){
      if(this.equalityOperator(this.elements[i], element)){
        this.elements.splice(i, 1);
      }
    }
    return this;
  }

  add(element){
    this.elements.push(element);
    return this;
  }

  addList(list){
    this.elements = this.elements.concat(list);
    return this;
  }

  addSet(set){
    this.elements = this.elements.concat(set.elements);
    return this;
  }

  getUnique(){
    var unique = new Set([], this.equalityOperator);
    for(var element of this.elements){
      if(!unique.contains(element)){
        unique.add(element);
      }
    }
    return unique.toList();
  }

  toList(){
    return this.elements.concat([]);
  }

  static intersect(setA, setB){
    var inter = new Set([], setA.equalityOperator);
    for(var element of setB.elements){
      if(setA.contains(element)){
        inter.add(element);
      }
    }

    return inter;
  }

  static union(setA, setB){
    var inter = new Set([], setA.equalityOperator);
    for(var element of setA.elements){
      inter.add(element);
    }
    for(var element of setB.elements){
      inter.add(element);
    }

    return new Set(inter.getUnique(), setA.equalityOperator);
  }

  static union(setA, setB){
    var inter = new Set([], setA.equalityOperator);
    for(var element of setA.elements){
      inter.add(element);
    }
    for(var element of setB.elements){
      inter.add(element);
    }

    return new Set(inter.getUnique(), setA.equalityOperator);
  }

  static minus(setA, setB){
    var inter = new Set([], setA.equalityOperator);
    for(var element of setA.elements){
      inter.add(element);
    }
    for(var element of setB.elements){
      inter.remove(element);
    }
    return inter;
  }
}

module.exports = Set;
