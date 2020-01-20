import React from "react";

import fire from './config/firebaseConfig';

import { Message } from 'semantic-ui-react'
export default class App extends React.Component
{
    state={approved:null, pending: null, rejected:null, loadingStatus:null}
    componentDidMount()
    {
        fire.auth().onAuthStateChanged((user) => {
            if(user)
            {
                let domain = fire.auth().currentUser.email.split('@')[1].replace('.','^').toLowerCase()
                fire.database().ref('signup').on('value',(domains)=>{
                    if(domains.val() && domains.val()['apprDom'] && domains.val()['apprDom'][domain])
                    {
                        this.props.history.push('/admin/bookings')
                    }
                    else if(domains.val() && domains.val()['rejDom'] && domains.val()['rejDom'][domain])
                    {
                        this.setState({loadingStatus:'rejected'})
                    }
                    else
                    {
                        this.setState({loadingStatus:'pending'})
                    }
                  })

            }
            else
            {
                this.props.history.push('/auth/login')
            }
          })

    }
    renderLoading()
    {
        if(this.state.loadingStatus===null)
        {
            return (
                <div className="bg-gradient-info" style={{display:'flex',width:window.innerWidth, height:window.innerHeight,
                alignItems:'center', justifyContent:'center', transition: `opacity ${1500}ms ease-in-out`,}}>
                    <img src={require('./assets/img/brand/argon-react-white.png')} style={{width:'40%', height:'30%'}} />
                </div>
            )
        }
        else if(this.state.loadingStatus==="rejected")
        {
            return  <div className="bg-gradient-info" style={{display:'flex',width:window.innerWidth, height:window.innerHeight,
            alignItems:'center', justifyContent:'center', transition: `opacity ${1500}ms ease-in-out`,}}>
                <Message warning>
                    <Message.Header>Your request is rejected</Message.Header>
                    <p>Contact Vidhata customer care for more details</p>
                    </Message>
            </div>
        }
        else
        {
            return  <div className="bg-gradient-info" style={{display:'flex',width:window.innerWidth, height:window.innerHeight,
            alignItems:'center', justifyContent:'center', transition: `opacity ${1500}ms ease-in-out`,}}>
                <Message warning>
                    <Message.Header>Your request is still pending</Message.Header>
                    <p>Contact Vidhata customer care for more details</p>
                    </Message>
            </div>
        }

    }


    render()
    {
        return(
        <div style={{width:'100%', height:'100%'}}>
        {this.renderLoading()}
        </div>
        )
    }
}
