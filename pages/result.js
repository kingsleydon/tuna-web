import React, {Component, Fragment} from 'react'
import cx from 'classnames'
import {withRouter} from 'next/router'
import Link from 'next/link'
import {camelizeKeys} from 'humps'
import {Howl} from 'howler'
import Parallelogram from '../components/Parallelogram'
import {HEADER_MAP} from '../constants/header'
import Head from '../components/Head'
import axios from '../utils/axios'
import './result.css'

const color = HEADER_MAP['/result'].color

@withRouter
export default class Result extends Component {
  static async getInitialProps({query: {id}}) {
    try {
      const {data} = await axios('/audio/task', {params: {task_id: id}})
      return {result: camelizeKeys(data)}
    } catch (err) {
      return {result: {}}
    }
  }

  state = {
    songLoaded: false,
    result: null,
  }

  componentDidMount() {
    const {
      result: {status, audio},
      router: {
        query: {id},
      },
    } = this.props

    if (status === 'SUCCESS' && audio) {
      this.song = new Howl({
        src: [audio],
      })
      this.song.once('load', () => {
        this.setState({
          songLoaded: true,
        })
      })
    }

    if (status === 'PENDING') {
      this.interval = setInterval(() => {
        axios('/audio/task', {params: {task_id: id}}).then(({data}) => {
          if (data) {
            const result = camelizeKeys(data)
            if (result.status !== 'PENDING') {
              // clearInterval(this.interval)
              // this.setState({result: camelizeKeys(data)})
              location.reload()
            }
          }
        })
      }, 5000)
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  start = () => {
    if (!this.song.playing()) {
      this.song.play()
    }
  }

  render() {
    const {result, songLoaded} = this.state

    const {className, style, result: firstResult, ...restProps} = this.props

    const {
      status,
      song: {name},
    } = result || firstResult

    return (
      <div
        className={cx('Result', className)}
        {...style && {style}}
        {...restProps}
      >
        <Head>
          <title>{name} 结果</title>
        </Head>
        {status === 'PENDING' && (
          <div className="Result-pending">
            <div className="Result-pendingImage">
              <img src="/static/pending.svg" alt="" />
            </div>
            <div className="Result-pendingText">TUNA 处理中</div>
            <div className="Result-pendingName">{name}</div>
          </div>
        )}
        {status === 'SUCCESS' && (
          <div className="Result-success">
            {songLoaded ? (
              <Fragment>
                <div className="Result-successImage">
                  <img src="/static/song.svg" alt="" />
                </div>
                <div className="Result-pendingText">TUNA 处理完成</div>
                <div className="Result-pendingName">{name}</div>

                <Parallelogram
                  onClick={this.start}
                  className="Result-startButton"
                  color={color}
                >
                  播放
                </Parallelogram>
                <Link href="/">
                  <a className="Result-retryButton">再试一次</a>
                </Link>
              </Fragment>
            ) : (
              <div>结果加载中</div>
            )}
          </div>
        )}
      </div>
    )
  }
}
