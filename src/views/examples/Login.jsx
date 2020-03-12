/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Spinner,
    Col
} from "reactstrap";

import fire from 'firebase'

import CircularProgress from '@material-ui/core/CircularProgress';

class Login extends React.Component {


    state = {
        loading: false
    }

    firebaseLogin() {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        if (email.length !== 0 && password.length !== 0) {
            fire.database().ref('users').orderByChild('email').equalTo(email).once('value').then((res) => {
                if (res.val()) {
                    if (!res.val()[Object.keys(res.val())[0]]['admin']) {
                        fire.auth().signInWithEmailAndPassword(email, password).then(() => {
                            this.props.history.push('/')
                            console.log(fire.auth().currentUser.uid)
                        }).catch(() => {
                            this.setState({loading: false})
                            alert("Wrong credentials");
                        })
                    } else {
                        alert('Not autherised')
                    }
                    this.setState({loading: false})
                } else {
                    alert('Email not registered.')
                    this.setState({loading: false})
                }
            })
        } else {
            this.setState({loading: false})
            alert("Please enter all the details");
        }
    }


    renderLoader() {
        if (this.state.loading) 
            return <CircularProgress/>

         else 
            return <Button className="my-4" color="primary" type="button"
                onClick={
                    () => {
                        this.setState({
                            loading: true
                        }, this.firebaseLogin.bind(this))
                    }
            }>
                Sign in
            </Button>


        


    }

    render() {
        return (
            <>
                <Col lg="5" md="7">
                    <Card className="bg-secondary shadow border-0">
                        <CardBody className="px-lg-5 py-lg-5">
                            <Form role="form">
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-email-83"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="email" placeholder="Email" type="email"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-lock-circle-open"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="password" placeholder="Password" type="password"/>
                                    </InputGroup>
                                </FormGroup>
                                <div className="text-center">

                                    {
                                    this.renderLoader()
                                } </div>
                            </Form>

                        </CardBody>
                    </Card>
                </Col>
            </>
        );
    }
}

export default Login;
