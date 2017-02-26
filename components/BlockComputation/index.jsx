import React from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import './style.css'
import _ from 'lodash';

const springSetting1 = {stiffness: 180, damping: 10};

const allColors = ["#91ee68", '#EF767A', '#456990', '#EEB868', '#49BEAA', "#47ff55gi", "#d247ff", ];
const width = 30;

function associativeGroups(count) {
  if (count == 1) {
    return [1]
  }
  let permutations = []
  for (let split = 1; split < count; split++) {
    let genLeft = associativeGroups(split)
    let genRight = associativeGroups(count - split)
    permutations = permutations.concat(cartesianProduct(genLeft, genRight))
  }
  return permutations
}

function bestowIds(array) {
  for (let i = 0; i < array.length; i++) {
    mapValuesToCount(array[i], {count: 0})
  }
  return array
}

function mapValuesToCount(value, counter) {
  for (let i = 0; i < value.length; i++) {
    if (Array.isArray(value[i])) {
      mapValuesToCount(value[i], counter)
    }
    else {
      counter.count++
      value[i] = counter.count
    }
  }
  return value
}

function cartesianProduct() {
  return _.reduce(arguments, function (a, b) {
    return _.flatten(_.map(a, function (x) {
      return _.map(b, function (y) {
        return x.concat([y]);
      });
    }), true);
  }, [[]]);
}

