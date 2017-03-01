import React from 'react';
import './style.css'
import _ from 'lodash';
const BlockComputation = require('../BlockComputation')


const BlockComputationGroup = React.createClass({
  render()
  {
    const computations = this.props.computations
    return <div className="bc-group-container">
      {computations.map(computation =>
        <BlockComputation associative={false} commutes={false} initComputation={computation}/>
      )}
    </div>
  }
});

export default BlockComputationGroup;
