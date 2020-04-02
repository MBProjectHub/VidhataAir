import React from "react";
import fire from "../config/firebaseConfig";
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
  Col,
  CustomInput
} from "reactstrap";
import { KeyboardDatePicker } from "@material-ui/pickers";
import format from "date-fns/format";
import { Dropdown, Radio, Segment } from "semantic-ui-react";
import { LinearProgress } from "@material-ui/core";
    
class Requestform extends React.Component {
  state = {
    dept: "",
    mealpref: "Any",
    seatpref: "Any",
    arr: "",
    ddate: "",
    rdate: "",
    email: "",
    ttype: 1,
    class: 2,
    numTrav: 1,
    travNames: [],
    travNums: [],
    firstName: "",
    middleName: "",
    lastName: "",
    acity: [],
    dcity: [],
    selfbooking: false,
    loading: false
  };

  componentDidMount() {
    let temp = this.props.data.bookings.active[this.props.data.threadId];
    if (temp && temp.request.details != "-") {
      this.fetchCity(temp.request.details.arr, "acity");
      this.fetchCity(temp.request.details.dept, "dcity");
      this.setState({
        ...temp.request.details,
        rdate:
          temp.request.details.rdate === null
            ? undefined
            : temp.request.details.rdate,
        selfbooking:
          fire.auth().currentUser.email === temp.request.details.email
      });
    } else {
      let ts = this.getTimestamp(5, 30);
      this.setState({
        ddate:
          ts.split("_")[0] + "-" + ts.split("_")[1] + "-" + ts.split("_")[2],
        rdate:
          ts.split("_")[0] + "-" + ts.split("_")[1] + "-" + ts.split("_")[2]
      });
    }
  }

  fetchCity(query, type) {
    if (query) {
      fetch(
        `https://voyager.goibibo.com/api/v2/flights_search/find_node_by_name_v2/?limit=10&v=2&search_query=${query}`,
        {
          method: "GET"
        }
      )
        .then(res => res.json())
        .then(data => {
          this.setState({
            [type]: data.data.r.map(el => {
              return {
                key: el.iata,
                value: el.iata,
                text: `${el.n} - ${el.iata} (${el.ct.n})`
              };
            })
          });
        });
    }
  }

  fetchUserDetails() {
    this.setState({ loading: true });
    fire
      .database()
      .ref(`users/${fire.auth().currentUser.uid}`)
      .once("value", data => {
        const user = data.val();
        this.setState({
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          mealpref: user.mealPreference,
          seatpref: user.seatPreference,
          loading: false,
          selfbooking: true
        });
      })
      .catch(err => {
        alert("Error fetching user details");
        this.setState({ loading: false });
      });
  }
  getTimestamp(h, m) {
    var t = new Date();
    t.setHours(t.getUTCHours() + h);
    t.setMinutes(t.getUTCMinutes() + m);

    var timestamp =
      t.getUTCFullYear() +
      "_" +
      ("0" + (t.getMonth() + 1)).slice(-2) +
      "_" +
      ("0" + t.getDate()).slice(-2) +
      "_" +
      ("0" + t.getHours()).slice(-2) +
      "_" +
      ("0" + t.getMinutes()).slice(-2) +
      "_" +
      ("0" + t.getSeconds()).slice(-2) +
      "_" +
      ("0" + t.getMilliseconds()).slice(-2);

    return timestamp;
  }

  submit() {
    this.props.load();
    const {
      dept,
      mealpref,
      seatpref,
      arr,
      ddate,
      ttype,
      numTrav,
      travNames,
      travNums,
      firstName,
      middleName,
      lastName,
      email,
      phone
    } = this.state;
    let newData = this.props.data.bookings.active[this.props.data.threadId];
    newData.Estage = 0;
    newData.request["details"] = {
      dept,
      mealpref,
      seatpref,
      arr,
      ddate,
      ttype,
      numTrav,
      travNames,
      travNums,
      firstName,
      middleName,
      lastName,
      email,
      phone,
      class: this.state.class,
      rdate: this.state.ttype == 2 ? this.state.rdate : null
    };
    let timestamp = this.getTimestamp(5, 30);
    let temp = timestamp.split("_");
    let formatted =
      temp[2] + "-" + temp[1] + "-" + temp[0] + " " + temp[3] + ":" + temp[4];
    newData.request.arrivedAt = formatted;
    newData["initId"] = "*" + this.props.data.initId.substring(1);

    temp = {};
    temp[
      "/users/" +
        fire.auth().currentUser.uid +
        "/bookings/" +
        this.props.data.threadId
    ] = {};
    temp[
      "/users/" +
        fire.auth().currentUser.uid +
        "/bookings/" +
        "booking_" +
        timestamp
    ] = "-";

    temp["/bookings/active/" + this.props.data.threadId] = {};
    temp["/bookings/active/" + "booking_" + timestamp] = newData;

    fire
      .database()
      .ref()
      .update(temp);
  }

