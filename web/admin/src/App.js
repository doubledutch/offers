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

import React, { PureComponent } from 'react'
import './App.css'
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import { CSVDownload } from '@doubledutch/react-csv'
import List from './List'
import SortableTable from './SortableTable'
import FormView from './FormView'
import i18n from './i18n'
import '@doubledutch/react-components/lib/base.css'

useStrings(i18n)

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clicks: [],
      cells: [],
      newCell: {
        type: 'Offer',
        image: '',
        title: '',
        des: '',
      },
      edit: false,
      index: 0,
      showModal: false,
      search: '',
      exportList: [],
      exporting: false,
    }
    this.signin = props.fbc
      .signinAdmin()
      .then(user => (this.user = user))
      .catch(err => console.error(err))
  }

  onDragEnd = result => {
    let cells = this.state.cells
    // dropped outside the list
    if (!result.destination) {
      return
    }
    cells = reorder(this.state.cells, result.source.index, result.destination.index)

    this.setState({ cells })
    this.props.fbc.database.public.adminRef('offers').set({ cells })
  }

  componentDidMount() {
    const { fbc } = this.props
    this.signin
      .then(() => {
        const adminableRef = fbc.database.private.adminableUsersRef()
        const cellsRef = fbc.database.public.adminRef('offers')
        cellsRef.on('child_added', data => {
          this.setState({ cells: [...data.val()] })
        })
        cellsRef.on('child_changed', data => {
          this.setState({ cells: [...data.val()] })
        })

        adminableRef.on('child_added', data => {
          const newClicks = []
          for (const i in data.val().click) {
            const obj = data.val().click[i]
            obj.key = i
            obj.userId = data.key
            obj.clickDate = new Date(obj.clickUTC).toLocaleDateString()
            newClicks.push(obj)
          }
          const totalClicks = this.state.clicks.concat(newClicks)
          this.setState({ clicks: totalClicks })
        })
        adminableRef.on('child_changed', data => {
          const newClicks = []
          for (var i in data.val().click) {
            const obj = data.val().click[i]
            obj.key = i
            obj.clickDate = new Date(obj.clickUTC).toLocaleDateString()
            if (!this.state.clicks.find(click => click.key === i)) {
              newClicks.push(obj)
            }
          }
          const totalClicks = this.state.clicks.concat(newClicks)
          this.setState({ clicks: totalClicks })
        })
      })
      .catch(err => alert(err))
  }

  render() {
    let sortedClicks = this.state.clicks.sort(sortUsers)
    if (this.state.search.length) sortedClicks = this.filterClicks(sortedClicks, this.state.search)
    return (
      <div className="App">
        <FormView
          newCell={this.state.newCell}
          updateCell={this.updateCell}
          handleSubmit={this.addNewCell}
          handleEdit={this.editCell}
          showModal={this.state.showModal}
          showModalFunction={this.closeModal}
          edit={this.state.edit}
        />
        <div className="containerSmall">
          <div className="headerBox">
            <h1 className="headerMargin">{t('offers')}</h1>
            <button
              className="dd-bordered"
              onClick={this.showModal}
              disabled={this.state.showModal}
            >
              {t('add')}
            </button>
          </div>
          <SortableTable
            items={this.state.cells}
            onDragEnd={this.onDragEnd}
            handleDelete={this.deleteCell}
            handleEdit={this.handleEdit}
            showFormBool={this.state.showFormBool}
            newCell={this.state.newCell}
            disableButton={this.state.showModal}
          />
        </div>
        <div className="containerSmall">
          <div className="headerBox">
            <h1>{t('attendees')}</h1>
            <div style={{ flex: 1 }} />
            <input
              className="searchBox"
              value={this.state.search}
              onChange={this.searchTable}
              placeholder={t('search')}
            />
          </div>
          <List listData={sortedClicks} cells={this.state.cells} />
          <div className="headerBox">
            <div style={{ flex: 1 }} />
            <button className="dd-bordered" onClick={() => this.prepareCsv(sortedClicks)}>
              {t('export')}
            </button>
            {this.state.exporting ? (
              <CSVDownload data={this.state.exportList} filename="offers_attendees.csv" />
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  prepareCsv = clicks => {
    const newList = []
    const attendeeClickPromises = clicks.map(click =>
      client
        .getAttendee(click.userId)
        .then(attendee => ({ ...click, ...attendee }))
        .catch(err => click),
    )

    Promise.all(attendeeClickPromises).then(clicks => {
      // Build CSV and trigger download...
      clicks.forEach(item => {
        const newItem = {
          date_clicked: item.clickDate,
          offer: item.offer,
          name: `${item.firstName} ${item.lastName}`,
          phone: item.phone,
          email: item.email,
          company: item.company,
          title: item.title,
        }
        newList.push(newItem)
      })
      this.setState({ exporting: true, exportList: newList })
      setTimeout(() => this.setState({ exporting: false, exportList: [] }), 3000)
    })
  }

  filterClicks = (clicks, search) => {
    const filteredClicks = []
    clicks.forEach(content => {
      const title = `${content.firstName} ${content.lastName}`
      if (title && content.offer) {
        if (
          title.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1 ||
          content.offer.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1
        ) {
          filteredClicks.push(content)
        }
      }
    })
    return filteredClicks
  }

  searchTable = event => {
    this.setState({ search: event.target.value })
  }

  handleEdit = index => {
    this.setState({
      newCell: Object.assign({}, this.state.cells[index]),
      edit: true,
      index,
      showModal: true,
    })
  }

  showModal = () => {
    const currentStatus = this.state.showModal
    this.setState({ showModal: !currentStatus, edit: false })
  }

  closeModal = () => {
    const currentStatus = this.state.showModal
    const blankCell = Object.assign({}, newCell)
    this.setState({ showModal: !currentStatus, newCell: blankCell })
  }

  updateCell = testCell => {
    const newCell = Object.assign({}, testCell)
    this.setState({ newCell })
  }

  editCell = () => {
    const cells = this.state.cells
    const publishCell = this.state.newCell
    const blankCell = Object.assign({}, newCell)
    publishCell.title = publishCell.title.trim()
    publishCell.des = publishCell.des.trim()
    publishCell.image = publishCell.image.trim()
    if (!publishCell.key) publishCell.key = getRandomKey()

    cells[this.state.index] = publishCell
    this.setState({ cells, newCell: blankCell, showModal: false, edit: false })
    this.props.fbc.database.public.adminRef('offers').set({ cells })
  }

  addNewCell = () => {
    const cells = this.state.cells
    const publishCell = this.state.newCell
    const blankCell = Object.assign({}, newCell)
    publishCell.title = publishCell.title.trim()
    publishCell.des = publishCell.des.trim()
    publishCell.image = publishCell.image.trim()
    publishCell.key = getRandomKey()

    cells.push(publishCell)
    this.props.fbc.database.public.adminRef('offers').set({ cells })
    this.setState({ cells, newCell: blankCell, showModal: false })
  }

  deleteCell = i => {
    if (window.confirm(t('confirm_delete'))) {
      const cells = this.state.cells
      cells.splice(i, 1)
      this.setState({ cells })
      this.props.fbc.database.public.adminRef('offers').set({ cells })
    }
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'Offers',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)

function getRandomKey() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  )
}

function sortUsers(a, b) {
  const dateA = new Date(a.clickUTC).getTime()
  const dateB = new Date(b.clickUTC).getTime()
  return dateB - dateA
}

const newCell = {
  type: 'Offer',
  image: '',
  title: '',
  des: '',
}
