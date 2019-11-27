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
import _ from 'lodash'
// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  Table,
  Media
} from "reactstrap";

// RCE CSS
import 'react-chat-elements/dist/main.css';
// MessageBox component
import { MessageBox } from 'react-chat-elements';
import '../assets/css/Notifications.css'

import fire from '../config/firebaseConfig';
// core components
import EmptyHeader from "components/Headers/EmptyHeader.jsx";
import NotifTabs from "components/NotifTabs.js";
import ConversationSearch from '../components/ConversationSearch'


import { Button as SemButton, Header, Icon, Image, Modal, Form, TextArea } from 'semantic-ui-react'

class Notifications extends React.Component {

  state = {
    notifs: [
      { from: 'Michael', subject: 'Passport Expiry', timestamp: '26/10/2019 - 15:44'},
      { from: 'Clark', subject: 'Booking Update', timestamp: '23/09/2019 - 7:25'},
      { from: 'Ruby', subject: 'Passport Expiry', timestamp: '07/09/2019 - 2:17'},
      { from: 'Fredrick', subject: 'Payment Verification', timestamp: '15/08/2019 - 12:59'}
  ]
  }

  componentWillMount()
  {
    fire.database().ref('notifications/').on('value', (thread)=>{
      console.log(thread.val())
    })
  }

  send() {
    return(
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Personal Notification</h3>
            </CardHeader>
            <div class="container">
              <div class="row">
                <div class="col">
                <form style={{ marginBottom: 20 }}>
                  <input class="form-control form-control-alternative" placeholder="Subject" type="text" style={{ marginBottom: 20 }} />
                  <textarea class="form-control form-control-alternative" rows="10" placeholder="Enter Custom Notification..."></textarea>
                </form>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Button block color="info" size="lg" type="button" style={{marginBottom: 20, width: '50%'}}>
                      Send
                    </Button>
                  </div>
                </div>

                
              </div>
            </div>
          </Card>
        </div>
      </Row>
    );
  }


  sendMessage()
  {
    let text = document.getElementById('messageBox').value
    let uid = fire.auth().currentUser.uid;
    
  }
  
  ChatModal(subject,from){
    return(
    <Modal style={{height:'fit-content', top:'10%', left:'20%'}} trigger={<button type="button" class="btn btn-success">Open</button>}>
     <div style={{display:'flex', flexDirection:'row', height:'fit-content'}}>
      <Modal.Header className="ModalHeader">{subject}</Modal.Header>
      <p className="SenderDetails">{from}</p>
      </div>
      <Modal.Content className="ModalContent" scrolling>
  
        <Modal.Description>
         
          {_.times(18, (i) => (
            <MessageBox
            position={(i%2==0)?'right':'left'}
            type={'text'}
            text={'react.svg'}
            />
          ))}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions style={{display: 'flex',
                            justifyContent: 'space-between'}}>
      <Form style={{width:window.innerWidth*0.4}}>
        <TextArea id="messageBox" placeholder='Type a message' rows={2}/>
      </Form>
        <SemButton id="reply" onClick={this.sendMessage.bind(this)} primary>
          Reply <Icon name='chevron right' />
        </SemButton>
      </Modal.Actions>
    </Modal>
    )
  }

  getReceived() {
    var items = [];

    for(var i=0; i<this.state.notifs.length; i++)
    {
      items.push(
        <tr>
          <td>
            {this.state.notifs[i].from}
          </td>
          <th scope="row" class="name">
            <div class="media align-items-center">
              <div class="media-body">
                <span class="mb-0 text-sm">{this.state.notifs[i].subject}</span>
              </div>
            </div>
          </th>
          <td>
            {this.state.notifs[i].timestamp}
          </td>
          <td>
            {this.ChatModal(this.state.notifs[i].subject,this.state.notifs[i].from)}
          </td>
        </tr>
      );
    }

    return items;
  }

  received() {
    return (
      <div class="table-responsive">
        <div>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Your Notifications</h3>
              <ConversationSearch placeholder="Search Notifications"/>
            </CardHeader>
              <table class="table align-items-center">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">
                            From
                        </th>
                        <th scope="col">
                            Subject
                        </th>
                        <th scope="col">
                            Timestamp
                        </th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody class="list">
                  {this.getReceived()}
                </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }


  render() {
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <NotifTabs send={this.send()} received={this.received()} />
          </Card>
        </Container>
      </>
    );
  }
}

export default Notifications;
