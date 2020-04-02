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
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.jsx";
import fire from "../config/firebaseConfig";
import { Formik } from "formik";
import format from "date-fns/format";

import { KeyboardDatePicker } from "@material-ui/pickers";
import { Dimmer, Loader } from "semantic-ui-react";
import LinearProgress from "@material-ui/core/LinearProgress";
class Profile extends React.Component {
  state = {
    userDetails: {},
    editing: "true",
    loading: true,
    submitForm: null
  };

  componentDidMount() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        fire
          .database()
          .ref(`users/${fire.auth().currentUser.uid}`)
          .on("value", user => {
            const userdata = user.val();
            fire
              .database()
              .ref(`users/${userdata.approver}`)
              .on("value", approver => {
                console.log(approver.val());
                userdata.approver = approver.val().email;
                const doi = userdata.date_of_issue.split("-");
                const doe = userdata.date_of_expiry.split("-");
                const dob = userdata.dob.split("-");

                this.setState({
                  userDetails: {
                    ...userdata,
                    date_of_issue: new Date(doi[0], doi[1] - 1, doi[2]),
                    date_of_expiry: new Date(doe[0], doe[1] - 1, doe[2]),
                    dob: new Date(dob[0], dob[1] - 1, dob[2])
                  },
                  loading: false
                });
              });
          });
      }
    });
  }

  renderForm() {
    const {
      firstName,
      middleName,
      lastName,
      email,
      approver,
      dob,
      phone,
      department,
      seatPreference,
      mealPreference,
      passport_number,
      place_of_issue,
      date_of_expiry,
      date_of_issue
    } = this.state.userDetails;
    if (this.state.userDetails === null) {
      return (
        <Dimmer active>
          <Loader size="large">Loading</Loader>
        </Dimmer>
      );
    } else {
      console.log(this.state);
      return (
        <Formik
          initialValues={{
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            email: email,
            approver: approver,
            dob: dob,
            phone: phone,
            department: department,
            seatpref: seatPreference,
            mealpref: mealPreference,
            passportno: passport_number,
            doi: date_of_issue,
            poi: place_of_issue,
            doe: date_of_expiry
          }}
          onSubmit={(values, actions) => {
            console.log(values);
            const {
              firstName,
              middleName,
              lastName,
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
              dob.length !== 0 &&
              phone.length !== 0 &&
              department.length !== 0 &&
              passportno.length !== 0 &&
              doi.length !== 0 &&
              poi.length !== 0 &&
              doe.length !== 0
            ) {
              fire
                .database()
                .ref(`users/${fire.auth().currentUser.uid}`)
                .update({
                  firstName,
                  middleName,
                  lastName,
                  dob: dob ? format(dob, "yyyy-MM-dd") : "",
                  phone,
                  department,
                  seatPreference: seatpref,
                  mealPreference: mealpref,
                  passport_number: passportno,
                  date_of_issue: doi ? format(doi, "yyyy-MM-dd") : "",
                  place_of_issue: poi,
                  date_of_expiry: doe ? format(doe, "yyyy-MM-dd") : ""
                })
                .then(() => {
                  this.setState({ loading: false });
                });
            } else {
              console.log(values);
              this.setState({ loading: false });
              alert("Please enter all the details");
            }
          }}
        >
          {({
            handleChange,
            values,
            handleSubmit,
            setFieldValue,
            submitForm
          }) => {
            if (!this.state.submitForm)
              this.setState({ submitForm: submitForm });
            return (
              <Form onSubmit={handleSubmit}>
                <h6 className="heading-small text-muted mb-4">
                  User information
                </h6>
                <div className="pl-lg-4">
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
                          readonly={this.state.editing}
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
                          readonly={this.state.editing}
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
                          readonly={this.state.editing}
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
                          readonly={"false"}
                        />
                      </FormGroup>
                    </Col>
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
                          readonly={"false"}
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
                        <Row>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Date of Birth
                          </label>
                        </Row>
                        <Row>
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
                              background: this.state.editing
                                ? "#e9ecef"
                                : "white"
                            }}
                            disabled={this.state.editing}
                            fullWidth
                          />
                        </Row>
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
                          readonly={this.state.editing}
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
                          readonly={this.state.editing}
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
                          disabled={this.state.editing}
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
                          disabled={this.state.editing}
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
                          readonly={this.state.editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Row>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Date of Issue
                          </label>
                        </Row>
                        <Row>
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
                              background: this.state.editing
                                ? "#e9ecef"
                                : "white"
                            }}
                            disabled={this.state.editing}
                            fullWidth
                          />
                        </Row>
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
                          readonly={this.state.editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Row>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Date of Expiry
                          </label>
                        </Row>
                        <Row>
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
                              background: this.state.editing
                                ? "#e9ecef"
                                : "white"
                            }}
                            disabled={this.state.editing}
                            fullWidth
                          />
                        </Row>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </Form>
            );
          }}
        </Formik>
      );
    }
  }

  renderButton() {
    if (this.state.editing) {
      return (
        <Button
          color="primary"
          onClick={() => {
            this.setState({ editing: false });
          }}
          size="sm"
        >
          Edit Profile
        </Button>
      );
    } else {
      return (
        <Button
          color="primary"
          onClick={e => {
            this.state.submitForm(e);
            this.setState({ editing: "true" });
          }}
          size="sm"
        >
          Done
        </Button>
      );
    }
  }
  render() {
    console.log(this.state.editing);
    return (
      <>
        <UserHeader /> {/* Page content */}
        <Container className="mt--7 align-items-center" fluid>
          <Row
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      {this.renderButton()}
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {this.state.loading ? <LinearProgress /> : this.renderForm()}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Profile;
