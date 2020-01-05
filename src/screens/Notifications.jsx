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
import '../components/ConversationSearch/ConversationSearch.css'

import { Button as SemButton, Header, Icon, Image, Modal, Form, TextArea, Label, Loader, Dimmer } from 'semantic-ui-react'

class Notifications extends React.Component {

  state = {
    notifs: null,
    allNotifs: null,
   currentModalConvos: [],
   open: false,
   currentSubject:'',
   currentFrom:'',
    currentToken:'',
    notifications:{},
    uid:'',
    currentInitiated:''
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


  getTimestamp(h,m) {
    var t = new Date();
    t.setHours(t.getUTCHours() + h); 
    t.setMinutes(t.getUTCMinutes() + m);
  
    var timestamp =
        t.getUTCFullYear() + "_" +
        ("0" + (t.getMonth()+1)).slice(-2) + "_" +
        ("0" + t.getDate()).slice(-2) + "_" +
        ("0" + t.getHours()).slice(-2) + "_" +
        ("0" + t.getMinutes()).slice(-2) + "_" +
        ("0" + t.getSeconds()).slice(-2) + "_" +
        ("0" + t.getMilliseconds()).slice(-2);
  
    return timestamp;
  }

  async retrieveFirebaseData()
  {
        let notifications = {}
        let notifications_arr = []
        console.log('my time')

        fire.database().ref('notifications/').on('value', (notifs)=>{
          //notifications = notifs.val()
                  let currentModalConvos = null
                  let currentSubject = null
                  let currentFrom = null
                  let currentToken = null
                  let currentInitiated = null
          notifs.forEach(notification=>{
    
              if(notification.val().initiatedTime === this.state.currentInitiated)
              {
                  fire.database().ref(`users/${fire.auth().currentUser.uid}/notifications/${notification.key}/opened`).set(true)
                  let conversations = []
                  let prevDate = ""
                  Object.values(notification.val()['conversation']).map((val)=>{
                    
                    if(val.time.slice(0,3)!=prevDate)
                    {
                      prevDate = val.time.slice(0,3)
                      conversations.push(val.time.slice(0,5))
                    }
                    conversations.push(val)
                  })
                  
                  currentModalConvos =  conversations 
                  currentSubject = notification.val().subject
                  currentFrom = notification.val().sentByname
                  currentToken =  notification.key
                  currentInitiated = notification.val().initiatedTime
              }
              
           })
           if(currentToken!==null)
          this.setState({allNotifs: notifs.val(), currentToken: currentToken, currentFrom: currentFrom,
            currentSubject: currentSubject, currentInitiated: currentInitiated, currentModalConvos: currentModalConvos
          })
          else
          this.setState({allNotifs: notifs.val()
          })
        })

        await fire.database().ref(`users/${this.state.uid}/notifications/`).on('value', (notifs)=>{
          console.log(notifs.val())
          notifications_arr = []
          //notifications = notifs.val()
          notifs.forEach(notification=>{
              notifications_arr.push({token:notification.key, 
                                       subject: notification.val().subject, 
                                       timestamp:notification.val().timestamp,
                                       sentToName: notification.val().sentToName,
                                      sentByname: notification.val().sentByname,
                                      initiatedTime: notification.val().initiatedTime,
                                    opened:notification.val().opened})
          })
          this.setState({notifs: notifications_arr,searchNotif: notifications_arr})
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
  let currentDate = new Date();
  let date = this.leftPad(currentDate.getDate(),2)
  let month = this.leftPad(currentDate.getMonth()+1,2) 
  let year = currentDate.getFullYear();
  let hour = this.leftPad(currentDate.getHours(),2)
  let mins = this.leftPad(currentDate.getMinutes(),2)
  let secs = this.leftPad(currentDate.getSeconds(),2)
    let subject = document.getElementById('notify_sub').value
    let message = document.getElementById('notify_msg').value

    if(subject === "" || message === "")
    {
      alert('Please enter all the fields')
      return;
    }
    else
    {


    let DateString = this.getTimestamp(5,30)
    let conversation = {}
  
    let firstConvo = "convo_"+DateString
    conversation[firstConvo] = {customer:true,
      message: message,
      time: ""+ date + "-"+month+"-"+year+" "+hour+":"+mins} 

      fire.database().ref(`users/${fire.auth().currentUser.uid}`).once('value',(user)=>{
        fire.database().ref(`notifications/notify_${DateString}/`).set(
          {
          conversation: conversation,
          subject: subject,
          sentByuid: fire.auth().currentUser.uid,
          timestamp: ""+date+"/"+month+"/"+year+" "+hour+":"+mins,
          sentByname: user.val().name,
          sentByEmail: user.val().email,
          sentToName: '-',
          sentToMail: '-',
          sentTouid: '-',
          initiatedTime: DateString,
          opened:false
        },()=>{
          fire.database().ref(`users/${fire.auth().currentUser.uid}/notifications/notify_${DateString}/`).set(
            {
            subject: subject,
            sentByuid:fire.auth().currentUser.uid,
            timestamp: ""+date+"/"+month+"/"+year+" "+hour+":"+mins,
            sentByname: user.val().name,
            sentByEmail: user.val().email,
            sentToName: '-',
            sentToMail: '-',
            sentTouid: '-',
            initiatedTime: DateString,
            opened:true
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

    let DateString = this.getTimestamp(5,30)
    let newToken = 'notify_'+DateString
    let newnotif = this.state.allNotifs[token]
    let tempnotif = {}
    console.log(newnotif)
    tempnotif['sentByEmail'] = newnotif['sentByEmail'] 
    tempnotif['sentByname'] = newnotif['sentByname'] 
    tempnotif['sentToMail'] = newnotif['sentToMail'] 
    tempnotif['sentToName'] = newnotif['sentToName'] 
    tempnotif['sentTouid'] = newnotif['sentTouid'] 
    tempnotif['sentByuid'] = newnotif['sentByuid'] 
    tempnotif['subject'] =   newnotif['subject'] 
    tempnotif['timestamp'] = newnotif['timestamp'] 
    tempnotif['initiatedTime'] = newnotif['initiatedTime'] 
    tempnotif['opened'] = true
    
    newnotif['opened'] = false
    let convoString = 'convo_'+DateString

    console.log('New notif',this.state.allNotifs)
    newnotif['conversation'][convoString] = {
      customer:true,
      message: text,
      time: ""+ date + "-"+month+"-"+year+" "+hour+":"+mins
    }
      let newdbstruct = {}
      newdbstruct['/notifications/'+token] = {}

      if(newnotif['sentTouid']==="-")
      { 
        console.log(newnotif['sentByuid'])
        newdbstruct['/users/'+ newnotif['sentByuid']+'/notifications/'+token] = {}
        newdbstruct['/users/'+ newnotif['sentByuid']+'/notifications/'+newToken] = tempnotif
      }
      else
      {
      newdbstruct['/users/'+ newnotif['sentTouid']+'/notifications/'+token] = {}
      newdbstruct['/users/'+ newnotif['sentTouid']+'/notifications/'+newToken] = tempnotif
      }
      
      newdbstruct['/notifications/'+newToken] = newnotif
      fire.database().ref().update(newdbstruct)
  

    document.getElementById("messageBox").value = ""
    
    console.log(text, uid, DateString)
  }
  
  close = () => this.setState({ open: false,  
    currentInitiated:''})

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
    
    fire.database().ref(`users/${fire.auth().currentUser.uid}/notifications/${token}/opened`).set(true);
    console.log(this.state.allNotifs, token)
    let conversations = []
    let prevDate = ""
      conversations = []

      Object.values(this.state.allNotifs[token]['conversation']).map((val)=>{
        
        if(val.time.slice(0,3)!=prevDate)
        {
          prevDate = val.time.slice(0,3)
          conversations.push(val.time.slice(0,5))
        }
        conversations.push(val)
      })
      this.setState({currentModalConvos: conversations, open:true, currentSubject: subject, currentToken: token, currentInitiated: this.state.allNotifs[token]['initiatedTime']}) 
    
    console.log(conversations)

    
  }
  
  

  getReceived() {
    var items = [];
    console.log(this.state.notifs)
    if(this.state.notifs!==null)
    for(var i=this.state.notifs.length-1; i>=0; i--)
    {
      items.push(
        <tr style={{backgroundColor: this.state.notifs[i].opened?'#fff' :'#78909c'}}>
          <td>
            <span class="mb-0 text-sm" >{this.state.notifs[i].sentByname}</span>  
          </td>
          <td>
            <span class="mb-0 text-sm" style={{fontWeight:700}}>{this.state.notifs[i].subject}</span>  
          </td>
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
    if(this.state.notifs === null)
    {
      return <Dimmer active inverted>
        <Loader inverted content='Loading' />
      </Dimmer>

    }
    else if(this.state.notifs.length === 0)
    {
      return <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
          <Header as='h2' style={{width:'100%', display:'flex', justifyContent:'center'}} block>
      No Notifications yet
  </Header>
        </div>
    }
  }
  searchBarChange(val){
    let tempnotif = []
    this.state.searchNotif.forEach(noti=>{
      if(
      noti.subject.toLowerCase().includes(val.toLowerCase()) || 
      noti.sentByname.toLowerCase().includes(val.toLowerCase()) || 
      noti.timestamp.toLowerCase().includes(val.toLowerCase())
      )
      {
        tempnotif.push(noti)
      }
    })
    console.log(val, tempnotif)
    this.setState({notifs:tempnotif})
  }
  received() {
    return (
      <div class="table-responsive">
        <div>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Your Notifications</h3>
              <div className="conversation-search">
                <input
                  type="search"
                  className="conversation-search-input"
                  placeholder="Search Notifications"
                  onChange={e => this.searchBarChange(e.target.value)}
                />
              </div>
              
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
            
            {this.loadingBar()}
          </Card>
        </div>
      </div>
    );
  }


  render() {
    console.log(this.state.allNotifs)
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
