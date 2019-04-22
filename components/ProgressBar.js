import React, {Component} from 'react'
import cx from 'classnames'

export default class ProgressBar extends Component {
  render() {
    const {
      className,
      // color,
      time,
      //  current
    } = this.props

    return (
      <div className={cx('ProgressBar', className)}>
        <div className="ProgressBar-time">{time}</div>
      </div>
    )
  }
}
