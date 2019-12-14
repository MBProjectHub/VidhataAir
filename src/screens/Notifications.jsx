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

import { Button as SemButton, Header, Icon, Image, Modal, Form, TextArea, Label, Loader, Dimmer } from 'semantic-ui-react'

class Notifications extends React.Component {

  state = {
    notifs: [],
   currentModalConvos: [],
   open: false,
   currentSubject:'',
   currentFrom:'',
    currentToken:'',
    notifications:{},
    uid:''
  }

  componentDidMount()
  {
    fire.auth().onAuthStateChanged((user) => {
      if(user)
      {
        console.log('sd')
        this.setState({uid: fire.auth().currentUser.uid},()=>{
          
          this.retrieveFirebaseData()
        })
      }
    })
  }


  retrieveFirebaseData()
  {
        let notifications = {}
        let notifications_arr = []
        console.log('my time')
        fire.database().ref(`users/${this.state.uid}/notifications/`).once('value', (notifs)=>{
          //notifications = notifs.val()
          notifs.forEach(notification=>{
              notifications_arr.push({token:notification.key, subject: notification.val().subject, timestamp:notification.val().timestamp})
          })
          this.setState({notifs: notifications_arr})
        })
  }
  
  leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

  sendNotification()
  {
    let subject = document.getElementById('notify_sub').value
    let message = document.getElementById('notify_msg').value

    if(subject === "" || message === "")
    {
      alert('Please enter all the fields')
      return;
    }
    else
    {
      let currentDate = new Date();
    let date = this.leftPad(currentDate.getDate(),2)
    let month = this.leftPad(currentDate.getMonth()+1,2) 
    let year = currentDate.getFullYear();
    let hour = this.leftPad(currentDate.getHours(),2)
    let mins = this.leftPad(currentDate.getMinutes(),2)
    let secs = this.leftPad(currentDate.getSeconds(),2)


    let DateString = ""+year+month+date+hour+mins+secs
    let conversation = {}
  
    let firstConvo = "convo_"+DateString
    conversation[firstConvo] = {customer:true,
      message: message,
      time: ""+ date + "-"+month+"-"+year+" "+hour+":"+mins} 

      fire.database().ref(`users/${fire.auth().currentUser.uid}/name`).on('value',(name)=>{
        fire.database().ref(`notifications/notify_${DateString}/`).set(
          {
          conversation: conversation,
          subject: subject,
          sentByuid: fire.auth().currentUser.uid,
          timestamp: ""+date+"/"+month+"/"+year+" "+hour+":"+mins,
          sentByname: name.val()
        },()=>{
          fire.database().ref(`users/${fire.auth().currentUser.uid}/notifications/notify_${DateString}/`).set(
            {
            conversation: conversation,
            subject: subject,
            sentByuid:fire.auth().currentUser.uid,
            timestamp: ""+date+"/"+month+"/"+year+" "+hour+":"+mins,
            sentByname: name.val()
          }, ()=>{
            this.retrieveFirebaseData()
          })
        }
        )
      })

    

    document.getElementById("notify_sub").value = ""
    document.getElementById("notify_msg").value = ""
    
    }
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
                  <input id="notify_sub" class="form-control form-control-alternative" placeholder="Subject" type="text" style={{ marginBottom: 20 }} />
                  <textarea id="notify_msg" class="form-control form-control-alternative" rows="10" placeholder="Enter Custom Notification..."></textarea>
                </form>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Button onClick={this.sendNotification.bind(this)} block color="info" size="lg" type="button" style={{marginBottom: 20, width: '50%'}}>
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
    let token = this.state.currentToken
    let currentDate = new Date();
    let date = this.leftPad(currentDate.getDate(),2)
    let month = this.leftPad(currentDate.getMonth()+1,2) 
    let year = currentDate.getFullYear();
    let hour = this.leftPad(currentDate.getHours(),2)
    let mins = this.leftPad(currentDate.getMinutes(),2)
    let secs = this.leftPad(currentDate.getSeconds(),2)

    console.log(Date.now())

    let DateString = ""+year+month+date+hour+mins+secs

    fire.database().ref(`notifications/${token}/conversation/convo_${DateString}/`).set({
      customer:true,
      message: text,
      time: ""+ date + "-"+month+"-"+year+" "+hour+":"+mins
    })

    document.getElementById("messageBox").value = ""
    
    console.log(text, uid, DateString)
  }
  
  close = () => this.setState({ open: false })

  ChatModal(){
    let subject = this.state.currentSubject
    return(
    <Modal style={{height:'fit-content', top:'10%', left:'20%'}} open={this.state.open} onClose={this.close.bind(this)}>
     <div style={{display:'flex', flexDirection:'row', height:'fit-content'}}>
      <Modal.Header className="ModalHeader">{subject}</Modal.Header>
      </div>
      <Modal.Content className="ModalContent" style={{minHeight:window.innerHeight*(0.6)}} scrolling>

        <Modal.Description> 


          {this.state.currentModalConvos.map((value, index, array)=> {
            if(typeof value === 'object')
            return <MessageBox
            position={value.customer?'right':'left'}
            type={'text'}
            text={value.message}
            dateString={value.time.slice(11)}
            />

            else
            return <Label style={{marginLeft:'47%', backgroundColor:'#fff9c4'}} primary  pointing>
            {value}
          </Label>
          })
          }
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

  openChatModal(subject, token)
  {
    
    let conversations = []
    let prevDate = ""
    fire.database().ref('notifications').on('value',(convos)=>{
      conversations = []

      Object.values(convos.val()[token]['conversation']).map((val)=>{
        
        if(val.time.slice(0,3)!=prevDate)
        {
          prevDate = val.time.slice(0,3)
          conversations.push(val.time.slice(0,5))
        }
        conversations.push(val)
      })
      this.setState({currentModalConvos: conversations, open:true, currentSubject: subject, currentToken: token}) 
    }) 
    console.log(conversations)

    
  }
  

  getReceived() {
    var items = [];

    for(var i=this.state.notifs.length-1; i>=0; i--)
    {
      items.push(
        <tr>
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
            <button type="button" class="btn btn-success" 
            onClick={this.openChatModal.bind(this, this.state.notifs[i].subject,this.state.notifs[i].token)}>Open</button>
            
          </td>
        </tr>
      );
    }

    return items;
  }

  loadingBar()
  {
    if(this.state.notifs.length === 0)
    {
      return <Dimmer active>
      <Loader size='large'>Loading</Loader>
    </Dimmer>
    }
  }

  received() {
    return (
      <div class="table-responsive">
        <div>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Your Notifications</h3>
              <ConversationSearch placeholder="Search Notifications"/>
              {this.loadingBar()}
              
                
              
            </CardHeader>
              <table class="table align-items-center">
                <thead class="thead-light">
                    <tr>
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
    console.log(this.state.notifs)
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <NotifTabs send={this.send()} received={this.received()} />
            {this.ChatModal()}
          </Card>
        </Container>
      </>
    );
  }
}

export default Notifications;
