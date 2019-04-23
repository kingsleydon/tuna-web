import React, {Component} from 'react'
import cx from 'classnames'
import Parallelogram from '../Parallelogram'
import './MenuButton.css'

export default class MenuButton extends Component {
  render() {
    const {className, extra, children, ...restProps} = this.props
    return (
      <Parallelogram
        className={cx('MenuButton', className)}
        role="button"
        {...restProps}
      >
        {children}
        {typeof extra === 'string' && (
          <div className="MenuButton-extra">{extra.toUpperCase()}</div>
        )}
      </Parallelogram>
    )
  }
}
