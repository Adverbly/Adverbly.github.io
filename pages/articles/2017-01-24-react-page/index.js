const React = require('react')
const DatePicker = require('./single-date-picker')
const DraggableBalls = require('../../../components/DraggableBalls')
const BlockComputation = require('../../../components/BlockComputation')
require('react-dates/css/variables.scss')
require('react-dates/css/styles.scss')

class Post extends React.Component {
  render() {
    return (
      <div>
        <a className="gohome" href="/"> All Articles</a>
        <div className="blog-single">
          <div className="text">
            <h1>{this.props.route.page.data.title}</h1>
            <div id="content">
              <p>Have you ever had one of those moments where you find yourself googling the definition of something for the hundredth time because it just won't seem to stick in your head? To me, this is a red flag that I don't yet <a href="https://www.wired.com/1996/02/jobs-2/"><b>grok</b></a> a concept. My most recent example of this was while learning about <a href="https://wiki.haskell.org/Monad_laws"><b>Monads in Category Theory</b></a>. Associativity and Commutativity seem to come up quite a bit in advanced math, but for the life of me I can't ever seem to remember which one is which. I always remember the pair as being <em>those properties of a function where you can rearrange things in an equation and still get the same answer.</em> Sounds simple enough... And it is! In fact, they regularly teach this stuff to young children. Commutativity is the property that a function like addition can have where: <p>1+2=2+1</p> Associativity is the property where, once again for addition: <p>1+(2+3)=(1+2)+3</p> I have probably had some general awareness that these properties exist for <em>almost 20 years</em>. And yet, I couldn't for the life of me remember which one was which. Both apply to addition and multiplication, both are equality properties, both properties have to do with re-arranging things. I could memorize the definitions for a test, but <em>I didn't yet fully understand the fundamental differences between what it meant for a function to be associative and for a function to be commutative</em>. What I really wanted was a visual model for an associative or commutative function that I could play with to get a better idea of what the differences were. About the same time as this was going on, I was trying to learn <a href="https://facebook.github.io/react/"><b>React</b></a>. The one-way propagation of data seemed perfectly fitted to mapping from a computation to a visual model. So I had a go at it. Here is a simple computation for a Commutative function with 2 arguments, similar to 1+2:  </p>
              <BlockComputation associative={false} commutes={true} numTerms="2"/>
              <p>Notice how for a commutative function, we can swap the green and blue boxes. Cool. That gives us pretty much every possible configuration that we could ever want. Here is a more complex commutative function that might represent a larger computation like "(((1~2)~3)~4)". I'm using "~" here to denote our binary function operating on it's two arguments. </p>
              <BlockComputation associative={false} commutes={true} numTerms="4" structureKey="2"/>
              <p>Hold on though! In the 2 argument case, we could make every possible configuration, but here we can't! </p>
              <BlockComputation associative={false} commutes={true} numTerms="4" structureKey="2"/>
              <p>Pretty neat. Now what do we notice between the first and the second examples here? </p>
              <BlockComputation associative={false} commutes={true} numTerms="4"/>
              <BlockComputation associative={false} commutes={false} numTerms="6"/>
            </div>
          </div>
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
