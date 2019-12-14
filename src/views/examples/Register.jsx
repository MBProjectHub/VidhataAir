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
  Col
} from "reactstrap";


import { Route, Switch } from "react-router-dom";

import fire from '../../config/firebaseConfig'

class Register extends React.Component {

  firebaseRegister()
  {
    let passcode = document.getElementById('passcode').value;
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let dob = document.getElementById('dob').value;
    let phone = document.getElementById('phone').value;
    let department = document.getElementById('department').value;
    let seatpref = document.getElementById('seatpref').value;
    let mealpref = document.getElementById('mealpref').value;
    let passportno = document.getElementById('passportno').value;
    let doi = document.getElementById('doi').value;
    let poi = document.getElementById('poi').value;
    let doe = document.getElementById('doe').value;
    
  
    if(name.length!==0 && email.length!==0 && password.length!==0 && dob.length!==0 && phone.length!==0 && department.length!==0 && passportno.length!==0 && doi.length!==0 && poi.length!==0 && doe.length !==0)
    {
      fire.auth().createUserWithEmailAndPassword(email, password)
      .then(()=>{
        fire.database().ref(`users/${fire.auth().currentUser.uid}`).set({
          name: name,
          email: email,
          dob: dob,
          phone: phone,
          department: department,
          seatPreference: seatpref,
          meanPreference: mealpref,
          passport_number: passportno,
          date_of_issue: doi,
          place_of_issue: poi,
          date_of_expiry: doe
        })
      }, ()=>{
        this.props.history.push('/admin/bookings')
      })
    }
    else
    {
      alert("Please enter all the details");
    }
  }

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Passcode
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="passcode"
                              placeholder="Passcode"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="email"
                              placeholder="jesse@example.com"
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="name"
                              placeholder="Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Password
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="password"
                              placeholder="Password"
                              type="password"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Personal information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Date of Birth
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="dob"
                              placeholder="Date of Birth"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                          <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Phone
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="phone"
                              placeholder="Phone Number"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                          <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Department
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="department"
                              placeholder="Department"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Seat Preference
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="seatpref"
                              placeholder="Seat Preference"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Meal Preference
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="mealpref"
                              placeholder="Meal Preference"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Description */}
                    <h6 className="heading-small text-muted mb-4">Passport Information</h6>
                    <div className="pl-lg-4">
                    <Row>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Passport Number
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="passportno"
                              placeholder="Passport Number"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                          <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Date of Issue
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="doi"
                              placeholder="Date of Issue"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Place of Issue
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="poi"
                              placeholder="Place of Issue"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                          <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Date of Expiry
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="doe"
                              placeholder="Date of Expiry"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
              
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button" onClick={this.firebaseRegister.bind(this)}>
                    Create account
                  </Button>
                </div>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Register;
