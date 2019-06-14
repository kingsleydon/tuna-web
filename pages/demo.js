import React, {Component} from 'react'
import cx from 'classnames'
import {Howl} from 'howler'
import Link from 'next/link'
import Parallelogram from '../components/Parallelogram'
import Head from '../components/Head'
import {HEADER_MAP} from '../constants/header'
import './result.css'

const color = HEADER_MAP['/result'].color
const name = '童年'

const origin =
  'https://audio-tuna.oss-cn-beijing.aliyuncs.com/%E5%8E%9F%E9%9F%B3%E6%B7%B7%E9%9F%B3.mp3'
const result =
  'https://audio-tuna.oss-cn-beijing.aliyuncs.com/e89c5b58-2fc7-4642-bea7-90fd40710582.wav'

export default class Demo extends Component {
  state = {
    originLoaded: false,
    resultLoaded: false,
  }
  componentDidMount() {
    this.origin = new Howl({
      src: [origin],
    })
    this.result = new Howl({
      src: [result],
    })
    this.origin.once('load', () => {
      this.setState({
        originLoaded: true,
      })
    })
    this.result.once('load', () => {
      this.setState({
        resultLoaded: true,
      })
    })
  }

  playOrigin = () => {
    if (this.result.playing()) {
      this.result.stop()
    }
    if (!this.origin.playing()) {
      this.origin.play()
    }
  }

  playResult = () => {
    if (!this.result.playing()) {
      this.result.play()
    }
    if (this.origin.playing()) {
      this.origin.stop()
    }
  }

  componentWillUnmount =() => {
    this.result.unload()
    this.origin.unload()
  }

  render() {
    const {originLoaded, resultLoaded} = this.state
    const songLoaded = originLoaded && resultLoaded

    const {className, style, ...restProps} = this.props

    return (
      <div
        className={cx('Result', className)}
        {...style && {style}}
        {...restProps}
      >
        <Head>
          <title>{name} 结果</title>
        </Head>
        <div className="Result-success">
          {songLoaded ? (
            <>
              <div className="Result-successImage">
                <img src="/static/song.svg" alt="" />
              </div>
              <div className="Result-pendingText">TUNA 处理完成</div>
              <div className="Result-pendingName">{name}</div>

              <Parallelogram
                onClick={this.playOrigin}
                className="Result-startButton"
                color={color}
              >
                试听录音原音
              </Parallelogram>
              <Parallelogram
                onClick={this.playResult}
                className="Result-startButton"
                color={color}
              >
                试听处理结果
              </Parallelogram>
              <Link href="/">
                <a className="Result-retryButton">返回主页</a>
              </Link>
            </>
          ) : (
            <div>结果加载中</div>
          )}
        </div>
      </div>
    )
  }
}
