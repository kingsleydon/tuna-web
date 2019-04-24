import React, {Component} from 'react'
import {withRouter} from 'next/router'
import Vibrant from 'node-vibrant'
import {Howl} from 'howler'
import Head from '../components/Head'
import Parallelogram from '../components/Parallelogram'
import ProgressBar from '../components/ProgressBar'
import SONGS from '../constants/songs'
import './song.css'

@withRouter
export default class Song extends Component {
  state = {
    mutedColor: '#ffffff',
    vibrantColor: '#eeeeee',
    song: null,
    duration: null,
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
      // this.song.play()
      this.setState({
        duration: this.song.duration(),
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

  render() {
    const {mutedColor, vibrantColor, song, duration} = this.state

    if (!song) {
      return null
    }

    const {
      name,
      artist,
      album: {name: albumName, cover},
    } = song

    return (
      <div className="Song">
        <Head>
          <title>{name}</title>
        </Head>

        <div className="Song-Info">
          <div className="Song-coverWrapper">
            <img
              src={cover}
              className="Song-cover"
              onClick={() => {
                this.song.pause()
              }}
            />
          </div>
          <Parallelogram className="Song-name" color={vibrantColor}>
            {name}
          </Parallelogram>
          <Parallelogram className="Song-subInfo" color={mutedColor}>
            {artist} {albumName}
          </Parallelogram>
        </div>

        <ProgressBar duration={duration} />
      </div>
    )
  }
}
