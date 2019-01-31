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
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
import { translate as t } from '@doubledutch/rn-client'

export default class Offers extends Component {
  state = {
    renderConfirm: false,
    aspectRatio: 1,
  }

  componentDidMount = () => {
    Image.getSize(this.props.image, (width, height) => {
      const aspectRatio = width / height
      this.setState({ aspectRatio })
    })
  }

  componentDidUpdate(nextProps) {
    if (nextProps !== this.props) {
      Image.getSize(nextProps.image, (width, height) => {
        const aspectRatio = width / height
        this.setState({ aspectRatio, renderConfirm: false })
      })
    }
  }

  render() {
    const { image, des, title } = this.props
    const { aspectRatio } = this.state
    return (
      <View style={s.offerCard}>
        <View style={s.offerCardRounded}>
          <View style={s.container}>
            <Image style={[s.dimensionStyle, { aspectRatio }]} source={{ uri: image }} alt="" />
          </View>
          {this.renderBottom(title, des)}
        </View>
      </View>
    )
  }

  renderBottom = (title, des) => {
    if (this.state.renderConfirm) {
      return (
        <View style={s.textBox}>
          <View style={s.centerBox}>
            <Text style={s.title1}>{t('thanks')}</Text>
            <Text style={s.description}>{t('thanks_des')}</Text>
          </View>
        </View>
      )
    }

    const { primaryColor } = this.props
    return (
      <View style={s.textBox}>
        <Text style={s.title1}>{title}</Text>
        <Text style={s.description}>{des}</Text>
        <TouchableOpacity
          onPress={this.handleClick}
          style={[s.footerButton, { backgroundColor: primaryColor }]}
        >
          <Text style={s.footerButtonText}>{t('interest')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  handleClick = () => {
    this.props.sendData(this.props.title)
    const currentText = this.state.renderConfirm
    this.setState({ renderConfirm: !currentText })
  }
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  offerCard: {
    margin: 10,
    borderRadius: 10,
    shadowOffset: { height: 5, width: 0 },
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },
  offerCardRounded: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  dimensionStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  overlay: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(52, 52, 52, 0.7)',
    padding: 10,
  },
  buttonBox: {
    flexDirection: 'row',
    height: 25,
  },
  centerBox: {
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginTop: 5,
    borderColor: '#c9d3de',
    borderWidth: 1,
    backgroundColor: '#f2f6fb',
    padding: 10,
    borderRadius: 8,
  },
  conciergeInfoBox: {
    marginLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    marginLeft: 0,
    color: '#303030',
  },
  title2: {
    fontSize: 14,
    marginBottom: 5,
    color: '#636363',
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
    color: '#303030',
  },
  textBox: {
    padding: 20,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    display: 'flex',
    flex: 1,
  },
  border: {
    borderColor: '#D8D8D8',
    borderBottomWidth: 1,
    height: 0,
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  footerButton: {
    borderRadius: 20,
    paddingVertical: 15,
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
