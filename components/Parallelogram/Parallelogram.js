import React, {Component} from 'react'
import cx from 'classnames'
import './Parallelogram.css'

export default class Parallelogram extends Component {
  render() {
    const {
      className,
      children,
      color,
      deg = 45,
      backgroundStyle,
      ...restProps
    } = this.props

    let firstColor
    let secondColor

    if (Array.isArray(color)) {
      ;[firstColor, secondColor] = color
    } else if (typeof color === 'string') {
      firstColor = color
    }

    return (
      <div className={cx('Parallelogram', className)} {...restProps}>
        <div
          className="Parallelogram-background"
          style={{
            background: secondColor
              ? `linear-gradient(${deg}deg, ${firstColor}, ${secondColor})`
              : firstColor,
            ...backgroundStyle,
          }}
        />
        {children && <div className="Parallelogram-content">{children}</div>}
      </div>
    )
  }
}
