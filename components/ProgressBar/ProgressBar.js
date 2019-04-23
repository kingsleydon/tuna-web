import React, {Component} from 'react'
import cx from 'classnames'
import './ProgressBar.css'

export default class ProgressBar extends Component {
  render() {
    const {
      className,
      // color,
      duration,
      //  current
      ...restProps
    } = this.props

    return (
      <div className={cx('ProgressBar', className)} {...restProps}>
        <div className="ProgressBar-duration">{duration}</div>
      </div>
    )
  }
}
