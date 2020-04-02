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
import { Formik } from "formik";
import CircularProgress from "@material-ui/core/CircularProgress";
import fire from "../../config/firebaseConfig";
import { KeyboardDatePicker } from "@material-ui/pickers";
import format from "date-fns/format";
class Register extends React.Component {
  state = {
    users: null,
    loading: false,
    approved: null,
    rejected: null,
    pending: null
  };

  componentDidMount() {
    fire
      .database()
      .ref("users")
      .on("value", users => {
        let user_obj = {};
        if (users.hasChildren()) {
          Object.entries(users.val()).map(([key, val]) => {
            user_obj[val.email] = key;
          });

          this.setState({ users: user_obj });
          console.log(user_obj);
        }
      });

    this.firebaseSignUpStatus();
  }

  async firebaseSignUpStatus() {
    await fire
      .database()
      .ref("signup")
      .once("value", domains => {
        this.setState({
          approved: domains.val()["apprDom"],
          rejected: domains.val()["rejDom"],
          pending: domains.val()["pendDom"]
        });
      });
  }

  checkSignUpStatus(domain) {
    if (this.state.approved && this.state.approved[domain]) return "approved";
    else if (this.state.rejected && this.state.rejected[domain])
      return "rejected";
    else if (this.state.pending && this.state.pending[domain]) return "pending";

    return "new";
  }
  firebaseRegister() {}

  renderLoader() {
    if (this.state.loading) return <CircularProgress />;
    else
      return (
        <Button className="mt-4" color="primary" type="submit">
          Create account
        </Button>
      );
  }

