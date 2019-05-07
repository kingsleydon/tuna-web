import React, {Component} from 'react'
import Link from 'next/link'
import Head from '../components/Head'
import MenuButton from '../components/MenuButton'
import {TITLE, SUB_TITLE} from '../constants/app.js'
import './index.css'

export default class Index extends Component {
  render() {
    return (
      <div className="Index">
        <Head>
          <title>Home</title>
        </Head>

        <div className="Index-titleGroup">
          <div className="Index-titleGroup-title">{TITLE}</div>
          <div className="Index-titleGroup-subtitle">
            {SUB_TITLE.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        </div>

        <div className="Index-menu">
          {/* <MenuButton color={['#6c5b7b', '#c06c84']} extra="QUICK">
            快速开始
          </MenuButton> */}
          <Link href="/songs">
            <MenuButton color={['#11998e', '#38ef7d']} extra="START">
              选择歌曲
            </MenuButton>
          </Link>
        </div>
      </div>
    )
  }
}
