import React from "react";


import fire from './config/firebaseConfig';

export default class App extends React.Component 
{
    componentWillMount()
    {
        fire.auth().onAuthStateChanged((user) => {
            if(user)
            {
              this.props.history.push('/admin/bookings')
            }
            else
            {
                this.props.history.push('/auth/login')
            }
          })
    }
    render()
    {
        return (
            <div className="bg-gradient-info" style={{display:'flex',width:window.innerWidth, height:window.innerHeight, 
            alignItems:'center', justifyContent:'center', transition: `opacity ${1500}ms ease-in-out`,}}>
                <img src={require('./assets/img/brand/argon-react-white.png')} style={{width:'40%', height:'30%'}} />
            </div>
        )
    }
}