  getNameFields(num) {
    let fields = [];

    for (var i = 0; i < num; i++) {
      fields.push(
        <Row>
          <Col lg="6">
            <FormGroup>
              <label className="form-control-label" htmlFor="input-username">
                Name
              </label>
              <Input
                className="form-control-alternative"
                id={i}
                placeholder="Traveller Name"
                type="text"
                value={this.state.travNames[i]}
                onChange={name => {
                  let temp = this.state.travNames;
                  temp[Number(name.target.getAttribute("id"))] =
                    name.target.value;
                  this.setState({ travNames: temp });
                }}
                style={{
                  pointerEvents: !this.props.editable ? "none" : "auto",
                  marginTop: "2%"
                }}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup>
              <label className="form-control-label" htmlFor="input-username">
                Number
              </label>
              <Input
                className="form-control-alternative"
                id={i}
                placeholder="Traveller Number"
                type="number"
                value={this.state.travNums[i]}
                onChange={name => {
                  let temp = this.state.travNums;
                  temp[Number(name.target.getAttribute("id"))] =
                    name.target.value;
                  this.setState({ travNums: temp });
                }}
                style={{
                  pointerEvents: !this.props.editable ? "none" : "auto",
                  marginTop: "2%"
                }}
              />
            </FormGroup>
          </Col>
        </Row>
      );
    }

    if (num > 0)
      return (
        <Row>
          <Col lg="6">
            <FormGroup>
              <label className="form-control-label" htmlFor="input-city">
                Additional Traveller Details
              </label>
              {fields.map(field => field)}
            </FormGroup>
          </Col>
        </Row>
      );
  }

