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

const allColors = ['#EF767A', '#456990', '#EEB868', '#49BEAA'];
const [count, width, height, numArgs] = [4, 70, 0, 4];
// indexed by visual position
const layout = range(count).map(n => {
  return [width * n, height];
});

const BlockComputation = React.createClass({
  getInitialState() {
    return {
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
      order: range(count), // index: visual position. value: component key/id
      targets: [],
      invalidTargets: [],
      // computation: {
      //   left: {
      //     left: {
      //       left: 1,
      //       right: 2
      //     },
      //     right: 3
      //   },
      //   right: 4
      // }
      computation: [[[0, 1], 2], 3]
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

  arrayToDiv(value, valueIndex){
    let self = this;
    if (Array.isArray(value)) {
      return (
        <div className="eval-arg">
          {value.map((element, elementIndex) => self.arrayToDiv(element, elementIndex))}
        </div>
      )
    } else {
      const {order, lastPress, isPressed, mouse} = this.state;
      let x;
      let y;
      let translateX;
      let translateY;
      let scale;
      let boxShadow;
      let style;
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
        [x, y] = [valueIndex*width,0];
        // [x, y] = layout[visualPosition];
        translateX = spring(x, springSetting2);
        translateY = spring(y, springSetting2);
        scale = spring(1, springSetting1);
        boxShadow = spring((x - (3 * width - 50) / 2) / 15, springSetting1);
        style = {
          translateX: spring(x, springSetting2),
          translateY: spring(y, springSetting2),
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
                   backgroundColor: allColors[value],
                   WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                   transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                   zIndex: value === lastPress ? 99 : visualPosition,
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
    return this.arrayToDiv(this.state.computation);

    // const {order, lastPress, isPressed, mouse, computation} = this.state;
    // return (
    //   <div className="eval-container">
    //
    //
    //     <div className="eval-arg">
    //       {order.map((_, key) => {
    //         let style;
    //         let x;
    //         let y;
    //         const visualPosition = order.indexOf(key);
    //         if (key === lastPress && isPressed) {
    //           [x, y] = mouse;
    //           style = {
    //             translateX: x,
    //             translateY: y,
    //             scale: spring(1.2, springSetting1),
    //             boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
    //
    //           };
    //         } else {
    //           [x, y] = layout[visualPosition];
    //           style = {
    //             translateX: spring(x, springSetting2),
    //             translateY: spring(y, springSetting2),
    //             scale: spring(1, springSetting1),
    //             boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
    //           };
    //         }
    //         return (
    //           <Motion key={key} style={style}>
    //             {({translateX, translateY, scale, boxShadow}) =>
    //               <div
    //
    //                 onMouseDown={this.handleMouseDown.bind(null, key, [x, y])}
    //                 onTouchStart={this.handleTouchStart.bind(null, key, [x, y])}
    //                 className="arg"
    //                 style={{
    //                   backgroundColor: allColors[key],
    //                   WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
    //                   transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
    //                   zIndex: key === lastPress ? 99 : visualPosition,
    //                   boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
    //                   border: `${this.borderStyle(key)}`,
    //                 }}
    //               />
    //             }
    //           </Motion>
    //         );
    //       })}
    //     </div>
    //   </div>
    // );
  }
  ,
});

export default BlockComputation;