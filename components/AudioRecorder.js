import {Component} from 'react'
import noop from 'lodash/noop'
import Recorder from '../utils/recorder'

export default class AudioRecorder extends Component {
  state = {
    loaded: false,
  }

  componentDidMount() {
    const {
      onLoad = noop,
      onError = noop,
      //  onProgress = noop
    } = this.props

    this.rec = new Recorder()
    this.rec.open(() => {
      onLoad()
      this.setState({
        loaded: true,
      })
    }, onError)
  }

  componentWillUnmount() {
    if (this.rec) {
      this.rec.close()
    }
  }

  start = () => {
    this.rec.start()
  }

  stop = (...args) => {
    this.rec.stop(...args)
  }

  render() {
    return null
  }
}
