/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Container,
  Row,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  Table,
  Media
} from "reactstrap";

import {Card, Icon, Image} from 'semantic-ui-react';
// core components
import EmptyHeader from "components/Headers/EmptyHeader.jsx";
import NotifTabs from "components/NotifTabs.js";
import ConversationSearch from '../components/ConversationSearch'

class AboutUs extends React.Component {

  state = {
  }


  render() {
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" style={{display:'flex',width:'100%',flexDirection:'column',alignItems:'center'}} fluid>
        <Card style={{width:'70%',height:'50%'}}>
    <Image src={require('../assets/img/theme/profile-cover.jpg')} style={{background:"#000", height:window.innerHeight*0.5}}   ui={false} />
    <Card.Content>
      <Card.Header>Vidhata Agency</Card.Header>
      <Card.Meta>
        <span className='date'>Established in 2015</span>
      </Card.Meta>
      <Card.Description style={{fontSize:16}}>
      Vidhata Tours And Travels Limited is a Public incorporated on 05 November 1993. It is classified as Non-govt company and is registered at Registrar of Companies, Bangalore. Its authorized share capital is Rs. 2,500,000 and its paid up capital is Rs. 2,500,000. It is inolved in Human health activities

Vidhata Tours And Travels Limited's Annual General Meeting (AGM) was last held on 29 September 2018 and as per records from Ministry of Corporate Affairs (MCA), its balance sheet was last filed on 31 March 2018.

Directors of Vidhata Tours And Travels Limited are Narayanlal Bajaj, Puneet Jain, Premlata Bajaj and Govind Bajaj.

Vidhata Tours And Travels Limited's Corporate Identification Number is (CIN) U85110KA1993PLC014885 and its registration number is 14885.Its Email address is dakaliya@gmail.com and its registered address is 101 PRESTIGE COURT101, K.H.ROAD, (DOUBLE ROAD), OPP:VIJAYA BANK LTD, BANGALORE KA 560027 IN , - , .

Current status of Vidhata Tours And Travels Limited is - Active.

      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='user' />
        22 Friends
      </a>
    </Card.Content>
  </Card>
        </Container>
      </>
    );
  }
}

export default AboutUs;
