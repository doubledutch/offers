import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'

export default class FormView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      video: false
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
  }

  formInput = () => {
    return (
      <form className="formBox" onSubmit={this.handleSubmit}>
        <div>
          <span className="topForm">
            <label className="boxTitle">
              Title
              <input
              className="box"
              name="title"
              type="text"
              required
              value={this.props.newCell.title}
              onChange={this.handleInputChange} />
            </label>
            <label className="boxTitle">
              Image Link
              <input
              className="box"
              name="image"
              type="text"
              required
              value={this.props.newCell.image}
              onChange={this.handleInputChange} />
            </label>
          </span>
          <span className="bottomForm">
            <label className="boxTitleWide">
              Description
              <textarea
              className="wideBox"
              name="des"
              type="text"
              required
              value={this.props.newCell.des}
              onChange={this.handleInputChange} />
            </label>
          </span>
        </div>
        <div className="modalBottom">
          <input type="submit" value="Add Offer" className="formButton"/>
        </div>
      </form>
    ) 
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.props.edit) this.props.handleEdit(event)
    else this.props.handleSubmit(event)
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
          <h1 className="modalTitle">New Offer</h1>
          <div style={{flex:1 }}/>
          <button className="closeModalButton" onClick={this.props.showModalFunction}>X</button>
        </div>
        {this.props.newCell ? this.formInput() : null}
      </Modal>
    )
  }



}