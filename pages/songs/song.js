import React, {Component, Fragment} from 'react'
import {withRouter} from 'next/router'
import {Howl} from 'howler'
import {camelizeKeys} from 'humps'
import axios from '../../utils/axios'
import Head from '../../components/Head'
import AudioRecorder from '../../components/AudioRecorder'
import Parallelogram from '../../components/Parallelogram'
import Lyric from '../../components/Lyric'
import ProgressBar from '../../components/ProgressBar'
// import SONGS from '../../constants/songs'
import './song.css'

const nameColor = ['#6c5b7b', '#c06c84']
// const subInfoColor = ['#32CCBC', '#90F7EC']

@withRouter
export default class Song extends Component {
  static async getInitialProps({
    req: {
      params: {id},
    },
  }) {
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
      this.song.off()
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
    // FIXME: start
    // this.rec.start()
    window.requestAnimationFrame(this.setPosition)
  }

  stop = () => {
    // FIXME: remove debug pause
    this.song.pause()

    // FIXME: end
    // this.rec.stop(function(blob) {
    //   const link = document.createElement('a')
    //   link.href = window.URL.createObjectURL(blob)
    //   link.download = 'test1.wav'
    //   link.click()
    // })
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

    // FIXME: loading debug
    const loading = !songLoaded || !recorderLoaded
    // const loading = false

    const {
      name,
      // artist,
      // album: {name: albumName},
      lyric,
    } = song

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

        <div
          className="Page-header"
          // FIXME: remove debug
          onClick={() => {
            if (this.song) {
              this.song.playing() ? this.stop() : this.start()
            }
          }}
        >
          <Parallelogram className="Page-name" color={nameColor}>
            RECORDING
          </Parallelogram>
        </div>

        <div className="Song-body">
          {loading && !error && <div>正在加载歌曲…</div>}
          {error && (
            <Fragment>
              <div>初始化失败</div>
              <div style={{marginTop: '20px'}}>请尝试：</div>
              <div>检查麦克风权限是否开启</div>
              <div>使用系统浏览器重试</div>
            </Fragment>
          )}
          {!loading && (
            <Lyric
              lyric={JSON.parse(lyric) || []}
              position={position}
              offset={song.offset}
            />
          )}
        </div>

        {!loading && (
          <ProgressBar
            className="Song-ProgressBar"
            duration={duration}
            color={nameColor}
            position={position}
          />
        )}
      </div>
    )
  }
}
