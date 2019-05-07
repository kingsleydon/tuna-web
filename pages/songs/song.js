import React, {Component, Fragment} from 'react'
import Router, {withRouter} from 'next/router'
import {Howl} from 'howler'
import {camelizeKeys} from 'humps'
import axios from '../../utils/axios'
import Head from '../../components/Head'
import AudioRecorder from '../../components/AudioRecorder'
import Lyric from '../../components/Lyric'
import ProgressBar from '../../components/ProgressBar'
import Parallelogram from '../../components/Parallelogram'
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
    uploading: false,
    uploaded: false,
    uploadProgress: 0,
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

    this.rec.stop(blob => {
      this.setState({
        uploading: true,
      })
      const formData = new FormData()
      formData.set('source', id)
      formData.set('audio', blob)
      axios
        .post('/audio/', formData, {
          onUploadProgress: e => {
            this.setState({
              uploadProgress: Math.round((e.loaded * 100) / e.total),
            })
          },
        })
        .then(({data}) => {
          const {taskId} = camelizeKeys(data)
          if (taskId) {
            this.setState({
              uploaded: true,
              uploading: false,
            })
            setTimeout(() => {
              Router.push(`/result?id=${taskId}`, `/results/${taskId}`)
            }, 3000)
          }
        })
    })
  }

  setRecRef = el => {
    this.rec = el
  }

  render() {
    const {
      duration,
      position,
      songLoaded,
      recorderLoaded,
      error,
      uploading,
      uploaded,
      uploadProgress,
    } = this.state

    const {song} = this.props

    if (!song) {
      return null
    }

    // const uploading = true

    const finished = uploaded || uploading
    const loading = (!songLoaded || !recorderLoaded) && !error && !finished
    const loaded = songLoaded && recorderLoaded && !error && !finished

    const {name, lyric} = song

    return (
      <div className="Song">
        <Head>
          <title>{name}</title>
        </Head>

        {/* HACK */}
        <div style={{display: 'none'}}>
          <img className="Song-uploadImage" src="/static/upload.svg" alt="" />
          <img className="Song-uploadImage" src="/static/finish.svg" alt="" />
        </div>

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
          {uploading && (
            <div className="Song-upload">
              <img
                className="Song-uploadImage"
                src="/static/upload.svg"
                alt=""
              />
              <div className="Song-uploadProgress">{uploadProgress}%</div>
              <div className="Song-uploadText">上传中</div>
            </div>
          )}
          {uploaded && (
            <div className="Song-upload">
              <img
                className="Song-uploadImage"
                src="/static/finish.svg"
                alt=""
              />
              <div className="Song-uploadProgress">上传完成</div>
              <div className="Song-uploadText">正在跳转结果页</div>
            </div>
          )}
        </div>

        {loaded && (
          <ProgressBar
            className="Song-ProgressBar"
            duration={duration}
            color={nameColor}
            position={position}
            // FIXME: remove debug
          />
        )}

        {loaded && !position && (
          <Parallelogram
            className="Song-startButton"
            onClick={() => {
              if (this.song) {
                this.song.playing() ? this.stop() : this.start()
              }
            }}
            color={nameColor}
          >
            开始演唱
          </Parallelogram>
        )}
      </div>
    )
  }
}