  render() {
    return (
      <Col style={{ maxWidth: "100%" }} className="order-xl-1" xl="8">
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <Row className="align-items-center">
              <Col xs="9">
                <h3 className="mb-0"> Request Form </h3>
              </Col>
              <Col xs="2">
                <label
                  className="form-control-label"
                  htmlFor="input-first-name"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  I 'm Travelling
                </label>
              </Col>
              <Col xs="1">
                <Radio
                  toggle
                  onChange={(event, data) => {
                    this.setState({ selfbooking: data.checked });
                    if (data.checked) {
                      this.fetchUserDetails();
                    }
                  }}
                  checked={this.state.selfbooking}
                />
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            {this.state.loading ? <LinearProgress /> : ""}
            <Form>
              {/* Address */}
              <h6 className="heading-small text-muted mb-4">
                Personal Information
              </h6>
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
                      value={this.state.firstName}
                      onChange={event =>
                        this.setState({ firstName: event.target.value })
                      }
                      readOnly={this.state.selfbooking}
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
                      value={this.state.middleName}
                      onChange={event =>
                        this.setState({ middleName: event.target.value })
                      }
                      readOnly={this.state.selfbooking}
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
                      value={this.state.lastName}
                      onChange={event =>
                        this.setState({ lastName: event.target.value })
                      }
                      readOnly={this.state.selfbooking}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-email">
                      Email address
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="email"
                      name="email"
                      placeholder="jesse@example.com"
                      type="email"
                      value={this.state.email}
                      onChange={event =>
                        this.setState({ email: event.target.value })
                      }
                      readOnly={this.state.selfbooking}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-city">
                      Phone
                    </label>
                    <Input
                      className="form-control-alternative"
                      defaultValue=""
                      id="phone"
                      name="phone"
                      placeholder="Phone Number"
                      type="number"
                      value={this.state.phone}
                      onChange={event =>
                        this.setState({ phone: event.target.value })
                      }
                      readOnly={this.state.selfbooking}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <hr className="my-4" />
              <h6 className="heading-small text-muted mb-4">
                Flight Preferences
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-city"
                      >
                        Trip type
                      </label>
                      <div class="custom-control custom-radio mb-3">
                        <input
                          name="custom-radio-2"
                          class="custom-control-input"
                          id="customRadio5"
                          type="radio"
                          checked={this.state.ttype == 1}
                          onChange={() => this.setState({ ttype: 1 })}
                        />
                        <label class="custom-control-label" for="customRadio5">
                          One Way
                        </label>
                      </div>
                      <div class="custom-control custom-radio mb-3">
                        <input
                          name="custom-radio-2"
                          class="custom-control-input"
                          id="customRadio6"
                          type="radio"
                          checked={this.state.ttype == 2}
                          onChange={() => this.setState({ ttype: 2 })}
                        />
                        <label class="custom-control-label" for="customRadio6">
                          Round Trip
                        </label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-country"
                      >
                        Class
                      </label>
                      <div class="custom-control custom-radio mb-3">
                        <input
                          name="custom-radio-3"
                          class="custom-control-input"
                          id="customRadio7"
                          type="radio"
                          checked={this.state.class == 1}
                          onChange={() => this.setState({ class: 1 })}
                        />
                        <label class="custom-control-label" for="customRadio7">
                          Business
                        </label>
                      </div>
                      <div class="custom-control custom-radio mb-3">
                        <input
                          name="custom-radio-3"
                          class="custom-control-input"
                          id="customRadio8"
                          type="radio"
                          checked={this.state.class == 2}
                          onChange={() => this.setState({ class: 2 })}
                        />
                        <label class="custom-control-label" for="customRadio8">
                          Economy
                        </label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
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
                        value={this.state.seatpref}
                        onChange={event =>
                          this.setState({ seatpref: event.target.value })
                        }
                      >
                        <option> Any </option> <option> Aisle </option>
                        <option> Middle </option> <option> Window </option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="6">
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
                        value={this.state.mealpref}
                        onChange={event =>
                          this.setState({ mealpref: event.target.value })
                        }
                      >
                        <option> Any </option> <option> Veg </option>
                        <option> Non Veg </option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <hr className="my-4" />
              <h6 className="heading-small text-muted mb-4">Trip Details</h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-username"
                      >
                        Departure City
                      </label>
                      <Dropdown
                        placeholder="Select city"
                        fluid
                        search
                        selection
                        name="dept"
                        onSearchChange={event => {
                          console.log(event.target.value);
                          this.fetchCity(event.target.value, "dcity");
                        }}
                        options={this.state.dcity}
                        noResultsMessage="No results found"
                        onChange={(event, data) => {
                          console.log(data);
                          this.setState({ dept: data.value });
                        }}
                        value={this.state.dept}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-email"
                      >
                        Arrival City
                      </label>

                      <Dropdown
                        placeholder="Select city"
                        fluid
                        search
                        selection
                        onSearchChange={event => {
                          this.fetchCity(event.target.value, "acity");
                        }}
                        options={this.state.acity}
                        noResultsMessage="No results found"
                        onChange={(event, data) => {
                          this.setState({ arr: data.value });
                        }}
                        value={this.state.arr}
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
                        Departure Date
                      </label>
                      <KeyboardDatePicker
                        autoOk
                        variant="inline"
                        placeholder="Leaving Date"
                        format="yyyy-MM-dd"
                        value={this.state.ddate}
                        onChange={date => {
                          this.setState({ ddate: format(date, "yyyy-MM-dd") });
                        }}
                        inputVariant="outlined"
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto",
                          background: "white",
                          width: "100%"
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-last-name"
                      >
                        Return Date
                      </label>
                      <KeyboardDatePicker
                        autoOk
                        variant="inline"
                        placeholder="Returning Date"
                        format="yyyy-MM-dd"
                        value={this.state.rdate}
                        onChange={date => {
                          this.setState({ rdate: format(date, "yyyy-MM-dd") });
                        }}
                        inputVariant="outlined"
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto",
                          background: "white",
                          width: "100%"
                        }}
                        disabled={this.state.ttype == 1}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <hr className="my-4" />
              <h6 className="heading-small text-muted mb-4">
                Additional Options
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="4">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-city"
                      >
                        Number of Travellers
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="input-city"
                        placeholder="City"
                        type="number"
                        value={this.state.numTrav}
                        onChange={num =>
                          this.setState({ numTrav: num.target.value })
                        }
                        style={{
                          pointerEvents: !this.props.editable ? "none" : "auto"
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div className="pl-lg-4">
                {this.getNameFields(this.state.numTrav - 1)}
              </div>
              <hr className="my-4" />
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <Button
                        color="info"
                        type="button"
                        onClick={() => this.submit()}
                        style={{ marginLeft: "80%" }}
                      >
                        Submit
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default Requestform;
