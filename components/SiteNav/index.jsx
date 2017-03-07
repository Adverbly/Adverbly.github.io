import React from 'react'
import { RouteHandler, Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import './style.css'

class SiteNav extends React.Component {
    render() {
        const {location} = this.props
        return (
            <nav className='blog-nav'>
              <ul>
                <li>
                  <Link to={ prefixLink('/')} activeClassName="current" onlyActiveOnIndex> Articles
                  </Link>
                </li>
                <li>
                  <a href="http://www.georgepatrickmontgomery.com/resume.html">About me</a>
                  <Link to={ prefixLink('/resume.html/')} activeClassName="current" onlyActiveOnIndex> About me
                  </Link>
                </li>
              </ul>
            </nav>
            );
    }
}

SiteNav.propTypes = {
    location: React.PropTypes.object,
}

export default SiteNav
