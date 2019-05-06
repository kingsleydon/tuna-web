import React, {Component, Fragment} from 'react'
import {withRouter} from 'next/router'
import {Howl} from 'howler'
import {camelizeKeys} from 'humps'
import axios from '../../utils/axios'
import Head from '../../components/Head'
import AudioRecorder from '../../components/AudioRecorder'
import Lyric from '../../components/Lyric'
import ProgressBar from '../../components/ProgressBar'
import {HEADER_MAP} from '../../constants/header'
import './song.css'

const nameColor = HEADER_MAP['/songs/song'].color

@withRouter
export default class Song extends Component {
  static async getInitialProps({query: {id}}) {
    try {
      const {data} = await axios(`/audio/${id}`)
      return {song: camelizeKeys(data)}
    } catch (err) {
      return {}
    }
  }

  state = {
    duration: 0,
    position: 0,
    songLoaded: false,
    recorderLoader: false,
    error: false,
  }

  componentDidMount() {
    if (this.props.song) {
      this.loadSong()
    }
  }

  componentWillUnmount() {
    if (this.song) {
      this.song.unload()
    }
    if (this.rec.close) {
      this.rec.close()
    }
  }

  loadSong = () => {
    const {
      song: {accompanimentUrl},
    } = this.props

    this.song = new Howl({
      src: [accompanimentUrl],
    })

    this.song.once('load', () => {
      this.setState({
        duration: this.song.duration(),
        songLoaded: true,
      })
    })
  }

  setPosition = () => {
    if (!this.song.playing()) {
      return
    }
    this.setState({position: this.song.seek()})
    window.requestAnimationFrame(this.setPosition)
  }

  start = () => {
    this.song.play()
    this.song.once('end', this.stop)
    this.rec.start()
    window.requestAnimationFrame(this.setPosition)
  }

  stop = () => {
    const {
      song: {id},
    } = this.props

    this.rec.stop(function(blob) {
      const formData = new FormData()
      formData.set('source', id)
      formData.set('audio', blob)
      axios.post('/audio/', formData)
    })
  }

  setRecRef = el => {
    this.rec = el
  }

  render() {
    const {duration, position, songLoaded, recorderLoaded, error} = this.state

    const {song} = this.props

    if (!song) {
      return null
    }

    const loading = (!songLoaded || !recorderLoaded) && !error
    const loaded = songLoaded && recorderLoaded && !error

    const {name, lyric} = song

    return (
      <div className="Song">
        <Head>
          <title>{name}</title>
        </Head>

        <AudioRecorder
          ref={this.setRecRef}
          onLoad={() => {
            this.setState({recorderLoaded: true})
          }}
          onError={() => {
            this.setState({error: true})
          }}
        />

        <div className="Song-body">
          {loading && <div>正在加载歌曲…</div>}
          {error && (
            <Fragment>
              <div>初始化失败</div>
              <div style={{marginTop: '20px'}}>请尝试：</div>
              <div>检查麦克风权限是否开启</div>
              <div>使用系统浏览器重试</div>
            </Fragment>
          )}
          {loaded && (
            <Lyric
              lyric={JSON.parse(lyric) || []}
              position={position}
              offset={song.offset}
            />
          )}
        </div>

        {loaded && (
          <ProgressBar
            className="Song-ProgressBar"
            duration={duration}
            color={nameColor}
            position={position}
            // FIXME: remove debug
            onClick={() => {
              if (this.song) {
                this.song.playing() ? this.stop() : this.start()
              }
            }}
          />
        )}
      </div>
    )
  }
}
