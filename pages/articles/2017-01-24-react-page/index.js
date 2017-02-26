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
              <BlockComputation associative={false} commutes={false} initComputation={[1,[2,3]]}/>
              <BlockComputation associative={false} commutes={false} initComputation={[3,[1,2]]}/>
              <BlockComputation associative={false} commutes={false} initComputation={[[1,3],2]}/>
              <BlockComputation associative={true} commutes={true} numTerms="4" structureKey="2"/>
              <p>Have you ever had one of those moments where you find yourself googling the definition of something for the hundredth time because it just won't seem to stick in your head? To me, this is a red flag that I don't yet <a href="https://www.wired.com/1996/02/jobs-2/"><b>grok</b></a> a concept. My most recent example of this was while learning about <a href="https://wiki.haskell.org/Monad_laws"><b>Monads in Category Theory</b></a>. Associativity and Commutativity seem to come up quite a bit in advanced math, but for the life of me I can't ever seem to remember which one is which. I always remember the pair as being <em>those properties of a function where you can rearrange things in an equation and still get the same answer.</em> Sounds simple enough... And it is! In fact, they regularly teach this stuff to young children. Commutativity is the property that a function like addition can have where: <p>1+2=2+1</p> Associativity is the property where, once again for addition: <p>1+(2+3)=(1+2)+3</p> I have probably had some general awareness that these properties exist for <em>almost 20 years</em>. And yet, I couldn't for the life of me remember which one was which. Both apply to addition and multiplication, both are equality properties, both properties have to do with re-arranging things. I could memorize the definitions for a test, but <em>I didn't yet fully understand the fundamental differences between what it meant for a function to be associative and for a function to be commutative</em>. What I really wanted was a visual model for an associative or commutative function that I could play with to get a better idea of what the differences were. About the same time as this was going on, I was trying to learn <a href="https://facebook.github.io/react/"><b>React</b></a>. The one-way propagation of data seemed perfectly fitted to mapping from a computation to a visual model. So I had a go at it. Here is a simple computation for a Commutative function with 2 arguments, similar to 1+2:  </p>
              <BlockComputation associative={false} commutes={true} numTerms="2"/>
              <p>Notice how for a commutative function, we can swap the green and blue boxes. Cool. That gives us pretty much every possible configuration that we could ever want. Here is a more complex commutative function that might represent a larger computation like "((1~2)~(3~4))". I'm using "~" here to denote our binary function operating on it's two arguments. </p>
              <BlockComputation associative={false} commutes={true} numTerms="4" structureKey="2"/>
              <p>Hold on though! In the 2 argument case, we could make every possible configuration(green on right and green on left), but here we can't! The yellow and the green blocks can't ever be in the same operation. In fact, even less concerning is the fact that we can't even swap our way to a nesting structure like the one below.</p>
              <BlockComputation associative={false} commutes={true} numTerms="4" structureKey="0"/>
              <p>It seems that commutativity provides us with some tools for rearranging a computation, but it doesnt quite provide enough for us to be about to go to any arbitrary computation. Okay so let's sidebar commutativity and try out associativity. Maybe there we'll have some better luck. Behold! Our first associative computation:</p>
              <BlockComputation associative={true} commutes={false} numTerms="3"/>
              <p>It looks like we lost the ability to swap the arguments from within a block. Instead, we now have another operation that lets us change how the arguments are grouped within the blocks that make up the computation. As you can tell here, it's pretty obvious why people needed to show three terms in the examples of associativity(1+(2+3)=(1+2)+3), where only 2 for commutativity(1+2=2+1). There is no re-arranging that can be done in the 2-term case. Lets play around with a more complex example:</p>
                <BlockComputation associative={true} commutes={true} numTerms="5"/>
              <p>Pretty neat. It looks like we have a complete control over the grouping of the terms. In fact, we can get any grouping pattern that we want! Unfortunately despite having complete control over the groupings, it is pretty clear that once again we won't be able to cover all possible computations. For example, consider the 3 case again:</p>
                <BlockComputation associative={true} commutes={false} numTerms="3"/>
              <p>Moving the green block over to the left hand side here is never going to happen. Just like we got stuck with the commutative property not being able to move the green block over to the grouping with the yellow block, here we are stuck with not being able to put the blue block next to the green block. Okay so what if we combined the properties? Let's go back to the commutative structure we saw previously and see if we can get the yellow and green blocks to be in the same grouping. Give it a shot.</p>
              <BlockComputation associative={true} commutes={true} numTerms="4" structureKey="2"/>
              <p>If you kept trying you should have been able to figure out a way to do it by combining both actions. So what is going on here? There seem to be different subsets of all possible computations that each one of these actions gives us access to. Only by combining both can we actually able to access all of these possibilites. It is clear that there is more structure to this that we can uncover. Let's simplify again and look at the 3 term case.</p>
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
