import React from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import './style.css'
import _ from 'lodash';

const springSetting1 = {stiffness: 180, damping: 10};
const springSetting2 = {stiffness: 120, damping: 17};
function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

let numTerms = 6
const allColors = ['#EF767A', '#456990', '#EEB868', '#49BEAA'];
const width = 30;
let computations = bestowIds(associativeGroups(numTerms))

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
    return {
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
      order: range(numTerms), // index: visual position. value: component key/id
      targets: [],
      invalidTargets: [],
      computation: _.cloneDeep(computations[0]),
      structureKey: 0,
      argSequence: range(1, numTerms + 1) // 1,2,3,4 for for 4 terms
    };
  },

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  },

  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  },

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  },

  handleMouseMove({pageX, pageY}) {
    const {order, lastPress, isPressed, delta: [dx, dy]} = this.state;
    if (isPressed) {
      const mouse = [pageX - dx, pageY - dy];
      const index = clamp(Math.floor(mouse[0] / width), 0, 3);
      const newOrder = reinsert(order, order.indexOf(lastPress), index);
      this.setState({mouse: mouse, order: newOrder});
    }
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

  borderStyle(key) {
    if (this.state.isPressed) {
      if (this.state.targets.includes(key)) {
        return "5px solid green";
      }
      if (this.state.invalidTargets.includes(key)) {
        return "5px solid red";
      }
    }
    return "";
  },

  findKeyOfStructure(structure) {
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
    return <div>
      <div onClick={function () {
        if (self.state.structureKey < computations.length - 1) {
          let newVal = self.state.structureKey + 1
          let newComputation = self.mapValuesToArgSeq(_.cloneDeep(computations[newVal]), {count: 0})
          self.setState({
            computation: newComputation,
            structureKey: newVal
          })
        }
      }}>
        left
      </div>
      <div onClick={function () {
        if (self.state.structureKey > 0) {
          let newVal = self.state.structureKey - 1
          let newComputation = self.mapValuesToArgSeq(_.cloneDeep(computations[newVal]), {count: 0})
          self.setState({
            computation: newComputation,
            structureKey: newVal
          })
        }
      }}>
        right
      </div>
    </div>
  },

  computationHtml() {
    let self = this
    if (self.props.associative == true) {
      return (
        <div>
          {self.associativeControls(self.state.structureKey)}
          {self.arrayToDiv(self.state.computation, [])}
          {/*<p>cKey - {self.state.structureKey}</p>*/}
          {/*<p>c - {self.state.computation}</p>*/}
          {/*<p>order - {self.state.order}</p>*/}
          {/*<p>argSeq - {self.state.argSequence}</p>*/}
        </div>
      )
    }
    else {
      return (
        <div>
          {self.arrayToDiv(self.state.computation, [])}
          {/*<p>cKey - {self.state.structureKey}</p>*/}
          {/*<p>c - {self.state.computation}</p>*/}
          {/*<p>order - {self.state.order}</p>*/}
          {/*<p>argSeq - {self.state.argSequence}</p>*/}
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
        <div className="eval-arg">
          {
            interlacedItems.map((element, elementIndex) => self.arrayToDiv(element, path.concat(Math.floor(elementIndex / 2))))
          }
        </div>
      )
    } else if (value == swapElement && self.props.commutes) {
      return null
    }
    else {
      if (value === swapElement) {
        return <div className="swapButton"
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
                        self.setState({computation: self.state.computation, argSequence: newArgSeq, structureKey: newStructureKey});
                      }
                    }
        >{'\u003C - \u003E'}</div>
      }
      const {order, lastPress, isPressed, mouse} = this.state;
      let x;
      let y;
      let translateX;
      let translateY;
      let scale;
      let boxShadow;
      let style;
      // const visualPosition = order.indexOf(value);
      const visualPosition = order.indexOf(value);
      if (value === lastPress && isPressed) {
        [x, y] = mouse;
        translateX = x;
        translateY = y;
        scale = spring(1.2, springSetting1);
        boxShadow = spring((x - (3 * width - 50) / 2) / 15, springSetting1);
        style = {
          translateX: x,
          translateY: y,
          scale: spring(1.2, springSetting1),
          boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
        }
      } else {
        // [x, y] = [valueIndex*width,0];
        [x, y] = [0, 0];
        // [x, y] = layout[visualPosition];
        // translateX = spring(x, springSetting2);
        // translateY = spring(y, springSetting2);
        scale = spring(1, springSetting1);
        boxShadow = spring((x - (3 * width - 50) / 2) / 15, springSetting1);
        style = {
          // translateX: spring(x, springSetting2),
          // translateY: spring(y, springSetting2),
          scale: spring(1, springSetting1),
          boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
        }
      }
      return (
        <Motion key={value} style={style}>
          {({translateX, translateY, scale, boxShadow}) =>
            <div className="arg"
                 onMouseDown={self.handleMouseDown.bind(null, value, [x, y])}
                 onTouchStart={self.handleTouchStart.bind(null, value, [x, y])}
                 style={{
                   backgroundColor: allColors[visualPosition],
                   WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                   transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                   zIndex: value,
                   boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                   border: `${self.borderStyle(value)}`,
                 }}
            >
              {value}
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

export default BlockComputation;
