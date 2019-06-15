import React, {Component} from 'react'
import cx from 'classnames'
import Link from 'next/link'
import Head from '../../components/Head'
import {camelizeKeys} from 'humps'
import axios from '../../utils/axios'
import './index.css'

export default class Songs extends Component {
  static async getInitialProps() {
    const {data = []} = await axios('/audio/list')
    return {list: camelizeKeys(data)}
  }

  renderSong = ({id, name, artist, disabled = false}) => {
    const item = (
      <div className={cx('Songs-song', {'Songs-song--disabled': disabled})}>
        <div className="Songs-songInfo">
          <span className="Songs-name">{name}</span>
          <span className="Songs-artist">{artist}</span>
        </div>
        <img className="Songs-songImage" src="/static/song.svg" alt="" />
      </div>
    )
    if (disabled) {
      return item
    }

    return (
      <Link href={`/songs/song?id=${id}`} as={`/songs/${id}`} key={id}>
        {item}
      </Link>
    )
  }

  render() {
    const {list} = this.props

    return (
      <div className="Songs">
        <Head>
          <title>选择歌曲</title>
        </Head>
        <div className="Songs-list">
          {list.map(this.renderSong)}
          {Array(1)
            .fill({id: 'soon', name: 'COMING', artist: 'SOON', disabled: true})
            .map(this.renderSong)}
        </div>
      </div>
    )
  }
}
