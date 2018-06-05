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
import ReactNative, {
  Platform, Text, TextInput, View, ScrollView, StyleSheet
} from 'react-native'
import client, { TitleBar } from '@doubledutch/rn-client'
import Offers from './Offers'
import FirebaseConnector from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'Offers')
fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      componentConfigs : []
    }
    this.signin = fbc.signin()
    .then(user => this.user = user)
    
    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      const cellsRef = fbc.database.public.adminRef('offers') 
      cellsRef.on('child_added', data => {
        this.setState({ componentConfigs: [...data.val()] })
      })
      cellsRef.on('child_changed', data => {
        this.setState({ componentConfigs: [...data.val()] })
      })
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TitleBar title="Offers" client={client} signin={this.signin} />
        <ScrollView style={styles.container}>
          { this.state.componentConfigs ? this.state.componentConfigs.map(this.getComponent) : <Text>Loading...</Text> }
        </ScrollView>
      </View>
    )
  }

  getComponent = (details, i) => {
    switch(details.type) {
      case "Offer" :
        return(
          <Offers {...details} key={i} sendData={this.sendData}/>
        )
    }
  }

  sendData = (title)=> {
    fbc.database.private.adminableUserRef("click").push({
      offer: title,
      firstName: client.currentUser.firstName || null,
      lastName: client.currentUser.lastName || null,
      email: client.currentUser.email || null,
      company: client.currentUser.company || null,
      title: client.currentUser.title || null,
      phone: client.currentUser.phone || null,
      clickUTC: new Date().toString()
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#E8E8E8'
  }
})
