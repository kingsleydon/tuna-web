import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import FullscreenIcon from '@material-ui/icons/Fullscreen'

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
      <Button {...this.props} onClick={this.toggleFullscreen}>
        <FullscreenIcon />
        全屏
      </Button>
    )
  }
}
