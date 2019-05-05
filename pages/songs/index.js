import React, {Component} from 'react'
import cx from 'classnames'
import Link from 'next/link'
import {camelizeKeys} from 'humps'
import Parallelogram from '../../components/Parallelogram'
import axios from '../../utils/axios'
import './index.css'

const headerColor = ['#32CCBC', '#90F7EC']

export default class Songs extends Component {
  static async getInitialProps() {
    const {data = []} = await axios('/audio/list')
    return {list: camelizeKeys(data)}
  }

  renderSong = ({id, name, artist, disabled = false}) => {
    const item = (
      <a className={cx('Songs-song', {'Songs-song--disabled': disabled})}>
        <div className="Songs-songInfo">
          <span className="Songs-name">{name}</span>
          <span className="Songs-artist">{artist}</span>
        </div>
        {/* <img src="/static/music.svg" /> */}
      </a>
    )
    if (disabled) {
      return item
    }

    return (
      <Link href={`/songs/${id}`} key={id}>
        {item}
      </Link>
    )
  }

  render() {
    const {list} = this.props

    return (
      <div className="Songs">
        <div className="Page-header">
          <Parallelogram className="Page-name" color={headerColor}>
            SELECT SONG
          </Parallelogram>
        </div>

        <div className="Songs-list">
          {list.map(this.renderSong)}
          {Array(5)
            .fill({id: null, name: 'COMING', artist: 'SOON', disabled: true})
            .map(this.renderSong)}
        </div>
      </div>
    )
  }
}
