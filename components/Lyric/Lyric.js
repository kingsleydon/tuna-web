import React, {Component} from 'react'
import cx from 'classnames'
import {parseLyric} from '../../utils/parseLyric'
import './Lyric.css'

const SHOW_LINES = 3
export default class Lyric extends Component {
  constructor(props) {
    super(props)
    const {lyric, offset = 0} = props
    // const validLyric = lyric
    // .replace(/(\[\d\d:\d\d\.\d\d)\]/g, '$10]')
    // .replace(/(\[\d\d:\d\d\.\d)\]/g, '$100]')
    // .replace(/(\[\d\d:\d\d\.\d)\d+\]/, '$1]')
    // const parsedLyric = new LyricParser(validLyric)
    // const lines = parsedLyric.lines
    // const offset = parsedLyric.tags.offset
    //   ? Number(parsedLyric.tags.offset) * 1000
    //   : -lines[0].time
    this.state = {
      lines: parseLyric(lyric, offset),
      activeLine: -1,
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    const nextActiveLine = state.lines.findIndex(
      ({time}) => time >= props.position
    )

    if (nextActiveLine > -1 && nextActiveLine !== state.activeLine) {
      return {
        activeLine: nextActiveLine - 1,
      }
    }

    return null
  }

  syncScroll = () => {}

  render() {
    const {lines, activeLine} = this.state
    const {className, style, ...restProps} = this.props

    if (!lines.length) {
      return null
    }

    const lineStyle = index =>
      cx(
        'Lyric-line',
        {'Lyric-line--active': activeLine === index},
        {
          'Lyric-line--inactive': index > activeLine + SHOW_LINES,
        },
        {
          'Lyric-line--acted': index < activeLine,
        },
        {
          'Lyric-line--border': index === activeLine + SHOW_LINES,
        }
      )

    return (
      <div
        className={cx('Lyric', className)}
        style={{
          height: `${(SHOW_LINES + 1) * 38}px`,
          transform: `translate3d(0, ${(activeLine + 1) * -38}px, 0)`,
          ...style,
        }}
        {...restProps}
      >
        <div className={lineStyle(-1)}>READY</div>
        {lines.map(({text}, index) => {
          // if (
          //   index < activeLine - SHOW_LINES ||
          //   index > activeLine + SHOW_LINES
          // ) {
          //   return null
          // }
          return (
            <div className={lineStyle(index)} key={index}>
              {text}
            </div>
          )
        })}
      </div>
    )
  }
}
