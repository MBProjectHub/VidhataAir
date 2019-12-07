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
      '/bookings/active/'+this.props.data.threadId+'/options').on(
        'value', snapshot => {
          if(snapshot.val() != '-')
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
    return this.state.cardOptions.map(cards=>{
      return cards
    })
  }

  cardStatus(cardId) {
    if(cardId === this.state.data.choice)
    {
      if(this.state.data.status == 1) {
        return (
          <div>
            <Alert color="success" style={{ marginTop: '3%', textAlign: 'center' }}>
              <img src={require('../assets/img/icons/common/tick.png')} style={{width:15, height:15, marginRight: 10}}/>
              Selected Flight Option
            </Alert>
          </div>
        );
        /*
        // For Boss Approval
        return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3%', justifyContent: 'center' }}>
          <Button color="success" type="button" onClick={() => this.status(2)} style={{ padding: '3%', width: '40%', borderRadius: 50 }}>
            <i className="fa fa-thumbs-up" />{'\t'}Approve
          </Button>
          <Button color="danger" type="button" onClick={() => this.status(3)} style={{ marginLeft: '5%', width: '40%', padding: '3%', borderRadius: 50 }}>
            <i className="fa fa-thumbs-down" />{'\t'}Reject
          </Button>
        </div>
      );*/
      } else if(this.state.data.status == 2) {
        return (
          <div>
            <Alert color="info" style={{ marginTop: '3%', textAlign: 'center' }}>
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

  selHandler(ch) {
    if(this.state.data.choice != ch)
      fire.database().ref(
        '/bookings/active/'+this.props.data.threadId+'/options')
        .update({ choice: ch, status: 1 });
    else
      fire.database().ref(
        '/bookings/active/'+this.props.data.threadId+'/options')
        .update({ choice: -1, status: 0 });
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
            <button id={i} class="ui positive button" onClick={e => this.selHandler(e.target.getAttribute('id'))}
              style={{ marginLeft: '65%', marginTop: 0, backgroundColor: (this.state.data.choice != i)?'#79E19D':'#ff726f', paddingTop: 6, paddingBottom: 7 }}>
                {(this.state.data.choice != i)?'Select':'Deselect'}
            </button>
          </div>
          <div style={{display:'flex', flexDirection:'row',alignItems:'center', marginTop:'3%'}}>
            <Input id={i} style={{width:'50%', marginRight:'5%'}} label='From' placeholder='Departure City'
              onChange={e => { opts[e.target.getAttribute('id')]['dept'] = e.target.value }}
              value={this.state.data.opts[i].dept}
            />
            <Input id={i} style={{width:'50%'}} label='To' placeholder='Arrival City'
              onChange={e => { opts[e.target.getAttribute('id')]['arr'] = e.target.value }}
              value={this.state.data.opts[i].arr}
            />
          </div>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:'3%'}}>
            <div style={{alignItems:'center', width: '50%', marginTop:'3%', marginRight: '5%'}}>
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Date' placeholder='Date'
                onChange={e => { opts[e.target.getAttribute('id')]['date'] = e.target.value }}
                value={this.state.data.opts[i].date}
              />
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Time' placeholder='HH:MM'
                onChange={e => { opts[e.target.getAttribute('id')]['time'] = e.target.value }}
                value={this.state.data.opts[i].time}
              />
              <Input id={i} style={{width:'100%', marginBottom: '3%'}} label='Fare' placeholder='Price'
                onChange={e => { opts[e.target.getAttribute('id')]['fare'] = e.target.value }}
                value={this.state.data.opts[i].fare}
              />
            </div>
            <div style={{alignSelf: 'flex-start', width: '50%', marginTop:'3%'}}>
              <textarea id={i} class="form-control" rows="3" placeholder="Remarks" style={{ marginTop: '3%' }}
                onChange={e => { opts[e.target.getAttribute('id')]['remarks'] = e.target.value }}
                value={this.state.data.opts[i].remarks}
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
      this.setState({ cardOptions:cardOptions });
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
