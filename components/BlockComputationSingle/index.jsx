import React from 'react';
import './style.css'
import _ from 'lodash';
const BlockComputation = require('../BlockComputation')


const BlockComputationSingle = React.createClass({
  render()
  {
    return <div className="bc-group-container">
        <BlockComputation associative={this.props.associative} commutes={this.props.commutes} initComputation={this.props.initComputation} numTerms={this.props.numTerms} structureKey={this.props.structureKey}/>
    </div>
  }
});

export default BlockComputationSingle;
