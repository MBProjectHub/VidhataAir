import React from "react";
import fire from '../config/firebaseConfig';
// reactstrap components
import {
  Button,
  Alert
} from "reactstrap";

import { Input, Message, Icon } from 'semantic-ui-react';

class Options extends React.Component {

  state = {
    cardOptions:[],
    approver: '',
    data : {
      opts: [],
      choice: -1,
      status: 1
    }
  
  }

  componentDidMount() {
    let temp = this.props.data.bookings.active[this.props.data.threadId];
    if(temp && temp.options != '-')
    {
        var data = temp.options;
        if(!data.opts)
          data['opts'] = [];
        fire.database().ref('/users/'+this.props.data.bookings.active[this.props.data.threadId].uid).once('value', snapshot => {
          this.setState({ data: data, approver: snapshot.val().approver }, () => {
            let cardOptions = [];
            for(var i=0; i < this.state.data.opts.length; i++)
              this.addOption(cardOptions, i);
            this.setState({ cardOptions:cardOptions });
          });
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps != this.props) {
      let temp = this.props.data.bookings.active[this.props.data.threadId];
      if(temp && temp.options != '-')
      {
          var data = temp.options;
          if(!data.opts)
            data['opts'] = [];
            fire.database().ref('/users/'+this.props.data.bookings.active[this.props.data.threadId].uid).once('value', snapshot => {
              this.setState({ data: data, approver: snapshot.val().approver }, () => {
                let cardOptions = [];
                for(var i=0; i < this.state.data.opts.length; i++)
                  this.addOption(cardOptions, i);
                this.setState({ cardOptions:cardOptions });
              });
            });
      }
    }
  }

  renderBookingOptions()
  {
    if(this.props.approver) {
      return this.state.cardOptions[this.state.data.choice];
    }
    return this.state.cardOptions.map(cards => {
      return cards
    })
  }

  cardStatus(cardId) {
    if(this.props.approver) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3%', justifyContent: 'center' }}>
          <Button color="success" type="button" onClick={() => this.selHandler(this.state.data.choice, 2)} style={{ padding: '3%', width: '40%', borderRadius: 50 }}>
            <i className="fa fa-thumbs-up" />{'\t'}Approve
          </Button>
          <Button color="danger" type="button" onClick={() => this.selHandler(this.state.data.choice, 3)} style={{ marginLeft: '5%', width: '40%', padding: '3%', borderRadius: 50 }}>
            <i className="fa fa-thumbs-down" />{'\t'}Reject
          </Button>
        </div>
      );
    }
    if(cardId === this.state.data.choice)
    {
      if(this.state.data.status == 1) {
        return (
          <div style={{ marginTop: '3%', textAlign: 'center' }}>
            <Message info>
    <Message.Content>
      <Message.Header>Selected Flight Option</Message.Header>
    </Message.Content>
  </Message>
  </div>
        );
      } else if(this.state.data.status == 2) {
        return (
          <div style={{ marginTop: '3%', textAlign: 'center' }}>
            <Message positive>
    <Message.Content>
      <Message.Header> Flight Option Approved</Message.Header>
    </Message.Content>
  </Message>
  </div>
        );
      } else if(this.state.data.status == 3) {
        return (
          <div style={{ marginTop: '3%', textAlign: 'center' }}>
            <Message negative>
    <Message.Content>
      <Message.Header> Flight Option Rejected</Message.Header>
    </Message.Content>
  </Message>
  </div>
        );
      }
    }
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

  selHandler(ch, stat) {
    if(this.props.approver || this.state.data.choice != ch) {
      this.props.load();
      let newData = this.props.data.bookings.active[this.props.data.threadId];
      newData.options.choice = ch;
      newData.options.status = stat;
      if (stat == 3) {
        newData.Ustage = 1;
        newData.Estage = 1;
      }
      if(this.state.data.opts[ch].remarks)
        newData.options.opts[ch].remarks = this.state.data.opts[ch].remarks;
      let timestamp = this.getTimestamp(5,30);
      let temp = timestamp.split('_');
      let formatted = temp[2]+'-'+temp[1]+'-'+temp[0]+' '+temp[3]+':'+temp[4];
      newData.options.arrivedAt = formatted;

      let user = this.state.approver;
      let userVal1 = '-';
      let userVal2 = '-';
      let userVal3 = { Ustage: 1.5, uid: this.props.data.bookings.active[this.props.data.threadId].uid, options: newData.options };
      let userVal4 = 'booking_'+timestamp;
      if(this.props.approver) {
        user = fire.auth().currentUser.uid;
        userVal1 = {};
        userVal2 = {};
        userVal3 = {};
        userVal4 = '';
      }

      temp = {};
      temp['/users/'+newData.uid+'/bookings/'+this.props.data.threadId] = {};
      temp['/users/'+newData.uid+'/bookings/'+'booking_'+timestamp] = '-';

      if(user != '-') {
        temp['/users/'+user+'/bookings/'+this.props.data.threadId] = {};
        temp['/users/'+user+'/bookings/'+'booking_'+timestamp] = userVal1;
        temp['/users/'+user+'/approvals/'+this.props.data.threadId] = {};
        temp['/users/'+user+'/approvals/'+'booking_'+timestamp] = userVal2;
      }
      else
        newData.options.status = 2;

      temp['/bookings/active/'+this.props.data.threadId] = {};
      temp['/bookings/active/'+'booking_'+timestamp] = newData;

      temp['/approvals/'+this.props.data.threadId] = {};
      temp['/approvals/'+'booking_'+timestamp] = userVal3;

      fire.database().ref().update(temp);
      this.props.updateId(userVal4);
    }
    else {
      let newData = this.props.data.bookings.active[this.props.data.threadId];
      newData.options.choice = -1;
      newData.options.status = 0;
      newData.Estage = 1;

      let timestamp = this.getTimestamp(5,30);
      let temp = timestamp.split('_');
      let formatted = temp[2]+'-'+temp[1]+'-'+temp[0]+' '+temp[3]+':'+temp[4];
      newData.options.arrivedAt = formatted;

      temp ={}
      temp['/users/'+newData.uid+'/bookings/'+this.props.data.threadId] = {};
      temp['/users/'+newData.uid+'/bookings/'+'booking_'+timestamp] = '-';

      temp['/bookings/active/'+this.props.data.threadId] = {};
      temp['/bookings/active/'+'booking_'+timestamp] = newData;

      temp['/approvals/'+this.props.data.threadId] = {};
      temp['/users/'+this.state.approver+'/bookings/'+this.props.data.threadId] = {};
      temp['/users/'+this.state.approver+'/approvals/'+this.props.data.threadId] = {};
      fire.database().ref().update(temp);
      this.props.updateId('booking_'+timestamp);
    }
  }

  addOption(arr, i) {
    let cardOptions = arr;
    let opts = this.state.data.opts;
    cardOptions.push(
    <div>
      <a class="ui card" style={{ background:'#fff', width:'90%', boxShadow:'0 5px 9px 0 #fafafa, 0 0 0 1px #fafafa', marginBottom:'3%'}}>
        <div class="content">
          <div style={{display:'flex', flexDirection:'row', alignItems:'center' }}>
            <div class="header" style={{ marginTop: 0 }}><b>Flight Option</b></div>
            {this.props.approver ? '' : <button id={i} class="ui positive button" onClick={e => this.selHandler(Number(e.target.getAttribute('id')), 1)}
              style={{ marginLeft: '65%', marginTop: 0, backgroundColor: (this.state.data.choice != i)?'#79E19D':'#ff726f', paddingTop: 6, paddingBottom: 7 }}>
                {(this.state.data.choice != i)?'Select':'Deselect'}
            </button>}
          </div>
          <div style={{display:'flex', flexDirection:'row',alignItems:'center', marginTop:'3%'}}>
            <Input readOnly id={i} style={{width:'50%', marginRight:'5%'}} label='From' placeholder='Departure City'
              onChange={e => { opts[e.target.getAttribute('id')]['dept'] = e.target.value; this.forceUpdate(); }}
              defaultValue={this.state.data.opts[i].dept}
            />
            <Input readOnly id={i} style={{width:'50%'}} label='To' placeholder='Arrival City'
              onChange={e => { opts[e.target.getAttribute('id')]['arr'] = e.target.value; this.forceUpdate(); }}
              defaultValue={this.state.data.opts[i].arr}
            />
          </div>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:'3%'}}>
            <div style={{alignItems:'center', width: '50%', marginTop:'3%', marginRight: '5%'}}>
              <Input readOnly id={i} style={{width:'100%', marginBottom: '3%'}} label='Date' placeholder='Date'
                onChange={e => { opts[e.target.getAttribute('id')]['date'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].date}
              />
              <Input readOnly id={i} style={{width:'100%', marginBottom: '3%'}} label='Time' placeholder='HH:MM'
                onChange={e => { opts[e.target.getAttribute('id')]['time'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].time}
              />
              <Input readOnly id={i} style={{width:'100%', marginBottom: '3%'}} label='Fare' placeholder='Price'
                onChange={e => { opts[e.target.getAttribute('id')]['fare'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].fare}
              />
              <Input readOnly id={i} style={{width:'100%', marginBottom: '3%'}} label='Airline' placeholder='Airline'
                onChange={e => { opts[e.target.getAttribute('id')]['airline'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].airline}
              />
            </div>
            <div style={{alignSelf: 'flex-start', width: '50%', marginTop:'3%'}}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Remarks</span>
              <textarea id={i} class="form-control" rows="3" placeholder="Remarks" style={{ marginTop: '3%', color:'black' }}
                onChange={e => { opts[e.target.getAttribute('id')]['remarks'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].remarks}
              />
              {this.cardStatus(i)}
            </div>
          </div>
        </div>
      </a>
    </div>);
  }

  render() {
    return(
      <div style={{height:'75%', marginBottom:'2%',paddingLeft:'7%', paddingTop:'4%', paddingBottom:'4%', overflowY:'scroll', width:'100%',backgroundColor:'#f8f9fe'}}>
        {this.renderBookingOptions()}
      </div>
      );
    }
  }


export default Options;
