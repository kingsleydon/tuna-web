import React, {Component, Fragment} from 'react'
import {withRouter} from 'next/router'
// import dynamic from 'next/dynamic'
import Vibrant from 'node-vibrant'
import {Howl} from 'howler'
import Head from '../../../components/Head'
import AudioRecorder from '../../../components/AudioRecorder'
import Parallelogram from '../../../components/Parallelogram'
import ProgressBar from '../../../components/ProgressBar'
import SONGS from '../../../constants/songs'
import './index.css'

// const AudioRecorder = dynamic(
//   () => import('../../../components/AudioRecorder'),
//   {
//     ssr: false,
//   }
// )
// const ForwardedRefAudioRecorder = forwardRef((props, ref) => (
//   <AudioRecorder {...props} forwardRef={ref} />
// ))

@withRouter
export default class Song extends Component {
  state = {
    mutedColor: '#ffffff',
    vibrantColor: '#eeeeee',
    song: null,
    duration: 0,
    position: 0,
    songLoaded: false,
    recorderLoader: false,
    error: false,
  }

  componentDidMount() {
    this.setSong(() => {
      this.setColor()
      this.loadSong()
    })
  }

  componentWillUnmount() {
    if (this.song) {
      this.song.off()
    }
  }

  setSong = callback => {
    const {
      router: {
        query: {id},
      },
    } = this.props
    const song = SONGS.find(({id: songId}) => songId === Number(id))

    if (!song) {
      return
    }

    this.setState({song}, callback)
  }

  loadSong = () => {
    const {
      song: {name},
    } = this.state

    this.song = new Howl({
      src: [`/static/${name}.mp3`],
    })

    this.song.once('load', () => {
      this.setState({
        duration: this.song.duration(),
        songLoaded: true,
      })
    })
  }

  setColor = () => {
    const {
      song: {
        album: {cover},
      },
    } = this.state

    Vibrant.from(cover)
      .getPalette()
      .then(palette => {
        this.setState({
          mutedColor: palette.DarkMuted.hex,
          vibrantColor: palette.LightVibrant.hex,
        })
      })
  }

  setPosition = () => {
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
    // FIXME: remove debug pause
    // this.song.pause()

    this.rec.stop(function(blob) {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'test1.wav'
      link.click()
    })
  }

  setRecRef = el => {
    this.rec = el
  }

  render() {
    const {
      mutedColor,
      vibrantColor,
      song,
      duration,
      position,
      songLoaded,
      recorderLoaded,
      error,
    } = this.state

    if (!song) {
      return null
    }

    const loading = !songLoaded || !recorderLoaded

    const {
      name,
      artist,
      album: {name: albumName},
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
          className="Song-header"
          // FIXME: remove debug
          onClick={() => {
            if (this.song) {
              this.song.playing() ? this.stop() : this.start()
            }
          }}
        >
          {/* <div className="Song-coverWrapper">
            <img
              src={cover}
              className="Song-cover"
              onClick={() => {
                this.song.pause()
              }}
            />
          </div> */}
          <Parallelogram className="Song-name" color={vibrantColor}>
            {name}
          </Parallelogram>
          <Parallelogram className="Song-subInfo" color={mutedColor}>
            {artist} {albumName}
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
        </div>

        {!loading && (
          <ProgressBar
            className="Song-ProgressBar"
            duration={duration}
            color={vibrantColor}
            position={position}
          />
        )}
      </div>
    )
  }
}
