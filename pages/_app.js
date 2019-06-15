import React from 'react'
import App, {Container} from 'next/app'
import {PageTransition} from 'next-page-transitions'
import Head from '../components/Head'
import Header from '../components/Header'
import {HEADER_MAP} from '../constants/header'
import '../styles/global.css'

const timeout = 800
export default class Tuna extends App {
  listenTouch = () => {
    if (this.touchTimeout) {
      clearTimeout(this.touchTimeout)
    }
    this.touchTimeout = setTimeout(() => {
      location.href = '/'
    }, 600000)
  }

  componentDidMount = () => {
    this.listenTouch()
    document
      .querySelector('body')
      .addEventListener('touchstart', this.listenTouch)
  }

  componentWillUnmount = () => {
    if (this.touchTimeout) {
      clearTimeout(this.touchTimeout)
    }
    document
      .querySelector('body')
      .removeEventListener('touchstart', this.listenTouch)
  }

  render() {
    const {
      Component,
      pageProps,
      router: {pathname, asPath},
    } = this.props
    const header = HEADER_MAP[pathname]

    return (
      <Container>
        <Head>
          <meta
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
            name="viewport"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i,800,800i"
            rel="stylesheet"
          />
          <meta name="apple-mobile-web-app-title" content="Project Tuna" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#222222" />
        </Head>
        <PageTransition classNames="Header-transition" timeout={timeout}>
          {header ? (
            <Header color={header.color} key={header.name}>
              {header.name}
            </Header>
          ) : (
            <div className="Header-placeholder" />
          )}
        </PageTransition>
        <PageTransition classNames="Page-transition" timeout={timeout}>
          <Component {...pageProps} key={asPath} />
        </PageTransition>
      </Container>
    )
  }
}
