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
import ReactNative, { TouchableOpacity, Text, View, Image, Dimensions, Linking, Platform } from 'react-native'
import client, { Color } from '@doubledutch/rn-client'
import Chevron from './Chevron'

export default class Offers extends Component {
  constructor() {
    super()
    this.state = {
      renderText: false,
      renderConfirm: false
    }
  }
  render() {
    const { image, title, des } = this.props
    var rotate = {}
    if (this.state.renderText) {
      var rotate = { transform: [
        { rotate: '180deg'}
      ]}
    }
    return(
      <View>
        <View style={s.border}/>
        <TouchableOpacity style={s.container} onPress={this.handleOpen}>
        <Image source={{uri: image}} style={s.dimensionStyle} alt="Image">
          <View style={{backgroundColor: "rgba(52, 52, 52, 0.7)", flex: 1, justifyContent: 'center', padding: 10}}>
            <Text style={s.title}>{title}</Text>
            <View style={s.buttonBox}>
              <Text style={s.description}>Show more</Text>
              {this.showIcon(rotate)}
            </View>
          </View>
        </Image>
        </TouchableOpacity>
        {this.renderText(des)}
      </View>
    )
  }

  showIcon = (rotate) => {
    if (Platform.OS === "ios") {
      return (
        <Chevron style={rotate}/>
      )
    }
  }

  renderText = (des) => {
    if (this.state.renderText) {
      if (this.state.renderConfirm === false) {
        return (
          <View style={s.textBox}>
            <Text style={s.title2}>{des}</Text>
              <TouchableOpacity onPress={this.handleClick} style={{marginTop:0}}>
                <View style={s.footerButton}>
                  <Text style={s.footerButtonText}>I'm Interested</Text>
                </View>
              </TouchableOpacity>
          </View>
        )
      }
      else{
        return (
          <View style={s.textBox}>
            <Text style={s.title1}>Thank you!</Text>
            <Text style={s.title2}>One of our team members will be reaching out.</Text>     
              <TouchableOpacity onPress={this.handleClose} style={{marginTop:0}}>
                <View style={s.footerButton}>
                  <Text style={s.footerButtonText}>Close</Text>
                </View>
              </TouchableOpacity>  
          </View>
        )
      }
    }
  }

  handleOpen = () => {
    var currentText = this.state.renderText
    this.setState({renderText: !currentText})
  }

  handleClick = () => {
    this.props.sendData(this.props.title)
    var currentText = this.state.renderConfirm
    this.setState({renderConfirm: !currentText})
    setTimeout(() => {
      this.handleClose()
      }
      ,3000)
  }

  handleClose = () => {
    this.setState({renderConfirm: false, renderText: false})
  }
}
    
const s = ReactNative.StyleSheet.create({

  container : {
    padding: 0, 
    borderColor:'#D8D8D8',
    borderBottomWidth:0, 
    backgroundColor: "#FFFFFF"
  },


  dimensionStyle : {
    flexDirection: "row", 
    flexGrow: 1,
    aspectRatio: 2.0165,
    justifyContent: 'center',
    resizeMode: 'cover',
    alignItems: 'flex-end'
  },
  main: {
    padding: 0,
    borderColor:'#D8D8D8',
    borderBottomWidth:1,
    borderTopWidth:1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  buttonBox: {
    flexDirection: 'row',
    height: 25,
  },
  main2: {
    padding: 0,
    marginTop: 10,
    borderColor:'#D8D8D8',
    borderBottomWidth:1,
    borderTopWidth:1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  image: {
    margin: 10,
    height: 90,
    width: 90,
    resizeMode: 'contain'
  },
  info: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 15,
    marginBottom: 15,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    color: "white",
    fontWeight: "bold"

  },
  title1: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: 'center'
  },

  title2: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
  },
  textBox: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    margin: 0,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  border : {
    borderColor:'#D8D8D8',
    borderBottomWidth:1, 
    height: 0, 
    flex: 1, 
    backgroundColor: "#E8E8E8"
  },
  footerButton : {
    backgroundColor: client.primaryColor,
    borderRadius:4,
    padding:10, 
    margin: 20, 
  },
  footerButtonText : {
    color:'white',
    textAlign:'center',
    fontSize:16
  }


})
