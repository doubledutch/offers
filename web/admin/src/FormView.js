import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import {TextInput} from '@doubledutch/react-components'

export default class FormView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      video: false,
      isError: false
    }
  }

  handleInputChange = (event) => {
    const {name, type, checked, value} = event.target
    const path = name.split('.')
    const {newCell} = this.props
    const obj = path.slice(0, path.length-1).reduce((obj, prop) => obj[isNaN(prop) ? prop : +prop], newCell)
    obj[path[path.length-1]] = value
    if (type === "checkbox"){
      obj[path[path.length-1]] = checked
    }  
    this.props.updateCell(newCell)   
    this.setState({isError: false})
  }

  formInput = () => {
    return (
      <form className="formBox" onSubmit={this.handleSubmit}>
        <div>
          <div className="topForm">
            <label className="boxTitle">
              Offer Name
              <input
              className="box"
              name="title"
              type="text"
              placeholder="Name"
              required
              maxLength={50}
              value={this.props.newCell.title}
              onChange={this.handleInputChange} />
            </label>
            <label className="boxTitle">
              Image URL
              <input
              className="box"
              name="image"
              type="text"
              required
              placeholder="https://www.offer.com/image"
              value={this.props.newCell.image}
              onChange={this.handleInputChange} />
            </label>
          </div>
          <div className="bottomForm">
            <label className="boxTitleWide">
              Offer Description
              <textarea
              className="wideBox"
              name="des"
              type="text"
              required
              maxLength={400}
              placeholder="Ex. Join us for a free security webinar!"
              value={this.props.newCell.des}
              onChange={this.handleInputChange} />
            </label>
          </div>
        </div>
        <div className="modalBottom">
          <button className="formButton" onClick={this.cancelSave}>Cancel</button>
          {this.state.isError
          ? <button className="formButton">Retry</button>
          : <input type="submit" value={this.props.edit ? "Save Offer" : "Add Offer"} className="formButton"/>
          }
        </div>
      </form>
    ) 
  }

  cancelSave = () => {
    this.setState({isError: false})
    this.props.showModalFunction()
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.props.newCell.des.trim() && this.props.newCell.title.trim() && this.props.newCell.image) {
      if (this.props.edit) this.props.handleEdit(event)
      else this.props.handleSubmit(event)
    }
    else {
      this.setState({isError: true})
    }
  }

  render(){
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.showModal}
        onAfterOpen={this.props.afterOpenModal}
        onRequestClose={this.props.showModal}
        contentLabel="Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modalTop">
          <h1 className="modalTitle">{this.props.edit ? "Edit " :"New "}Offer</h1>
          <div style={{flex:1 }}/>
          <button className="closeModalButton" onClick={this.cancelSave}>X</button>
        </div>
        {this.props.newCell ? this.formInput() : null}
      </Modal>
    )
  }



}