const BlockComputation = React.createClass({

  getInitialState() {
    // TODO this is on its way to being gross. Need to make it so that the only prop is computation.
    let numTerms = parseInt(this.props.numTerms);
    let computations = bestowIds(associativeGroups(numTerms));
    let structureKey = parseInt(this.props.structureKey);
    let computation
    let argSequence = range(1, numTerms + 1)
    if(this.props.initComputation === undefined) {
      computation =  _.cloneDeep(computations[structureKey])
    }  else {
      computation = this.props.initComputation
      argSequence = _.flattenDeep(computation)
      numTerms = argSequence.length
      computations = bestowIds(associativeGroups(numTerms));
      // mapValues to Count is needed here because it gives us the ability to let us compare by structure only
      structureKey = this.findKeyOfStructureForComputations(mapValuesToCount(_.cloneDeep(computation), {count: 0}), computations)
    }

    return {
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
      order: range(numTerms), // index: visual position. value: component key/id
      targets: [],
      invalidTargets: [],
      computation: computation,
      structureKey: structureKey,
      argSequence: argSequence, // 1,2,3,4 for for 4 terms
      numTerms:  numTerms,
      computations:  computations
    };
  },

  findTargets(targetKey, array) {
    let self = this;
    let targets = []
    array.forEach(function (element) {
      if (targetKey === element) {
        // we found the target key so add everything in this array as a target
        array.forEach(function (candidateKey) {
          if (element !== candidateKey) {
            if (typeof element === 'number') {
              targets.push(candidateKey);
            } else {
              targets.push(_.flattenDeep(candidateKey));
            }
          }
        })
      }
      else {
        if (Array.isArray(element)) {
          targets = targets.concat(self.findTargets(targetKey, element));
        }
      }
    })
    //being lazy. Something off in algo but this is quick fix
    return _.flattenDeep(targets);
  },

  mapValuesToArgSeq(value, counter) {
    for (let i = 0; i < value.length; i++) {
      if (Array.isArray(value[i])) {
        this.mapValuesToArgSeq(value[i], counter)
      }
      else {
        value[i] = this.state.argSequence[counter.count]
        counter.count++
      }
    }
    return value
  },

  handleMouseDown(key, [pressX, pressY], {pageX, pageY}) {
    let newTargets = this.findTargets(key, this.state.computation);
    this.setState({
      lastPress: key,
      isPressed: true,
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY],
      targets: newTargets,
      invalidTargets: _.difference(this.state.order, newTargets.concat([key])),
    });
  },

  handleMouseUp() {
    this.setState({isPressed: false, delta: [0, 0]});
  },

  findKeyOfStructure(structure) {
    return this.findKeyOfStructureForComputations(structure, this.state.computations);
  },

  findKeyOfStructureForComputations(structure, computations) {
    for (let i = 0; i < computations.length; i++) {
      if (_.isEqual(structure, computations[i])) {
        return i
      }
    }
    return "SHIT"
  },

  deepMap(obj, iterator, context) {
    let self = this;
    return _.transform(obj, function (result, val, key) {
      result[key] = _.isObject(val) /*&& !_.isDate(val)*/ ?
        self.deepMap(val, iterator, context) :
        iterator.call(context, val, key, obj);
    });
  },

  associativeControls(){
    let self = this;
    return <div className="controls">
      <div className="assoc-left" onClick={function () {
        if (self.state.structureKey < self.state.computations.length - 1) {
          let newVal = self.state.structureKey + 1
          let newComputation = self.mapValuesToArgSeq(_.cloneDeep(self.state.computations[newVal]), {count: 0})
          self.setState({
            computation: newComputation,
            structureKey: newVal
          })
        }
      }}>
        <i className="fa fa-arrow-left"/>
      </div>
      <div className="assoc-right" onClick={function () {
        if (self.state.structureKey > 0) {
          let newVal = self.state.structureKey - 1
          let newComputation = self.mapValuesToArgSeq(_.cloneDeep(self.state.computations[newVal]), {count: 0})
          self.setState({
            computation: newComputation,
            structureKey: newVal
          })
        }
      }}>
        <i className="fa fa-arrow-right"/>
      </div>
    </div>
  },

  computationHtml() {
    let self = this
    if (self.props.associative == true) {
      return (
        <div className="full-computation">
          {self.associativeControls(self.state.structureKey)}
          {self.arrayToDiv(self.state.computation, [])}
        </div>
      )
    }
    else {
      return (
        <div className="full-computation">
          {self.arrayToDiv(self.state.computation, [])}
        </div>
      )
    }
  },

  arrayToDiv(value, path){
    let self = this;
    let swapElement = "swap_button";
    if (Array.isArray(value)) {

      let interlacedItems = range(2 * value.length - 1).map((index) => {
        return index % 2 == 0 ? value[index / 2] : swapElement
      })
      return (
        <div className="center">
          <div className="eval-arg">
            {
              interlacedItems.map((element, elementIndex) => self.arrayToDiv(element, path.concat(Math.floor(elementIndex / 2))))
            }
          </div>
        </div>
      )
    } else if (value == swapElement && !self.props.commutes) {
      return null
    }
    else {
      if (value === swapElement) {
        return <div className="swap-button"
                    onClick={
                      function () {
                        //modify the computation by swapping the terms
                        //traverse the computation to find the swapped array
                        let traversal = self.state.computation
                        for (let i = 0; i < path.length - 1; i++) {
                          traversal = traversal[path[i]]
                        }
                        //swap first and last elements
                        let first = traversal.shift()
                        traversal.unshift(traversal.pop())
                        traversal.push(first)
                        // find the new arg sequence after the swap
                        let newArgSeq = _.flattenDeep(self.state.computation)
                        // find the new structureKey after the swap
                        let newStructureKey = self.findKeyOfStructure(mapValuesToCount(_.cloneDeep(self.state.computation), {count: 0}))

                        {/*self.walkIds(self.state.computation, {count: 0})*/
                        }
                        self.setState({
                          computation: self.state.computation,
                          argSequence: newArgSeq,
                          structureKey: newStructureKey
                        });
                      }
                    }
        >{'\u00A0'}<i className="fa fa-exchange fa-2" aria-hidden="true"></i>{'\u00A0'}</div>
      }
      const order = this.state.order;
      let boxShadow;
      let style;
      const visualPosition = order.indexOf(value) + 1;
      boxShadow = spring(((3 * width - 50) / 2) / 15, springSetting1);
      style = {
        scale: spring(1, springSetting1),
        boxShadow: spring(((3 * width - 50) / 2) / 15, springSetting1)
      }
      return (
        <Motion key={value} style={style}>
          {({boxShadow}) =>
            <div className="arg"
                 style={{
                   backgroundColor: allColors[visualPosition],
                   zIndex: value,
                   // boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`
                   boxShadow: `1px 0px 5px 2px rgba(0,0,0,0.5);`
                 }}
            >
            </div>
          }
        </Motion>
      );
    }
  },

  render()
  {
    return this.computationHtml(this.state.computation);
  }
  ,
});

BlockComputation.defaultProps = {
  structureKey: 0
};

export default BlockComputation;
