import React from 'react';
import { Step, Stepper, StepLabel, LinearProgress } from '@material-ui/core';
import {Row, Col, Container, Button } from 'reactstrap'

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './Messenger.css';
import ConversationSearch from '../ConversationSearch';
import '../ConversationList.css';
import '../ConversationListItem.css';
import ProfileCard from '../ProfileCard'
import RequestForm from '../RequestForm'
import ConfirmationForm from '../ConfirmationForm'
import Options from '../Options'
import fire from '../../config/firebaseConfig';

export default class Messenger extends React.Component {
  state = {
    bookings: {},
    conversations:[],
    currentProgressStage:"",
    currentSelected:"",
    currentConversation:{},
    newBooking: false,
    loading: true
    }

  componentDidMount() {
    fire.database().ref('/bookings').on('value', snapshot => {
      this.setState({ bookings: snapshot.val() }, () => this.loadConvos());
    });
  }

  trans(stage) {
    switch(stage)
    {
      case 0: return 'request';
      case 1: return 'options';
      case 2: return 'confirmation';
      default: return '';
    }
  }

  async loadConvos() {
    let threads = Object.keys(this.state.bookings.active)
    let tempConvos = [];
    let tempCur = {};
    for(var i=0; i < threads.length; i++)
    {
        let tid = threads[i];
        let uid = this.state.bookings.active[tid].uid;
        let st = this.state.bookings.active[tid].Ustage;
        let h = this.state.bookings.active[tid][this.trans(st)].handler;
        let ha = this.state.bookings.active[tid][this.trans(st)].handledAt;
        let a = this.state.bookings.active[tid][this.trans(st)].arrivedAt;
        let dept = this.state.bookings.active[tid].request.details.dept;
        let arr = this.state.bookings.active[tid].request.details.arr;
        await fire.database().ref('/users/'+uid).once('value', snapshot => {
          tempConvos.unshift({
            threadId: tid,
            name: snapshot.val().name,
            text: dept + ' > ' + arr,
            stage: st,
            handler: h,
            handledAt: ha,
            arrivedAt: a
          })
        });
        if(tid == this.state.currentConversation.threadId)
          tempCur = tempConvos[0];
    }
    if(Object.keys(tempCur).length != 0) {
      this.setState({
        conversations: tempConvos,
        currentSelected: tempCur.threadId,
        currentProgressStage: tempCur.stage,
        currentConversation: tempCur,
        loading: false
      }, () => {
        if(this.state.newBooking)
          this.setState({
            newBooking: false,
            currentSelected: this.state.conversations[0].name,
            currentProgressStage: this.state.conversations[0].stage,
            currentConversation: this.state.conversations[0]
          });
      });
    } else
      this.setState({
        conversations: tempConvos,
        loading: false
      }, () => {
        if(this.state.newBooking)
          this.setState({
            newBooking: false,
            currentSelected: this.state.conversations[0].name,
            currentProgressStage: this.state.conversations[0].stage,
            currentConversation: this.state.conversations[0]
          });
      });
  }

  newBooking() {
    let newThread = {}
    newThread['booking_' + this.getTimestamp(5,30)] = {
      confirmation : {
        arrivedAt : '-',
        details : '-',
        handledAt : '-',
        handler : '-'
      },
      options : {
        arrivedAt : '-',
        choice : -1,
        handledAt : '-',
        handler : '-',
        status : -1
      },
      request : {
        arrivedAt : '-',
        details : '-',
        handledAt : '-',
        handler : '-'
      },
      Estage: -1,
      Ustage : 0,
      uid : 'uid1' // fire.auth().currentUser.uid
    }
    fire.database().ref('/bookings/active').update(newThread);
    this.setState({ newBooking: true, loading: true })
  }

  ClickRequest(conversation)
  {
    this.state.conversations.forEach(conversation => {
      document.getElementById(conversation.threadId).style.background = "#fff"
      });
      document.getElementById(conversation.threadId).style.background = "#eeeef1"
      this.setState({currentSelected:conversation.threadId, currentProgressStage:conversation.stage, currentConversation: conversation})
  }

  MouseOverRequest(conversation)
  {
    if(this.state.currentSelected!==conversation.threadId)
      document.getElementById(conversation.threadId).style.background = "#eeeef1"
  }

