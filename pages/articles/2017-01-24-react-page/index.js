const React = require('react')
const DatePicker = require('./single-date-picker')
require('react-dates/css/variables.scss')
require('react-dates/css/styles.scss')

class Post extends React.Component {
  render () {
    return (
      <div>
        <h1>{this.props.route.page.data.title}</h1>
        <p>Greetings from React</p>
        <p>Visualization to come...</p>
        <p>If you're picky, here have a date picker</p>
        <DatePicker />
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