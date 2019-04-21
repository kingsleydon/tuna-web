import React, {Component} from 'react'
import Head from '../components/Head'
import FullscreenButton from '../components/FullscreenButton'
import MenuButton from '../components/MenuButton'
import {TITLE, SUB_TITLE} from '../constants/app.js'
import './index.css'

export default class Index extends Component {
  render() {
    return (
      <div className="Index Container">
        <Head>
          <title>Home</title>
        </Head>

        <FullscreenButton className="Index-fullscreenButton" />

        <div className="Index-titleGroup">
          <div className="Index-titleGroup-title">{TITLE}</div>
          <div className="Index-titleGroup-subtitle">
            {SUB_TITLE.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        </div>

        <div className="Index-menu">
          <MenuButton color="blue" extra="QUICK">
            快速开始
          </MenuButton>
          <MenuButton color="green" extra="FREE">
            自由模式
          </MenuButton>
        </div>
      </div>
    )
  }
}
