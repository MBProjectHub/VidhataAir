import React from "react";
import fire from '../config/firebaseConfig';
// reactstrap components
import {
  Button,
  Alert
} from "reactstrap";

import { Input } from 'semantic-ui-react';

class Options extends React.Component {

  state = {
    cardOptions:[],
    data : {
      opts: [],
      choice: -1,
      status: 1
    }
  }

  componentDidMount() {
    fire.database().ref(
      '/bookings/active/'+this.props.data.threadId+'/options').once(
        'value', snapshot => {
          if(snapshot.val() != '-' && snapshot.val())
          {
            var temp = snapshot.val();
            if(!temp.opts)
              temp['opts'] = [];
            this.setState({ data: temp, cardOptions: [] }, () => {
              for(var i=0; i < this.state.data.opts.length; i++)
                this.addOption(this.state.cardOptions, i, false);
            });
          }
        }
      )
  }

  shouldComponentUpdate() {
    if (this.props.update[0] < 2) {
      this.props.update[0] += 1;
      return true
    }
    return false;
  }

  componentDidUpdate() {
    fire.database().ref(
      '/bookings/active/'+this.props.data.threadId+'/options').once(
        'value', snapshot => {
          if(snapshot.val() != '-' && snapshot.val())
          {
            var temp = snapshot.val();
            if(!temp.opts)
              temp['opts'] = [];
            this.setState({ data: temp, cardOptions: [] }, () => {
              for(var i=0; i < this.state.data.opts.length; i++)
                this.addOption(this.state.cardOptions, i, false);
            });
          }
        }
      )
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
          <Button color={this.state.data.status == 2?"success":"secondary"} type="button" onClick={() => this.selHandler(this.state.data.choice, 2)} style={{ padding: '3%', width: '40%', borderRadius: 50 }}>
            <i className="fa fa-thumbs-up" />{'\t'}Approve
          </Button>
          <Button color={this.state.data.status == 3?"danger":"secondary"} type="button" onClick={() => this.selHandler(this.state.data.choice, 3)} style={{ marginLeft: '5%', width: '40%', padding: '3%', borderRadius: 50 }}>
            <i className="fa fa-thumbs-down" />{'\t'}Reject
          </Button>
        </div>
      );
    }
    if(cardId === this.state.data.choice)
    {
      if(this.state.data.status == 1) {
        return (
          <div>
            <Alert color="info" style={{ marginTop: '3%', textAlign: 'center' }}>
              <img src={require('../assets/img/icons/common/tick.png')} style={{width:15, height:15, marginRight: 10}} />
              Selected Flight Option
            </Alert>
          </div>
        );
      } else if(this.state.data.status == 2) {
        return (
          <div>
            <Alert color="success" style={{ marginTop: '3%', textAlign: 'center' }}>
              <i className="fa fa-thumbs-up" style={{ marginRight: 10 }} />
              Flight Option Approved
            </Alert>
          </div>
        );
      } else if(this.state.data.status == 3) {
        return (
          <div>
            <Alert color="danger" style={{ marginTop: '3%', textAlign: 'center' }}>
              <i className="fa fa-thumbs-down" style={{ marginRight: 10 }} />
              Flight Option Rejected
            </Alert>
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
      fire.database().ref('/bookings/active/'+this.props.data.threadId).once('value', async snapshot => {
        let newData = snapshot.val();
        newData.options.choice = ch;
        newData.options.status = stat;
        let timestamp = this.getTimestamp(5,30);
        let temp = timestamp.split('_');
        let formatted = temp[2]+'-'+temp[1]+'-'+temp[0]+' '+temp[3]+':'+temp[4];
        newData.options.arrivedAt = formatted;

        let temp_b = {}
        let temp_a = {}

        temp_b['booking_'+timestamp] = newData;
        temp_a['booking_'+timestamp] = { Ustage: 1.5, uid: this.props.data.bookings.active[this.props.data.threadId].uid, options: newData.options };

        await fire.database().ref('/bookings/active/'+this.props.data.threadId).set({});
        await fire.database().ref('/approvals/'+this.props.data.threadId).set({});

        await fire.database().ref('bookings/active').update(temp_b);
        await fire.database().ref('/approvals').update(temp_a);

        this.props.updateId('booking_'+timestamp);
      });
      // add to approver's personal list and same to threadList
    }
    else {
      fire.database().ref(
        '/bookings/active/'+this.props.data.threadId+'/options')
        .update({ choice: -1, status: 0 });
      fire.database().ref(
        '/bookings/active/'+this.props.data.threadId).update({ Estage: 1 });
      fire.database().ref('/approvals/'+this.props.data.threadId).set({});
      // remove from approver's personal list and ThreadList
    }
  }

  addOption(arr, i, updateOpts) {
    let cardOptions = arr;
    let opts = this.state.data.opts;
    if(updateOpts)
      opts.push({});
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
            <Input id={i} style={{width:'50%', marginRight:'5%'}} label='From' placeholder='Departure City'
              onChange={e => { opts[e.target.getAttribute('id')]['dept'] = e.target.value; console.log(opts); this.forceUpdate(); }}
              defaultValue={this.state.data.opts[i].dept}
            />
            <Input id={i} style={{width:'50%'}} label='To' placeholder='Arrival City'
              onChange={e => { opts[e.target.getAttribute('id')]['arr'] = e.target.value; this.forceUpdate(); }}
              defaultValue={this.state.data.opts[i].arr}
            />
          </div>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:'3%'}}>
            <div style={{alignItems:'center', width: '50%', marginTop:'3%', marginRight: '5%'}}>
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Date' placeholder='Date'
                onChange={e => { opts[e.target.getAttribute('id')]['date'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].date}
              />
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Time' placeholder='HH:MM'
                onChange={e => { opts[e.target.getAttribute('id')]['time'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].time}
              />
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Fare' placeholder='Price'
                onChange={e => { opts[e.target.getAttribute('id')]['fare'] = e.target.value; this.forceUpdate(); }}
                defaultValue={this.state.data.opts[i].fare}
              />
            </div>
            <div style={{alignSelf: 'flex-start', width: '50%', marginTop:'3%'}}>
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

    if(updateOpts) {
      let temp = this.state.data;
      temp['opts'] = opts;
      this.setState({ cardOptions:cardOptions, data: temp });
    }
    else
      this.setState({ cardOptions:cardOptions }, () => console.log(this.state.cardOptions));
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
