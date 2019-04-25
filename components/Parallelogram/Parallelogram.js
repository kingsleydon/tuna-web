import React, {Component} from 'react'
import cx from 'classnames'
// import Color from 'color'
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

    // if (firstColor && !secondColor) {
    //   secondColor = Color(firstColor)
    //     .saturate(0.2)
    //     .lighten(0.2)
    //     .rotate(20)
    //     .hex()

    //   firstColor = Color(firstColor)
    //     .desaturate(0.3)
    //     .darken(0.3)
    //     .rotate(-20)
    //     .hex()
    // }

    // if (!firstColor || !secondColor) {
    //   return null
    // }

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