  render() {
    console.log(this.state);
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Formik
                initialValues={{
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  approver: "",
                  dob: null,
                  phone: "",
                  department: "",
                  seatpref: "Any",
                  mealpref: "Any",
                  passportno: "",
                  doi: null,
                  poi: "",
                  doe: null
                }}
                onSubmit={(values, actions) => {
                  const {
                    firstName,
                    middleName,
                    lastName,
                    email,
                    password,
                    approver,
                    dob,
                    phone,
                    department,
                    seatpref,
                    mealpref,
                    passportno,
                    doi,
                    poi,
                    doe
                  } = values;

                  if (
                    firstName.length !== 0 &&
                    lastName.length !== 0 &&
                    email.length !== 0 &&
                    password.length !== 0 &&
                    dob.length !== 0 &&
                    phone.length !== 0 &&
                    department.length !== 0 &&
                    passportno.length !== 0 &&
                    doi.length !== 0 &&
                    poi.length !== 0 &&
                    doe.length !== 0 &&
                    approver !== 0
                  ) {
                    if (this.state.users !== null) {
                      let approverMail = "";
                      if (approver === "-") approverMail = "-";
                      else approverMail = this.state.users[approver];

                      console.log("arrover", this.state.users[approver]);
                      if (
                        this.state.users[approver] !== undefined ||
                        approver === "-"
                      ) {
                        let domain = email
                          .split("@")[1]
                          .replace(".", "^")
                          .toLowerCase();
                        let status = this.checkSignUpStatus(domain);

                        fire
                          .auth()
                          .createUserWithEmailAndPassword(email, password)
                          .then(() => {
                            fire
                              .database()
                              .ref(`users/${fire.auth().currentUser.uid}`)
                              .set(
                                {
                                  firstName,
                                  middleName,
                                  lastName,
                                  email,
                                  dob: dob ? format(dob, "yyyy-MM-dd") : "",
                                  phone,
                                  department,
                                  seatPreference: seatpref,
                                  mealPreference: mealpref,
                                  passport_number: passportno,
                                  date_of_issue: doi
                                    ? format(doi, "yyyy-MM-dd")
                                    : "",
                                  place_of_issue: poi,
                                  date_of_expiry: doe
                                    ? format(doe, "yyyy-MM-dd")
                                    : "",
                                  approver: approverMail,
                                  bookings: [],
                                  notifications: [],
                                  admin: false
                                },
                                () => {
                                  if (status === "pending") {
                                    fire
                                      .database()
                                      .ref(`signup/pendDom/${domain}`)
                                      .set(
                                        parseInt(this.state.pending[domain]) + 1
                                      );
                                  } else if (status === "new") {
                                    fire
                                      .database()
                                      .ref(`signup/pendDom/${domain}`)
                                      .set(1);
                                  }
                                  this.props.history.push("/");
                                }
                              );
                          })
                          .catch(() => {
                            this.setState({ loading: false });
                            alert("Email already exists");
                          });
                      } else {
                        this.setState({ loading: false });
                        alert("Approver not found");
                      }
                    }
                  } else {
                    console.log(values);
                    this.setState({ loading: false });
                    alert("Please enter all the details");
                  }
                }}
              >
                {({ handleChange, values, handleSubmit, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Approver
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="approver"
                              name="approver"
                              placeholder="Approver Email Id"
                              type="text"
                              value={values.approver}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              First Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="firstName"
                              name="firstName"
                              placeholder="Name"
                              type="text"
                              value={values.firstName}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Middle Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="middleName"
                              name="middleName"
                              placeholder="Name"
                              type="text"
                              value={values.middleName}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Last Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="lastName"
                              name="lastName"
                              placeholder="Name"
                              type="text"
                              value={values.lastName}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
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
                              name="email"
                              placeholder="jesse@example.com"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
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
                              id="password"
                              name="password"
                              placeholder="Password"
                              type="password"
                              value={values.password}
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" /> {/* Address */}
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

                            <KeyboardDatePicker
                              autoOk
                              variant="inline"
                              placeholder="yyyy-MM-dd"
                              format="yyyy-MM-dd"
                              id="dob"
                              name="dob"
                              value={values.dob}
                              onChange={date => {
                                setFieldValue("dob", date);
                              }}
                              inputVariant="outlined"
                              style={{
                                // border: "1px solid black",
                                background: "white"
                              }}
                              fullWidth
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
                              name="phone"
                              placeholder="Phone Number"
                              type="number"
                              value={values.phone}
                              onChange={handleChange}
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
                              name="department"
                              placeholder="Department"
                              type="text"
                              value={values.department}
                              onChange={handleChange}
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
                              type="select"
                              id="seatpref"
                              name="seatpref"
                              className="form-control-alternative"
                              value={values.seatpref}
                              onChange={handleChange}
                            >
                              <option>Any</option>
                              <option>Aisle</option>
                              <option>Middle</option>
                              <option>Window</option>
                            </Input>
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
                              type="select"
                              id="mealpref"
                              name="mealpref"
                              className="form-control-alternative"
                              value={values.mealpref}
                              onChange={handleChange}
                            >
                              <option>Any</option>
                              <option>Veg</option>
                              <option>Non Veg</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" /> {/* Description */}
                    <h6 className="heading-small text-muted mb-4">
                      Passport Information
                    </h6>
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
                              name="passportno"
                              placeholder="Passport Number"
                              type="text"
                              value={values.passportno}
                              onChange={handleChange}
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

                            <KeyboardDatePicker
                              autoOk
                              variant="inline"
                              placeholder="yyyy-MM-dd"
                              format="yyyy-MM-dd"
                              id="doi"
                              name="doi"
                              value={values.doi}
                              onChange={date => {
                                setFieldValue("doi", date);
                              }}
                              inputVariant="outlined"
                              style={{
                                // border: "1px solid black",
                                background: "white"
                              }}
                              fullWidth
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
                              name="poi"
                              placeholder="Place of Issue"
                              type="text"
                              value={values.poi}
                              onChange={handleChange}
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
                            </label>{" "}
                            <KeyboardDatePicker
                              autoOk
                              variant="inline"
                              placeholder="yyyy-MM-dd"
                              format="yyyy-MM-dd"
                              id="doe"
                              name="doe"
                              value={values.doe}
                              onChange={date => {
                                setFieldValue("doe", date);
                              }}
                              inputVariant="outlined"
                              style={{
                                // border: "1px solid black",
                                background: "white"
                              }}
                              fullWidth
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div className="text-center">{this.renderLoader()} </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Register;
