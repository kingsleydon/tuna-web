import React, {Component} from 'react'
import cx from 'classnames'
import {camelizeKeys} from 'humps'
import {Howl} from 'howler'
import axios from '../utils/axios'
import './result.css'

export default class Result extends Component {
  static async getInitialProps({query: {id}}) {
    try {
      const {data} = await axios('/audio/task', {params: {task_id: id}})
      return {result: camelizeKeys(data)}
    } catch (err) {
      return {result: {}}
    }
  }

  componentDidMount() {
    const {
      result: {status, audio},
    } = this.props

    if (status === 'SUCCESS' && audio) {
      this.song = new Howl({
        src: [audio],
      })
      this.song.once('load', this.start)
    }
  }

  start = () => {
    this.song.play()
  }

  render() {
    const {
      className,
      style,
      result: {status, audio},
      ...restProps
    } = this.props

    return (
      <div
        className={cx('Result', className)}
        {...style && {style}}
        {...restProps}
      >
        {status === 'PENDING' && <div>处理中</div>}
        {status === 'SUCCESS' && (
          <div>
            <a href={audio} download="tuna.wav">
              下载
            </a>
          </div>
        )}
      </div>
    )
  }
}
