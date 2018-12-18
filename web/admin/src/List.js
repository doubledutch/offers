/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import { translate as t } from '@doubledutch/admin-client'
import './App.css'

export default class List extends Component {
  listData = () => {
    if (this.props.listData) {
      const clicks = this.props.listData
      const listItems = clicks.map(click => (
        <li key={click.key}>
          <span className="listItemBox">
            <p className="itemTitle">{`${click.firstName} ${click.lastName}`}</p>
            <p className="itemDes">
              {click.offer} - {click.clickDate}
            </p>
          </span>
        </li>
      ))
      return <ul className="list">{listItems}</ul>
    }
  }

  render() {
    return (
      <span className="listBox">
        <span className="headerItemBox">
          <p>{t('name')}</p>
          <p className="offerTitle">{t('offer')}</p>
        </span>
        {this.listData()}
      </span>
    )
  }
}
