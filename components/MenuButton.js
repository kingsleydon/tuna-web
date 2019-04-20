import React, {Component} from 'react'
import cx from 'classnames'
// import Link from 'next/link'
import './MenuButton.css'

export default class MenuButton extends Component {
  render() {
    const {className, color, extra, children, ...restProps} = this.props
    return (
      <div
        className={cx('MenuButton', `MenuButton-${color}`, className)}
        {...restProps}
      >
        {children}
        {typeof extra === 'string' && (
          <div className="MenuButton-extra">{extra.toUpperCase()}</div>
        )}
      </div>
    )
  }
}
