import React, {Component} from 'react'
import Link from 'next/link'
import {camelizeKeys} from 'humps'
import Parallelogram from '../../components/Parallelogram'
import axios from '../../utils/axios'
import './index.css'

const headerColor = ['#32CCBC', '#90F7EC']

export default class Songs extends Component {
  static async getInitialProps() {
    const {data = []} = await axios('/audio/list')
    return {list: camelizeKeys(data)}
  }

  render() {
    const {list} = this.props

    return (
      <div className="Songs">
        <div className="Page-header">
          <Parallelogram className="Page-name" color={headerColor}>
            SELECT SONG
          </Parallelogram>
        </div>

        <div className="Songs-list">
          {list.map(({id, name}) => (
            <Link href={`/songs/${id}`} key={id}>
              <a>{name}</a>
            </Link>
          ))}
        </div>
      </div>
    )
  }
}
