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
const fbc = FirebaseConnector(client, 'offers')
fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      componentConfigs : []
    }
    this.signin = fbc.signin()
    .then(user => this.user = user)
    .catch(error => {alert("Please try reloading page to connect to the database")})
  }

  componentDidMount() {
    const componentConfigs = [
      {"type":"Offer","image1":"https://partner.microsoft.com/-/media/mssc/mpn/partner/sales-and-marketing/subsidiary-images/marketing-ofc17.ashx?h=281&la=en-US&w=500&hash=F0A865442B402429D23B4AC463B78E46403205DE","title1":"Customer Immersion Experience","des1":"The Customer Immersion Experience (CIE) is a great way to discover the right Microsoft 365 solutions for your business in an interactive, experiential, and fun way. During your CIE session, you will - experience a hands-on introduction to EMS, Windows 10 and Office 365; walk through some common work scenarios and explore Microsoft 365 solutions and products in an interactive and fully immersive environment."},
      {"type":"Offer","image1":"https://c.s-microsoft.com/en-us/CMSImages/offerings_StrategyBriefing2x.jpg?version=ea9bf3fe-6e50-f301-10b1-30eb0119e358","title1":"Microsoft Technology Center: Strategy Briefing","des1":"This one-day briefing starts by examining your current IT environment and business objectives. Then it moves into the Envisioning Center, where you’ll see Microsoft solutions in action, through powerful demos and scenarios customized to meet your needs. The day includes mutual discovery, tailored product and technology drill-downs, and expert presentations. It culminates with the delivery of a clear and actionable picture of how Microsoft and partner technologies can help you reach your business goals."},
      {"type":"Offer","image1":"https://c.s-microsoft.com/en-us/CMSImages/offerings_design_session2x.jpg?version=2ac652b5-0ece-68bc-03e4-d13f67c31840","title1":"Microsoft Technology Center: Architectural Design Session","des1":"This custom session focuses on your business objectives and aligns them with specific applications of Microsoft software to help you not only meet your goals, but also capitalize on them. We’ll provide architectural guidance, consultation on preferred practices, and risk analysis to chief technology officers, architects, and senior members of your development team."},
      {"type":"Offer","image1":"https://c.s-microsoft.com/en-us/CMSImages/offerings_proof_of_concept2x.jpg?version=a6bdc506-a3c7-7707-5636-0a628308ade1","title1":"Microsoft Technology Center: Proof-of-Concept","des1":"In this multi week, in-depth workshop, our architects work closely with key members of your technical staff to transfer knowledge and prove out customized solutions. This workshop may also include detailed demos and training sessions. Your team will have a private, secure, and fully loaded development suite that's preconfigured prior to their arrival."},
      {"type":"Offer","image1":"https://c.s-microsoft.com/en-us/CMSImages/offerings_workshop2x.jpg?version=ece69a50-9fcb-93e0-5f15-d511d0f26728","title1":"Microsoft Technology Center: Workshop","des1":"If seeing is believing, then imagine what a hands-on immersive experience can do! Attend a custom briefing that includes a facilitated, hands-on environment where you and your colleagues can experience the vision of Microsoft's platform and solutions firsthand."},
      {"type":"Offer","image1":"https://c.s-microsoft.com/en-us/CMSImages/BusinessOverview_2_FeaturePanel_1_v2.jpg?version=c607a798-30bc-7824-8fbb-6af797184716","title1":"Surface for your Industry","des1":"Surface devices have been specifically built from the best of the Microsoft ecosystem to meet the needs of modern business. We are so happy that we have had the opportunity to seed your company with a Surface Pro and M365 during this event. Let us know if you would like your Surface Sales Specialist to contact you about any questions you may have or how Surface can help transform your business and empower your employees."},
    ]

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
    console.log(this.state.componentConfigs)
    return (
      <View style={{flex: 1}}>
        <TitleBar title="Offers" client={client} signin={this.signin} />
        <ScrollView style={styles.container}>
          { this.state.componentConfigs.map(this.getComponent) }
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
