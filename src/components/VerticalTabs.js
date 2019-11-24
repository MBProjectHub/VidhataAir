import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default class VerticalTabs extends React.Component{
  state = {value:0, requests:{
    0:{title:'hi', request:'qwerty1'},
    1:{title:'hi1', request:'qwerty2'},
    2:{title:'hi2', request:'qwerty3'},
    3:{title:'hi3', request:'qwerty4'},
    4:{title:'hi4', request:'qwerty5'},
    5:{title:'hi5', request:'qwerty6'},
    6:{title:'hi6', request:'qwerty7'},}}

  handleChange = (event, newValue) => {
    console.log("newValue", newValue)
    this.setState({value:newValue});
  };

  render(){
  return (
    <div style={{
      backgroundColor: '#fff',
      display: 'flex',
    }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={this.state.value}
        onChange={this.handleChange}
        aria-label="Vertical tabs example"
        style={{
          width: '30%',
          height: window.innerHeight*0.7,
          borderRightWidth: 1,
          borderRightStyle: 'solid',
          borderRightColor: '#00000020'
        }}
      >

        
        <Tab label="Item One"  style={{maxWidth:'100%'}}/>
        <Tab label={
              <React.Fragment>
               <span style={{ fontSize: 24 }}>T1 Label2</span>
                <span style={{ fontSize: "smaller" }}>T1 Label2</span>
              </React.Fragment>
            }  style={{maxWidth:'100%'}}/>
        
 
      </Tabs>
      <div style={{width:'70%', padding:'2%'}}>
        {this.state.requests[this.state.value].title}
      </div>
    </div>
  );
  }
}