  MouseOutRequest(conversation)
  {
    if(this.state.currentSelected!==conversation.threadId)
      document.getElementById(conversation.threadId).style.background = "#fff"
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

  stageClick(label) {
  let steps = ['Initiate Request', 'Flight Options', 'Booking Confirmation', 'Booking Complete'];

  if(label == steps[0]) {
    fire.database().ref('/bookings/active/'+this.state.currentConversation.threadId).update({ Ustage: 0 });
    if(this.state.currentProgressStage != 0)
      this.setState({ loading: true });
    }
  else if(label == steps[1] && this.state.bookings.active[this.state.currentConversation.threadId].options.opts) {
    fire.database().ref('/bookings/active/'+this.state.currentConversation.threadId).update({ Ustage: 1 });
    if(this.state.currentProgressStage != 1)
      this.setState({ loading: true });
    }
}

  renderProgressBar()
  {
    const theme = createMuiTheme({
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        color:'#fff'
      },
    });

    let steps = ['Initiate Request', 'Flight Options', 'Booking Confirmation', 'Booking Complete'];
    if(this.state.currentProgressStage==="")
    return
    else
    {
      return <ThemeProvider  theme={theme}>
        <Stepper style={{height:100, padding:10, backgroundColor:'transparent'}} alternativeLabel activeStep={this.state.currentProgressStage}>
      {steps.map(label => (
        <Step  key={label}>
        <StepLabel label= {{color:'#fff'}} style={{color:'#fff'}} onClick={() => this.stageClick(label)}>
          {label}
        </StepLabel>
        </Step>
      ))}
    </Stepper>
    </ThemeProvider>
    }
  }

  loadContent(conversation)
  {
    if(conversation.stage == 0)
    {
      return <div style={{height:'70%',paddingTop:'3%',marginTop:'2%',marginBottom:'2%', paddingBottom:'3%', overflowY:'scroll', width:'100%'}}>
      <RequestForm editable={true} data={this.state.currentConversation} />
    </div>
    }
    else if(conversation.stage == 1)
      return <Options data={this.state.currentConversation} />
    else
    {
      return <div style={{height:'70%',paddingTop:'3%',marginTop:'2%',marginBottom:'2%', paddingBottom:'3%', overflowY:'scroll', width:'100%'}}>
        <ConfirmationForm editable={true}/>
    </div>
    }
  }

  loadStage()
  {
    if(this.state.currentSelected!=="")
    {
      return <div style={{width:'100%',height: window.innerHeight, position:'relative'}}>
      <Container style={{padding:0}}>
        <Row  style={{height:'30%',backgroundColor:'#FAFAFA', boxShadow: '0 5px 5px rgba(0,0,0,0.22)', marginRight:0, marginLeft:0, paddingTop: 10}}>
          <Col>
          <ProfileCard data={this.state.currentConversation} />
          </Col>
          <Col>
          <div>
          {this.renderProgressBar()}
          </div>
          </Col>
        </Row>
        </Container>

        {this.loadContent(this.state.currentConversation)}

        <div  style={{position:'absolute', zIndex: 10, bottom :0 , width:'100%',height:'9%', backgroundColor:'#FAFAFA', boxShadow: '0 -10px 15px -10px rgba(0,0,0,0.22)'}}>
        </div>
    </div>
    }
  }

  loadLeftPane() {
      return this.state.conversations.map(conversation =>
        <div
          id={conversation.threadId}
          className="conversation-list-item"
          style={{ display: 'flex', flexDirection: 'row' }}
          onClick={this.ClickRequest.bind(this, conversation)}
          onMouseOver = {this.MouseOverRequest.bind(this,conversation)}
          onMouseOut = {this.MouseOutRequest.bind(this,conversation)}
        >
          <div style={{ height: 50, width: 2, backgroundColor: '#0F2972', margin: '5%', marginRight: '3%' }} />
          <div>
            <div className="conversation-info">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h1 className="conversation-title">{ conversation.name }</h1>
                <span className="text-primary mr-2" style={{ position: 'absolute', right: '8%', fontSize: 12 }}>
                  {conversation.threadId.split('_')[3]+'-'+conversation.threadId.split('_')[2]+'-'+conversation.threadId.split('_')[1]}
                </span>
              </div>
              <p className="conversation-snippet">{ conversation.text }</p>
            </div>
          </div>
        </div>
      )
    }

  render()
  {
    return (
      <div className="messenger" style={{height: window.innerHeight, width:'100%'}}>

        <div className="scrollable sidebar" style={{height: window.innerHeight, width:'25%'}}>
        <div className="conversation-list">
          <Button color="primary" type="button" onClick={() => this.newBooking()} style={{ margin: '5%', marginBottom: 0 }}>
            New Booking
          </Button>
          <ConversationSearch placeholder="Search Bookings"/>
          {this.state.loading?<LinearProgress />:''}
          {this.loadLeftPane()}
        </div>
        </div>
          {this.loadStage()}
      </div>
    );
  }
}
