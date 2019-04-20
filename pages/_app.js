import React from 'react'
import App, {Container} from 'next/app'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Head from '../components/Head'
import '../styles/global.css'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      '"Open Sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"PingFang SC"',
      '"Hiragino Sans GB"',
      '"Microsoft YaHei"',
      '"Helvetica Neue"',
      'Helvetica',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

export default class Tuna extends App {
  static async getInitialProps({Component, ctx}) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render() {
    const {Component, pageProps} = this.props

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
        <MuiThemeProvider theme={theme}>
          <Typography component="div">
            <Component {...pageProps} />
          </Typography>
        </MuiThemeProvider>
      </Container>
    )
  }
}
