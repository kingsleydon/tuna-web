import React, {Component} from 'react'
import cx from 'classnames'
import {formatTime} from '../../utils/formatTime'
import Parallelogram from '../../components/Parallelogram'
import './ProgressBar.css'

export default class ProgressBar extends Component {
  render() {
    const {
      className,
      color,
      duration = 0,
      position = 0,
      ...restProps
    } = this.props

    return (
      <div className={cx('ProgressBar', className)} {...restProps}>
        <Parallelogram
          className="ProgressBar-bar"
          color={color}
          backgroundStyle={{
            width: position ? `${(position / duration) * 100}%` : '1px',
          }}
        />
        <div className="ProgressBar-duration">
          {formatTime(parseInt(duration - position, 10))}
        </div>
      </div>
    )
  }
}
