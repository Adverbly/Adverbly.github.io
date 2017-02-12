const React = require('react')
const DatePicker = require('./single-date-picker')
const DraggableBalls = require('../../../components/DraggableBalls')
const BlockComputation = require('../../../components/BlockComputation')
require('react-dates/css/variables.scss')
require('react-dates/css/styles.scss')

class Post extends React.Component {
  render () {
    return (
      <div>
        <h1>{this.props.route.page.data.title}</h1>
        <p>Greetings from React</p>
        <p>Visualization to come...</p>
        <div id="content">
      <BlockComputation associative={true} commutes={true}/>
      <BlockComputation associative={true} commutes={false}/>
      <BlockComputation associative={false} commutes={true}/>
      <BlockComputation associative={false} commutes={false}/>
        </div>
      </div>
    )
  }
}

export default Post

exports.data = {
  layout: "post",
  category: "Figuring Out React",
  description: "Hopefully react motion will follow soon!",
  title: "Commutativity and Associativity Visualized",
  date: "2017-01-24T12:40:32.169Z",
  path: "/test-react/"
}
