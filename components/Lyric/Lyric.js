import React, {Component} from 'react'
import cx from 'classnames'
import './Lyric.css'

const SHOW_LINES = 3
const LINE_HEIGHT = 38
export default class Lyric extends Component {
  constructor(props) {
    super(props)
    const {lyric, offset = 0} = props

    this.state = {
      lines: lyric.map(line => ({...line, time: line.time + offset})),
      activeLineIndex: -1,
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    const nextActiveLineIndex = state.lines.findIndex(
      ({time}) => time >= props.position
    )

    if (
      nextActiveLineIndex > -1 &&
      nextActiveLineIndex !== state.activeLineIndex
    ) {
      return {
        activeLineIndex: nextActiveLineIndex - 1,
      }
    } else if (props.position > state.lines[state.lines.length - 1].time) {
      return {
        activeLineIndex: state.lines.length - 1,
      }
    }

    return null
  }

  render() {
    const {lines, activeLineIndex} = this.state
    const {className, style, position} = this.props

    if (!lines.length) {
      return null
    }

    const lineStyle = index =>
      cx(
        'Lyric-line',
        {'Lyric-line--active': activeLineIndex === index},
        {
          'Lyric-line--inactive': index > activeLineIndex + SHOW_LINES,
        },
        {
          'Lyric-line--acted': index < activeLineIndex,
        },
        {
          'Lyric-line--border': index === activeLineIndex + SHOW_LINES,
        }
      )

    let linePercent = 0

    if (activeLineIndex > -1) {
      const activeLine = lines[activeLineIndex]
      const linePosition = position - activeLine.time
      const activeWordIndex =
        activeLine.wordTime.findIndex(time => time > linePosition) - 1
      linePercent =
        (activeWordIndex / activeLine.text.length +
          (linePosition - activeLine.wordTime[activeWordIndex]) /
            (activeLine.wordTime[activeWordIndex + 1] -
              activeLine.wordTime[activeWordIndex]) /
            activeLine.text.length) *
        100
    }

    const countdown = Math.floor(lines[0].time - position) + 1

    return (
      <div
        className={cx('Lyric', className)}
        style={{
          height: `${(SHOW_LINES + 1) * LINE_HEIGHT}px`,
          transform: `translate3d(0, ${(activeLineIndex + 1) *
            -LINE_HEIGHT}px, 0)`,
          ...style,
        }}
      >
        {countdown > 0 && (
          <div className="Lyric-countdown">
            {Array(countdown > 5 ? 5 : countdown)
              .fill()
              .map((_, index) => (
                <div className="Lyric-countdownBox" key={index} />
              ))}
          </div>
        )}
        {lines.map(({text}, index) => {
          return (
            <div
              className={lineStyle(index)}
              key={`${index}-${text}`}
              {...activeLineIndex === index && {
                style: {
                  backgroundImage: `linear-gradient(to right, #6c5b7b, #c06c84 ${linePercent}%, white 0%)`,
                },
              }}
            >
              {text}
            </div>
          )
        })}
      </div>
    )
  }
}
