import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
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
    currentConversation:{}
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
    for(var i=0; i < threads.length; i++)
    {
        let tid = threads[i];
        let uid = this.state.bookings.active[tid].uid;
        let st = this.state.bookings.active[tid].stage;
        let h = this.state.bookings.active[tid][this.trans(st)].handler;
        let ha = this.state.bookings.active[tid][this.trans(st)].handledAt;
        let a = this.state.bookings.active[tid][this.trans(st)].arrivedAt;
        await fire.database().ref('/users/'+uid).once('value', snapshot => {
          tempConvos.push({
            threadId: tid,
            photo: "https://randomuser.me/api/portraits/men/54.jpg",
            name: snapshot.val().name,
            text: snapshot.val().company,
            stage: st,
            handler: h,
            handledAt: ha,
            arrivedAt: a
          })
        });
    }
    this.setState({ conversations: tempConvos });
  }

  ClickRequest(conversation)
  {
    this.state.conversations.forEach(conversation => {
      document.getElementById(conversation.name).style.background = "#fff"
      });
      document.getElementById(conversation.name).style.background = "#eeeef1"
      this.setState({currentSelected:conversation.name, currentProgressStage:conversation.stage, currentConversation: conversation})
  }

  MouseOverRequest(conversation)
  {
    if(this.state.currentSelected!==conversation.name)
      document.getElementById(conversation.name).style.background = "#eeeef1"
  }

  MouseOutRequest(conversation)
  {
    if(this.state.currentSelected!==conversation.name)
      document.getElementById(conversation.name).style.background = "#fff"
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
        <StepLabel label= {{color:'#fff'}} style={{color:'#fff'}} onClick={()=>{console.log("hi")}}>
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
        <Button color="primary" type="button" style={{position:'absolute',right:'5%', bottom:'10%'}}>
          Handle Request
        </Button>
        </div>
    </div>

    }
  }

  render()
  {
    return (
      <div className="messenger" style={{height: window.innerHeight, width:'100%'}}>

        <div className="scrollable sidebar" style={{height: window.innerHeight, width:'25%'}}>
        <div className="conversation-list">
          <ConversationSearch placeholder="Search Bookings"/>
          {
            this.state.conversations.map(conversation =>
              <div id={conversation.name} className="conversation-list-item"
                onClick={this.ClickRequest.bind(this, conversation)}
                onMouseOver = {this.MouseOverRequest.bind(this,conversation)}
                onMouseOut = {this.MouseOutRequest.bind(this,conversation)}>

                <img className="conversation-photo" src={conversation.photo} alt="conversation" />
                <div className="conversation-info">
                  <h1 className="conversation-title">{ conversation.name }</h1>
                  <p className="conversation-snippet">{ conversation.text }</p>
                </div>

              </div>
            )
          }
        </div>
        </div>
          {this.loadStage()}

      </div>
    );
  }
}
