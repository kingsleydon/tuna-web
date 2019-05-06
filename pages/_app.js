import React from 'react'
import App, {Container} from 'next/app'
import {PageTransition} from 'next-page-transitions'
import Head from '../components/Head'
import Header from '../components/Header'
import {HEADER_MAP} from '../constants/header'
import '../styles/global.css'

const timeout = 400
export default class Tuna extends App {
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
