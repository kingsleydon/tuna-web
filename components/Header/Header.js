import React, {Component} from 'react'
import cx from 'classnames'
import './Header.css'

export default class Header extends Component {
  render() {
    const {className, style, ...restProps} = this.props
    return (
      <div
        className={cx('Header', className)}
        {...style && {style}}
        {...restProps}
      >
        {}
      </div>
    )
  }
}
