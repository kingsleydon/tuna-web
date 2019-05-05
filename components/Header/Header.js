import React, {Component} from 'react'
import cx from 'classnames'
import Parallelogram from '../../components/Parallelogram'
import './Header.css'

export default class Header extends Component {
  render() {
    const {className, style, children, color, ...restProps} = this.props
    return (
      <div
        className={cx('Header', className)}
        {...style && {style}}
        {...restProps}
      >
        <Parallelogram className="Header-name" color={color}>
          {children}
        </Parallelogram>
      </div>
    )
  }
}
