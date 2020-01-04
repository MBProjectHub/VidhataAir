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
    approvals: {},
    myBookings: {},
    myApprovals: {},
    users: {},
    conversations:[],
    currentProgressStage:"",
    currentSelected:"",
    currentConversation:{},
    newBooking: false,
    loading: true
    }

  componentDidMount() {
    fire.database().ref('/bookings').on('value', async b => {
      await fire.database().ref('/approvals').on('value', async a => {
            await fire.database().ref('/users').on('value', u => {
              this.setState({
                approvals: a.val(),
                bookings: b.val(),
                myApprovals: u.val()[fire.auth().currentUser.uid].approvals,
                myBookings: u.val()[fire.auth().currentUser.uid].bookings,
                users: u.val()
              }, () => this.loadConvos());
        });
      });
    });
  }

  trans(stage) {
    if(stage == 1.5)
      return 'options';
    switch(stage)
    {
      case 0: return 'request';
      case 1: return 'options';
      case 2: return 'confirmation';
      case 3: return 'confirmation';
      default: return '';
    }
  }

  loadConvos() {
    let update = true;
    let threads = [];
    if(this.state.bookings && this.state.bookings.active && this.state.myBookings)
      threads = Object.keys(this.state.myBookings)
    let approves = [];
    if(this.state.approvals && this.state.myApprovals)
      approves = Object.keys(this.state.myApprovals)
    let tempConvos = [];
    let tempCur = {};
    for(var i=0; i < threads.length; i++)
    {
        let tid = threads[i];
        if(!this.state.bookings.active[tid]) {
          update = false;
          break;
        }
        let iid = this.state.bookings.active[tid].initId;
        let uid = this.state.bookings.active[tid].uid;
        let st = this.state.bookings.active[tid].Ustage;
        let h = this.state.bookings.active[tid][this.trans(st)].handler;
        let ha = this.state.bookings.active[tid][this.trans(st)].handledAt;
        let a = this.state.bookings.active[tid][this.trans(st)].arrivedAt;
        let dept = this.state.bookings.active[tid].request.details.dept;
        let arr = this.state.bookings.active[tid].request.details.arr;
        if(approves.includes(tid)) {
          uid = this.state.approvals[tid].uid;
          st = this.state.approvals[tid].Ustage;
          h = this.state.approvals[tid][this.trans(st)].handler;
          ha = this.state.approvals[tid][this.trans(st)].handledAt;
          a = this.state.approvals[tid][this.trans(st)].arrivedAt;
          dept = 'Flight Approval';
          arr = '';
        }
        if(this.state.users && this.state.users[uid]){
          tempConvos.unshift({
            threadId: tid,
            initId: iid,
            name: this.state.users[uid].name,
            department: this.state.users[uid].department,
            text: dept + ' > ' + arr,
            stage: st,
            handler: h,
            handledAt: ha,
            arrivedAt: a
          })
        }
        if(this.state.currentConversation.initId && iid.substring(1) == this.state.currentConversation.initId.substring(1))
          tempCur = tempConvos[0];
    }
    if(update && Object.keys(tempCur).length != 0) {
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
    } else if(update)
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
    let str = 'booking_' + this.getTimestamp(5,30);
    let newThread = {}
    newThread[str] = {
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
      uid : fire.auth().currentUser.uid,
      initId: '!' + str
    }
    fire.database().ref('/bookings/active').update(newThread);
    let temp = {};
    temp[str] = '-';
    fire.database().ref('/users/'+fire.auth().currentUser.uid+'/bookings').update(temp);
    this.setState({ newBooking: true, loading: true });
  }

  ClickRequest(conversation)
  {
    if(conversation.initId.charAt(0) == '!')
      fire.database().ref('/bookings/active/'+conversation.threadId).update({ initId: '_' + conversation.initId.substring(1) })

    console.log(conversation)
    this.state.conversations.forEach(conversation => {
      document.getElementById(conversation.threadId).style.background = "#fff"
      });
      document.getElementById(conversation.threadId).style.background = "#eeeef1"
      this.setState({currentSelected:conversation.threadId, currentProgressStage:conversation.stage, currentConversation: conversation});
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
  let cur = this.state.bookings.active[this.state.currentSelected];

  if(label == steps[0]) {
    fire.database().ref('/bookings/active/'+this.state.currentSelected).update({ Ustage: 0 });
    if(this.state.currentProgressStage != 0)
      this.setState({ loading: true });
    } else if(label == steps[1] && this.state.bookings.active[this.state.currentSelected].options.opts) {
    fire.database().ref('/bookings/active/'+this.state.currentSelected).update({ Ustage: 1 });
    if(this.state.currentProgressStage != 1)
      this.setState({ loading: true });
    } else if(label == steps[2] && cur && cur.confirmation.details != '-' && cur.options.status != 3 && cur.options.status != -1 && cur.options.status != 0) {
      fire.database().ref('/bookings/active/'+this.state.currentSelected).update({ Ustage: 2 });
      if(this.state.currentProgressStage != 2)
        this.setState({ loading: true });
    } else if(label == steps[3] && this.state.currentProgressStage == 2) {
      fire.database().ref('/bookings/active/'+this.state.currentSelected).update({ Ustage: 3 });
      if(this.state.currentProgressStage != 3)
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
        <StepLabel label= {{color:'#fff'}} style={{color:'#fff', cursor:'pointer'}} onClick={() => this.stageClick(label)}>
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
      <RequestForm editable={true} load={() => this.setState({ loading: true })} data={{ ...this.state.currentConversation, bookings: this.state.bookings }} />
    </div>
    }
    else if(conversation.stage == 1)
      return <Options approver={false} load={() => this.setState({ loading: true })} data={{ ...this.state.currentConversation, bookings: this.state.bookings }} />
    else if(conversation.stage == 1.5)
      return <Options approver={true} load={() => this.setState({ loading: true })} data={{ ...this.state.currentConversation, bookings: this.state.bookings }} />
    else
    {
      return <div style={{height:'70%',paddingTop:'3%',marginTop:'2%',marginBottom:'2%', paddingBottom:'3%', overflowY:'scroll', width:'100%'}}>
        <ConfirmationForm editable={false} load={() => this.setState({ loading: true })} data={{ ...this.state.currentConversation, bookings: this.state.bookings }} />
    </div>
    }
  }

  loadStage()
  {
    if(this.state.currentSelected!=="")
    {
      let name = '-';
      if(this.state.users && this.state.currentConversation.handler != '-')
        name = this.state.users[this.state.currentConversation.handler].name;
      return <div style={{width:'100%',height: window.innerHeight, position:'relative'}}>
      <Container style={{padding:0}}>
        <Row  style={{height:'30%',backgroundColor:'#FAFAFA', boxShadow: '0 5px 5px rgba(0,0,0,0.22)', marginRight:0, marginLeft:0, paddingTop: 10}}>
          <Col>
          <ProfileCard data={this.state.currentConversation} name={name} />
          </Col>
          <Col>
          <div>
          {this.state.currentProgressStage == 1.5? '' : this.renderProgressBar()}
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
          <div style={{ height: 60, width: 2, backgroundColor: '#0F2972', margin: '5%', marginRight: '3%' }} />
          <div>
            <div className="conversation-info">
              <h1 className="conversation-title" style={{ fontWeight: conversation.initId.charAt(0) == '!'? 900 : 500 }}>{ conversation.name }</h1>
              <span className="text-primary mr-2" style={{ fontSize: 12, fontWeight: conversation.initId.charAt(0) == '!'? 900 : 300 }}>
                {conversation.threadId.split('_')[3]+'-'+conversation.threadId.split('_')[2]+'-'+conversation.threadId.split('_')[1]}
              </span>
              <p className="conversation-snippet" style={{ fontWeight: conversation.initId.charAt(0) == '!'? 900 : 300 }}>{ conversation.text }</p>
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
