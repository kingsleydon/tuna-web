import React, {Component} from 'react'

export default class FullscreenButton extends Component {
  state = {
    fullscreen: false,
  }

  componentDidMount() {
    this.updateFullscreenStatus()
    document.addEventListener('fullscreenchange', this.updateFullscreenStatus)
  }

  componentWillUnmount() {
    document.removeEventListener(
      'fullscreenchange',
      this.updateFullscreenStatus
    )
  }

  toggleFullscreen = () => {
    document.documentElement.requestFullscreen()
  }

  updateFullscreenStatus = () => {
    this.setState({fullscreen: Boolean(document.fullscreenElement)})
  }

  render() {
    if (this.state.fullscreen) {
      return null
    }

    return (
      <button {...this.props} onClick={this.toggleFullscreen}>
        全屏
      </button>
    )
  }
}
