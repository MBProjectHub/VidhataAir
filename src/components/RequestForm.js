import React from "react";
import fire from "../config/firebaseConfig";
// reactstrap components
import {
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
import { Dropdown, Radio, Segment, Button, Icon } from "semantic-ui-react";
import { LinearProgress } from "@material-ui/core";
import { Formik, FieldArray } from "formik";
import { Snackbar, IconButton, CloseIcon } from "@material-ui/core";

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
    travellers: [],
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    acity: [],
    dcity: [],
    selfbooking: false,
    loading: false,
    initialLoading: true,
    snackbar: { open: false, message: "" }
  };

  componentDidMount() {
    let ts = this.getTimestamp(5, 30);
    console.log(
      ts.split("_")[0] + "-" + ts.split("_")[1] + "-" + ts.split("_")[2]
    );
    console.log(
      ts.split("_")[0] + "-" + ts.split("_")[1] + "-" + ts.split("_")[2]
    );
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
          fire.auth().currentUser.email === temp.request.details.email,
        initialLoading: false
      });
    } else {
      let ts = this.getTimestamp(5, 30);

      this.setState({
        ddate:
          ts.split("_")[0] + "-" + ts.split("_")[1] + "-" + ts.split("_")[2],
        rdate:
          ts.split("_")[0] + "-" + ts.split("_")[1] + "-" + ts.split("_")[2],
        initialLoading: false
      });
    }
  }
  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ snackbar: { open: false, message: "" } });
  };

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

  fetchUserDetails(setFieldValue) {
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

  render() {
    return (
      <>
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

              <Formik
                enableReinitialize
                initialValues={{
                  dept: this.state.dept,
                  mealpref: this.state.mealpref,
                  seatpref: this.state.seatpref,
                  arr: this.state.arr,
                  ddate: this.state.ddate ? this.state.ddate : new Date(),
                  rdate: this.state.rdate ? this.state.rdate : new Date(),
                  email: this.state.email,
                  phone: this.state.phone,
                  ttype: this.state.ttype,
                  class: this.state.class,
                  numTrav: this.state.numTrav,
                  travellers: [...this.state.travellers],
                  firstName: this.state.firstName,
                  middleName: this.state.middleName,
                  lastName: this.state.lastName
                }}
                onSubmit={(values, actions) => {
                  this.props.load(true);
                  const {
                    dept,
                    mealpref,
                    seatpref,
                    arr,
                    ddate,
                    ttype,
                    travellers,
                    firstName,
                    middleName,
                    lastName,
                    email,
                    phone
                  } = values;
                  let newData = this.props.data.bookings.active[
                    this.props.data.threadId
                  ];
                  newData.Estage = 0;
                  newData.request["details"] = {
                    dept,
                    mealpref,
                    seatpref,
                    arr,
                    ddate,
                    ttype,
                    travellers,
                    firstName,
                    middleName,
                    lastName,
                    email,
                    phone,
                    class: values.class,
                    rdate: values.ttype == 2 ? values.rdate : null
                  };
                  let timestamp = this.getTimestamp(5, 30);
                  let temp = timestamp.split("_");
                  let formatted =
                    temp[2] +
                    "-" +
                    temp[1] +
                    "-" +
                    temp[0] +
                    " " +
                    temp[3] +
                    ":" +
                    temp[4];
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
                    .update(temp)
                    .then(() => {
                      this.setState({
                        snackbar: { open: true, message: "Form Submitted" }
                      });
                      this.props.load(false);
                    })
                    .catch(err => console.log(err));
                  actions.setSubmitting(false);
                }}
              >
                {({ handleSubmit, values, handleChange, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
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
                            value={values.firstName}
                            onChange={handleChange}
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
                            id="middleName"
                            name="middleName"
                            placeholder="Name"
                            type="text"
                            value={values.middleName}
                            onChange={handleChange}
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
                            value={values.lastName}
                            onChange={handleChange}
                            readOnly={this.state.selfbooking}
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
                            readOnly={this.state.selfbooking}
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
                            id="phone"
                            name="phone"
                            placeholder="Phone Number"
                            type="number"
                            value={values.phone}
                            onChange={handleChange}
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
                                name="ttype"
                                class="custom-control-input"
                                id="customRadio5"
                                type="radio"
                                checked={values.ttype == 1}
                                onChange={() => setFieldValue("ttype", 1)}
                              />
                              <label
                                class="custom-control-label"
                                htmlFor="customRadio5"
                              >
                                One Way
                              </label>
                            </div>
                            <div class="custom-control custom-radio mb-3">
                              <input
                                name="ttype"
                                class="custom-control-input"
                                id="customRadio6"
                                type="radio"
                                checked={values.ttype == 2}
                                onChange={() => setFieldValue("ttype", 2)}
                              />
                              <label
                                class="custom-control-label"
                                htmlFor="customRadio6"
                              >
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
                                name="class"
                                class="custom-control-input"
                                id="customRadio7"
                                type="radio"
                                checked={values.class == 1}
                                onChange={() => setFieldValue("class", 1)}
                              />
                              <label
                                class="custom-control-label"
                                htmlFor="customRadio7"
                              >
                                Business
                              </label>
                            </div>
                            <div class="custom-control custom-radio mb-3">
                              <input
                                name="class"
                                class="custom-control-input"
                                id="customRadio8"
                                type="radio"
                                checked={values.class == 2}
                                onChange={() => setFieldValue("class", 2)}
                              />
                              <label
                                class="custom-control-label"
                                htmlFor="customRadio8"
                              >
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
                              value={values.seatpref}
                              onChange={handleChange}
                            >
                              <option> Any </option> <option> Aisle </option>
                              <option> Middle </option>{" "}
                              <option> Window </option>
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
                              value={values.mealpref}
                              onChange={handleChange}
                            >
                              <option> Any </option> <option> Veg </option>
                              <option> Non Veg </option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    <h6 className="heading-small text-muted mb-4">
                      Trip Details
                    </h6>
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
                                this.fetchCity(event.target.value, "dcity");
                              }}
                              options={this.state.dcity}
                              noResultsMessage="No results found"
                              onChange={(event, data) => {
                                setFieldValue("dept", data.value);
                              }}
                              value={values.dept}
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
                                setFieldValue("arr", data.value);
                              }}
                              value={values.arr}
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
                              value={values.ddate}
                              onChange={date => {
                                setFieldValue(
                                  "ddate",
                                  format(date, "yyyy-MM-dd")
                                );
                              }}
                              inputVariant="outlined"
                              style={{
                                pointerEvents: !this.props.editable
                                  ? "none"
                                  : "auto",
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
                              value={values.rdate}
                              onChange={date => {
                                setFieldValue(
                                  "rdate",
                                  format(date, "yyyy-MM-dd")
                                );
                              }}
                              inputVariant="outlined"
                              style={{
                                pointerEvents: !this.props.editable
                                  ? "none"
                                  : "auto",
                                background: "white",
                                width: "100%"
                              }}
                              disabled={values.ttype == 1}
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
                      <FieldArray
                        name="travellers"
                        render={arrayHelpers => (
                          <>
                            {values.travellers.length > 0 ? (
                              <Row>
                                <Col lg="6">
                                  <FormGroup>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-city"
                                    >
                                      Additional Traveller Details
                                    </label>
                                    {values.travellers.map(
                                      (traveller, index) => (
                                        <Row key={index}>
                                          <Col lg="5">
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                              >
                                                Name
                                              </label>
                                              <Input
                                                className="form-control-alternative"
                                                placeholder="Traveller Name"
                                                type="text"
                                                name={`travellers[${index}].name`}
                                                value={
                                                  values.travellers[index].name
                                                }
                                                onChange={handleChange}
                                                style={{
                                                  pointerEvents: !this.props
                                                    .editable
                                                    ? "none"
                                                    : "auto",
                                                  marginTop: "2%"
                                                }}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col lg="5">
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                              >
                                                Number
                                              </label>
                                              <Input
                                                className="form-control-alternative"
                                                placeholder="Traveller Number"
                                                type="number"
                                                name={`travellers[${index}].number`}
                                                value={
                                                  values.travellers[index]
                                                    .number
                                                }
                                                onChange={handleChange}
                                                style={{
                                                  pointerEvents: !this.props
                                                    .editable
                                                    ? "none"
                                                    : "auto",
                                                  marginTop: "2%"
                                                }}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col
                                            xs="2"
                                            style={{
                                              display: "flex",
                                              alignItems: "center"
                                            }}
                                          >
                                            <Button
                                              icon
                                              onClick={event => {
                                                event.preventDefault();
                                                arrayHelpers.remove(index);
                                              }}
                                              style={{
                                                // display: "flex",
                                                // justifyContent: "center",
                                                // alignItems: "center",
                                                background: "none"
                                              }}
                                            >
                                              <Icon name="minus" />
                                            </Button>
                                          </Col>
                                        </Row>
                                      )
                                    )}
                                  </FormGroup>
                                </Col>
                              </Row>
                            ) : null}
                            <Row>
                              <Button
                                onClick={event => {
                                  event.preventDefault();
                                  arrayHelpers.push({ name: "", number: "" });
                                }}
                              >
                                <Icon
                                  name="plus"
                                  style={{ marginRight: "5px" }}
                                />
                                Add more travellers
                              </Button>
                            </Row>
                          </>
                        )}
                      />
                    </div>
                    <hr className="my-4" />
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <Button
                              primary
                              type="submit"
                              style={{ marginLeft: "80%" }}
                            >
                              Submit
                            </Button>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.snackbar.open}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          message={this.state.snackbar.message}
        />
      </>
    );
  }
}

export default Requestform;
