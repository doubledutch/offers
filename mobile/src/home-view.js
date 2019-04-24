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
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import client, { TitleBar, translate as t, useStrings } from '@doubledutch/rn-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import Offers from './Offers'
import i18n from './i18n'

useStrings(i18n)

class HomeView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      componentConfigs: [],
    }
    this.signin = props.fbc.signin().then(user => (this.user = user))

    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    client.getPrimaryColor().then(primaryColor => this.setState({ primaryColor }))
    client.getCurrentUser().then(currentUser => {
      this.setState({ currentUser })
      this.signin.then(() => {
        const cellsRef = this.props.fbc.database.public.adminRef('offers')
        cellsRef.on('child_added', data => {
          this.setState({ componentConfigs: [...data.val()] })
        })
        cellsRef.on('child_changed', data => {
          this.setState({ componentConfigs: [...data.val()] })
        })
      })
    })
  }

  render() {
    const { suggestedTitle, offersId } = this.props
    const { currentUser, primaryColor } = this.state
    let { componentConfigs } = this.state
    if (offersId){
      const uniqueOffer = componentConfigs.find(item => offersId === item.key)
      if (uniqueOffer) componentConfigs = [uniqueOffer]
    }
    if (!currentUser || !primaryColor) return null
    return (
      <View style={{ flex: 1 }}>
        <TitleBar title={suggestedTitle || t('offers')} client={client} signin={this.signin} />
        <ScrollView
          style={s.container}
          ref={scrollView => {
            this.scrollView = scrollView
          }}
          onContentSizeChange={(contentWidth, contentHeight) => {
            scrollViewBottom = contentHeight
          }}
        >
          {this.state.componentConfigs.length ? (
            <View>{componentConfigs.map(this.getComponent)}</View>
          ) : (
            <View style={s.helpTextContainer}>
              <Text style={s.helpText} />
            </View>
          )}
        </ScrollView>
      </View>
    )
  }

  getComponent = (details, i) => {
    switch (details.type) {
      case 'Offer':
        return (
          <Offers
            {...details}
            key={i}
            sendData={this.sendData}
            scrolltoBottom={this.scrolltoBottom}
            isLast={this.state.componentConfigs.length - 1 == i}
            primaryColor={this.state.primaryColor}
          />
        )
    }
  }

  scrolltoBottom = () => {
    const height = Dimensions.get('window').width / 1.6
    this.scrollView.scrollTo({ y: scrollViewBottom - height })
  }

  sendData = title => {
    const { currentUser } = this.state
    this.props.fbc.database.private
      .adminableUserRef('click')
      .push({
        offer: title,
        user: currentUser,
        firstName: currentUser.firstName || null,
        lastName: currentUser.lastName || null,
        email: currentUser.email || null,
        company: currentUser.company || null,
        title: currentUser.title || null,
        phone: currentUser.phone || null,
        clickUTC: new Date().toString(),
      })
      .catch(() => Alert.alert('Please try reloading extension'))
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'Offers',
  (props, fbc) => <HomeView {...props} fbc={fbc} />,
  PureComponent,
)

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  helpTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    fontSize: 20,
    marginTop: 150,
    textAlign: 'center',
  },
})
