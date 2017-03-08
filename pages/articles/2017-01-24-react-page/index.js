const React = require('react')
const DraggableBalls = require('../../../components/DraggableBalls')
const BlockComputation = require('../../../components/BlockComputation')
const BlockComputationGroup = require('../../../components/BlockComputationGroup')
const BlockComputationSingle = require('../../../components/BlockComputationSingle')
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
                {/*<BlockComputationSingle associative={false} commutes={false} initComputation={[1,[2,3]]} layout="grid"/>*/}
                {/*<BlockComputationSingle associative={false} commutes={false} initComputation={[3,[1,2]]}/>*/}
                {/*<BlockComputationSingle associative={false} commutes={false} initComputation={[[1,3],2]}/>*/}
                {/*<BlockComputationSingle associative={true} commutes={true} numTerms="4" structureKey="2"/>*/}
                <p>Have you ever had one of those moments where you find yourself googling the definition of something for
                  the hundredth time because it just won't seem to stick in your head? To me, this is a red flag that I
                  don't yet <a href="https://www.wired.com/1996/02/jobs-2/"><b>grok</b></a> a concept. My most recent
                  example of this was while learning about <a href="https://wiki.haskell.org/Monad_laws"><b>Monads in
                    Category Theory</b></a>. Associativity and Commutativity seem to come up quite a bit in higher level math,
                  but for the life of me I can't ever seem to remember which one is which. I always remember the pair as
                  being <em>those properties of a function where you can rearrange things in an equation and still get the
                    same answer.</em> Sounds simple enough... And it is! In fact, they regularly teach this stuff to young
                  children. Commutativity is the property that a function like addition can have where: <p>1+2=2+1</p>
                  Associativity is the property where, once again for addition: <p>1+(2+3)=(1+2)+3</p> I have probably had
                  some general awareness that these properties exist for <em>almost 20 years</em>. And yet, I couldn't for
                  the life of me remember which one was which. Both apply to addition and multiplication, both are
                  equality properties, both properties have to do with re-arranging things. I could memorize the
                  definitions for a test, but <em>I didn't yet fully understand the fundamental differences between what
                    it meant for a function to be associative and for a function to be commutative</em>. What I really
                  wanted was a visual model for an associative or commutative function that I could play with to get a
                  better idea of what the differences were. About the same time as this was going on, I was trying to
                  learn <a href="https://facebook.github.io/react/"><b>React</b></a>. The one-way propagation of data
                  seemed perfectly fitted to mapping from a computation to a visual model. So I had a go at it. Here is a
                  simple computation for a Commutative function with 2 arguments, similar to 1+2:
                </p>
                <BlockComputationSingle associative={false} commutes={true} numTerms="2"/>
                <p>Notice how for a commutative function, we can swap the green and blue boxes. Cool. That gives us both of the possible 2-argument computations. Great. Here is a more complex
                  commutative function
                  that might represent a larger computation like "((1~2)~(3~4))". I'm using "~" here to denote our binary
                  function operating on it's two arguments. </p>
                <BlockComputationSingle associative={false} commutes={true} numTerms="4" structureKey="2"/>
                <p>Sweet! Have a go at swapping into the following confuguration: </p>
                <BlockComputationSingle associative={false} commutes={false} initComputation={[[4, 3], [1, 2]]}/>
                <p>Okay, now try this:</p>
                <BlockComputationSingle associative={false} commutes={false} initComputation={[[4, 1], [3, 2]]}/>
                <p>Huh... It seems like in the 2 term case we could make every possible configuration(green on right and
                  green on left), but here we can't! The yellow and the green blocks can't ever be in the same group based
                  on where we started from. Furthermore, those blocks that are in a group already cannot leave that group. This prevents us from being able to create any arbitrary sequence of arguments left to right as you can never have elements from one group placed at both ends of the sequence as it would mean breaking up the group.
                  Even less concerning is the fact that we can't even swap our way to a nesting structure like
                  the one below.</p>
                <BlockComputationSingle associative={false} commutes={true} numTerms="4" structureKey="0"/>
                <p>It seems that commutativity provides us with some tools for rearranging a computation, but it doesnt
                  quite provide enough for us to be able to go to any arbitrary computation. Okay so let's sidebar
                  commutativity and try out associativity. Maybe there we'll have some better luck. Behold! Our first
                  associative computation:</p>
                <BlockComputationSingle associative={true} commutes={false} numTerms="3"/>
                <p>It looks like we lost the ability to swap the arguments from within a block. Instead, we now have
                  another operation that lets us change how the arguments are grouped within the blocks that make up the
                  computation. As you can tell here, it's pretty obvious why people needed to show three terms in the
                  examples of associativity(1+(2+3)=(1+2)+3), where only 2 for commutativity(1+2=2+1). There is no
                  re-arranging that can be done in the 2-term case. Lets play around with a more complex example:</p>
                <BlockComputationSingle associative={true} commutes={false} numTerms="5"/>
                <p>see if you can make this: </p>
                <BlockComputationSingle associative={false} commutes={false} numTerms="5" structureKey="6"/>
                <p>Pretty neat. It looks like we have a complete control over the grouping of the terms. In fact, we can
                  get any grouping pattern that we want! Unfortunately despite having complete control over the groupings,
                  it is pretty clear that once again we won't be able to cover all possible computations. </p>
                <BlockComputationSingle associative={true} commutes={false} numTerms="3" initComputation={[1, [2, 3]]}/>
                <p>For example,
                  try moving our earlier 3 term example to look like this:</p>
                <BlockComputationSingle associative={false} commutes={false} numTerms="3" initComputation={[1, [3, 2]]}/>
                <p>Moving the green block over to the left hand side here is never going to happen. Just like we got stuck
                  with the commutative property, here we are stuck with not being able to work our way around to different
                  configurations. Okay
                  so what if we combined the properties? </p>
                <BlockComputationSingle associative={true} commutes={true} numTerms="4" structureKey="2"/>
                <p>Let's go back to the commutative structure we saw previously and
                  see if we can recreate the shape below now. Give it a shot.</p>
                <BlockComputationSingle associative={false} commutes={false} initComputation={[[4, 1], [3, 2]]}/>
                <p>If you kept trying you should have been able to figure out a way to do it by combining both actions. So
                  what is going on here? There seem to be different subsets of all possible computations that each one of
                  these actions gives us access to. Only by combining both can we actually able to access all of these
                  possibilites. It is clear that there is more structure to this that we can uncover. Let's simplify again
                  and look at the 3 term case. Here is a complete list of all possible configurations:</p>
                <BlockComputationGroup
                    computations={[
                      [1, [2, 3]],
                      [[1, 2], 3],
                      [1, [3, 2]],
                      [[1, 3], 2],
                      [2, [1, 3]],
                      [[2, 1], 3],
                      [2, [3, 1]],
                      [[2, 3], 1],
                      [3, [1, 2]],
                      [[3, 1], 2],
                      [3, [2, 1]],
                      [[3, 2], 1],
                    ]}/>
                <p>12 configurations. Why 12? The argument order can be arranged in n!(6 for n=3) different ways, and each
                  one of those ways can be arranged according each one of the unique structures or groupings possible for
                  that number of arguments. In our case, we have two from the group to the left and the group to the
                  right. In the general case, we get the nth <a href="https://en.wikipedia.org/wiki/Catalan_number"><b>Catalan
                    Number</b></a>. For anyone not already familiar with the Catalan Numbers, <i>which certainly would have included myself prior to this excursion,</i> these numbers show up commonly
                  in combinatorics, but one application that caught my eye was for full binary trees. In fact, these abstracted computations that we have been drawing up to now have actually just been
                  full binary trees, where the leaf nodes are arguments, and the parent nodes are the result of their children's evaluation.</p>
                <p>The leaf nodes represent the inputs, and the structure of the tree represents exactly how those arguments are consumed. Neat! Okay so let's bring this back to associativity and
                  commutativity now. How does adding these properties change which data structures can be used to represent the computation?</p>
                <p>If we add both properties, we are guaranteed equivalency to any other computation with the same count of each argument. For any associative and commutative function,</p>

                <BlockComputationSingle associative={false} commutes={false} initComputation={[[4, 1], [3, 2], [[5, 2], [[1, 2], 3]]]}/>
                <p>is the same as</p>
                <BlockComputationSingle associative={false} commutes={false} initComputation={[[[[[[[[5, 2], 2], 1], 1], 1], 3], 3], 4]}/>
                <p>To verify this, all you have to do is count up each color across both examples. This means that the structure itself is completely meaningless. All we actually need to perform the
                  evaluation is a count of the number of times that each argument has been included in the evaluation. A hash map where the key is the argument and the value is the number of times
                  that argument is used, would be able to suit our needs for representing our computation.</p>
                <p>How about if we just have the associative property? If we only have the associative property, we are guaranteed equivalency with any other computation with the same sequence of
                  arguments. In other words,</p>
                <BlockComputationSingle associative={true} commutes={false} initComputation={[[[[[[[[4, 1], 3], 2], 5], 2], 1], 2], 3]}/>
                <p>is the same as</p>
                <BlockComputationSingle associative={false} commutes={false} initComputation={[[4, 1], [3, 2], [[5, 2], [[1, 2], 3]]]}/>
                <p> The associative property lets us freely change between groupings of the arguments making up the computation, but it provides no way of changing the sequence of the arguments in the
                  computation. So any data structure that we choose must maintain the sequence of the arguments. A linked list or an array would suffice. </p>
                <p>Neat! Okay how about the commutative property?
                  The commutative property gives us a swapping function that lets us rearrange the sequence of a arguments within a grouping, but gives us less control over the groupings when we do.
                  In other words, for a
                  commutative function,</p>
                <BlockComputationSingle associative={false} commutes={false} initComputation={[4, 5, 6, 7, 8, 9, 10, 11, 12]}/>
                <p>is the same as</p>
                <BlockComputationSingle associative={false} commutes={false} initComputation={[9, 10, 11, 4, 5, 6, 7, 8, 12]}/>
                <p>This makes it a bit harder to pin down. Within each group it is possible to represent the arguments as a count of the arguments within the group, similar to what we did with both properties present, but we fall short this time of being able to reuse one argument count across all groups. As a result, we will require nested hashmaps to be able to represent computations which only possess the commutative property. To summarize, </p>
                <p>associative and commutative - Hashmap</p>
                <p>associative and not commutative - Linked List</p>
                <p>not associative and commutative - Nested Hashmap</p>
                <p>not associative and not commutative - Full Binary Tree</p>
                <p>Great! I hoped this visual dive into the exact definition and consequences of these properties has helped with your understanding. </p>
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
