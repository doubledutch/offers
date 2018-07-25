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
import './App.css'
import client from '@doubledutch/admin-client'
import List from './List'
import SortableTable from './SortableTable'
import FormView from './FormView'
import FirebaseConnector from '@doubledutch/firebase-connector'
import { CSVLink } from 'react-csv';
import '@doubledutch/react-components/lib/base.css'
const fbc = FirebaseConnector(client, 'Offers')
fbc.initializeAppWithSimpleBackend()

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


export default class App extends Component {
  constructor() {
    super()
    this.state = { 
      clicks: [],
      cells: [],
      newCell: {type:"Offer",
      image:"",
      title:"",
      des:""},
      edit: false,
      index: 0,
      showModal: false,
      search: ""
     }
    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  onDragEnd = (result) =>{
    var cells = this.state.cells
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    else {
      cells = reorder(
        this.state.cells,
        result.source.index,
        result.destination.index
      )
    }
    this.setState({ cells });
    fbc.database.public.adminRef('offers').set({"cells": cells})
  
  }

  componentDidMount() {
    this.signin.then(() => {
        const adminableRef = fbc.database.private.adminableUsersRef()
        const cellsRef = fbc.database.public.adminRef('offers') 
      cellsRef.on('child_added', data => {
        this.setState({ cells: [...data.val()] })
      })
      cellsRef.on('child_changed', data => {
        this.setState({ cells: [...data.val()] })
      })
        adminableRef.on('child_added', data => {
          var newClicks = []
          for (var i in data.val().click) {   
            var obj = data.val().click[i]
            obj["key"] = i
            obj["clickDate"] = new Date(obj.clickUTC).toLocaleDateString()
            newClicks.push(obj)
          }
          const totalClicks = this.state.clicks.concat(newClicks)
          this.setState({ clicks: totalClicks})
        })
        adminableRef.on('child_changed', data => {
          var newClicks = []
          for (var i in data.val().click) {
            var obj = data.val().click[i]
            obj["key"] = i
            obj["clickDate"] = new Date(obj.clickUTC).toLocaleDateString()
            if (this.state.clicks.find(click => click.key === i)) {
            }
            else {
              newClicks.push(obj)     
            }  
          }
          var totalClicks = this.state.clicks.concat(newClicks)
          this.setState({ clicks: totalClicks})
        })
    })
    .catch(err => alert(err))
  }

  render() {
    var sortedClicks = this.state.clicks.sort(sortUsers)
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
            <h1>Offers</h1>
            <button className="button" onClick={this.showModal} disabled={this.state.showModal}>Add Offer</button>
          </div>
          <SortableTable
            items = {this.state.cells}
            onDragEnd = {this.onDragEnd}
            handleDelete = {this.deleteCell}
            handleEdit = {this.handleEdit}
            showFormBool = {this.state.showFormBool}
            newCell={this.state.newCell}
          />
        </div>
        <div className="containerSmall">
          <div className="headerBox">
            <h1>Attendees</h1>
            <div style={{flex: 1}}/>
            <input className="searchBox" value={this.state.search} onChange={this.searchTable} placeholder={"Search"}/>
          </div>
          <List
            listData = {sortedClicks}
            listName = {"Total Clicks"}
            cells = {this.state.cells}
          />
          <div className="headerBox">
            <div style={{flex: 1}}/>
            <CSVLink className="csvButton" target='_self' data={sortedClicks} filename={"clicks.csv"}>Export List of Attendees</CSVLink>
          </div>
        </div>
      </div>
    )
  }

  filterClicks = (clicks, search) => {
    var filteredClicks = []
    clicks.forEach(function(content){
      var title = content.firstName + " " + content.lastName
      if (title && content.offer) {
        if (title.toLowerCase().indexOf(search.trim())!== -1 || content.offer.toLowerCase().indexOf(search.trim())!== -1){
          filteredClicks.push(content);
        }
      }
    })
    return filteredClicks
  }

  searchTable = (event) => {
    this.setState({search: event.target.value})
  }

  handleEdit = (index) => {
    this.setState({newCell: this.state.cells[index], edit: true, index, showModal: true})
  }

  showModal = () => {
    const currentStatus = this.state.showModal
    this.setState({showModal: !currentStatus, edit: false})
  }

  closeModal = () => {
    const currentStatus = this.state.showModal
    const blankCell = Object.assign({}, newCell)
    this.setState({showModal: !currentStatus, newCell: blankCell})
  }

  updateCell = (testCell) => {
    var newCell = Object.assign({}, testCell)
    this.setState({ newCell });
  }

  editCell = () => {
    var cells = this.state.cells
    let publishCell = this.state.newCell
    const blankCell = Object.assign({}, newCell)
    publishCell.title = publishCell.title.trim()
    publishCell.des = publishCell.des.trim()
    publishCell.image = publishCell.image.trim()
    cells[this.state.index] = publishCell
    this.setState({cells, newCell: blankCell, showModal: false, edit: false})
    fbc.database.public.adminRef('offers').set({"cells": cells})
  }

  addNewCell = () => {
    var cells = this.state.cells
    let publishCell = this.state.newCell
    const blankCell = Object.assign({}, newCell)
    publishCell.title = publishCell.title.trim()
    publishCell.des = publishCell.des.trim()
    publishCell.image = publishCell.image.trim()
    cells.push(publishCell)
    fbc.database.public.adminRef('offers').set({"cells": cells})
    this.setState({cells, newCell: blankCell, showModal: false})
  }

  deleteCell = (i) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      var cells = this.state.cells
      cells.splice(i, 1)
      this.setState({cells})
      fbc.database.public.adminRef('offers').set({"cells": cells})
    }

  }

  
}

function sortUsers(a,b) {
  const dateA = new Date(a.clickUTC).getTime()
  const dateB = new Date(b.clickUTC).getTime()
  return dateB - dateA
}

const newCell =  { type:"Offer",
image:"",
title:"",
des:"" 
}
