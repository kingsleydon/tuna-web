import React from 'react'
import App, {Container} from 'next/app'
import Head from '../components/Head'
import Header from '../components/Header'
import {HEADER_MAP} from '../constants/header'
import '../styles/global.css'

export default class Tuna extends App {
  // static async getInitialProps({Component, ctx}) {
  //   let pageProps = {}

  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx)
  //   }

  //   return {pageProps}
  // }

  render() {
    const {
      Component,
      pageProps,
      router: {pathname},
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
        {header && <Header color={header.color}>{header.name}</Header>}
        <Component {...pageProps} />
      </Container>
    )
  }
}
