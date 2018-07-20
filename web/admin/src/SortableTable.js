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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import reordericon from './icons/reordericon.png'
import pencil from './icons/pencil.png'
import trashcan from './icons/trashcan.png'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (draggableStyle, isDragging) => ({
  userSelect: 'none',
  display: "flex",
  flexFlow: "row wrap",
  margin: `0px`,
  height: "40px",
  textAlign: "center",
  // borderRadius: 4,
  borderBottom: '1px solid #D1D1D1',
  background: isDragging ? '#F6F8FB' : 'white',
  ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'white' : 'white',
  padding: '0px',
  width: '100%',
  overflow: "auto",
  height: "250px"
});

class SortableTable extends Component {
  constructor(props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    }); 
  }
  
  renderCell = (provided, snapshot, item, i) => {
    return (
      <Draggable key={i} draggableId={i}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              style={getItemStyle(
                provided.draggableStyle,
                snapshot.isDragging
                )}
              {...provided.dragHandleProps}
            >
              <div className="preview-cell__container">
                <img className="dragButton" name={i}  value="true" src={reordericon} alt="move" />
                <p className="cellTitle">{item.title || ""}</p>
                <p className="cellDes">{item.des || ""}</p>
                <div style={{flex: 1}} />
                <button className="borderlessButton" name={i}  value="true" onClick={() => this.props.handleEdit(i)}>Edit</button>
                <button className="borderlessButton" name={i}  value="true" onClick={() => this.props.handleDelete(i)}>Remove</button>
              </div>
            </div>
              {provided.placeholder}
            </div>
          )}
      </Draggable>
    )
  }

  render(){
    return (
      <div>
        <span className="headerItemBox2">
          <p>Name</p>
          <p>Description</p>
        </span>
        <span className="previewContainer">
          <DragDropContext onDragEnd={this.props.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
              {
                this.props.items.map((item, i) => 
                (
                  <div>
                    {this.renderCell(provided, snapshot, item, i)}
                  </div>
                ))
              }
              {provided.placeholder}
              </div>
              )}
            </Droppable>
          </DragDropContext>  
        </span>
      </div>
    )
  }

}


export default SortableTable