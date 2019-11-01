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
  Card,
  CardHeader,
  Container,
  Row,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  Table,
  Media
} from "reactstrap";
// core components
import EmptyHeader from "components/Headers/EmptyHeader.jsx";
import NotifTabs from "components/NotifTabs.js";
import ConversationSearch from '../components/ConversationSearch'

class Notifications extends React.Component {

  state = {
    notifs: [
      { from: 'Michael', subject: 'Passport Expiry', timestamp: '26/10/2019 - 15:44'},
      { from: 'Clark', subject: 'Booking Update', timestamp: '23/09/2019 - 7:25'},
      { from: 'Ruby', subject: 'Passport Expiry', timestamp: '07/09/2019 - 2:17'},
      { from: 'Fredrick', subject: 'Payment Verification', timestamp: '15/08/2019 - 12:59'}
  ]
  }

  send() {
    return(
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Personal Notification</h3>
            </CardHeader>
            <div class="container">
              <div class="row">
                <div class="col">
                  <button type="button" class="btn btn-default" style={{ width: '100%' }}>John Doe</button>
                </div>
                <div class="col-md-auto">
                  <span class="lead"><i>To</i></span>
                </div>
                <div class="col">
                  <div class="form-group">
                    <input type="email" class="form-control form-control-alternative" style={{ width: '100%' }} id="exampleFormControlInput1" placeholder="Receiver Email"/>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                <form style={{ marginBottom: 20 }}>
                  <input class="form-control form-control-alternative" placeholder="Subject" type="text" style={{ marginBottom: 20 }} />
                  <textarea class="form-control form-control-alternative" rows="10" placeholder="Enter Custom Notification..."></textarea>
                </form>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Button block color="info" size="lg" type="button" style={{marginBottom: 20, width: '80%'}}>
                      Send
                    </Button>
                  </div>
                </div>

                <div class="col">
                  <InputGroup >
                    <InputGroupAddon addonType="prepend" style={{width: '50%'}} >
                      <Button style={{paddingLeft:'20%', paddingRight:'20%'}}  block color="info" size="lg"  type="button">Schedule Send</Button>
                    </InputGroupAddon>
                    <Input placeholder="dd/mm/yyyy" style={{paddingLeft:'10%',height: 51}}/>
                  </InputGroup>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Row>
    );
  }

  getReceived() {
    var items = [];

    for(var i=0; i<this.state.notifs.length; i++)
    {
      items.push(
        <tr>
          <td>
            {this.state.notifs[i].from}
          </td>
          <th scope="row" class="name">
            <div class="media align-items-center">
              <div class="media-body">
                <span class="mb-0 text-sm">{this.state.notifs[i].subject}</span>
              </div>
            </div>
          </th>
          <td>
            {this.state.notifs[i].timestamp}
          </td>
          <td>
            <button type="button" class="btn btn-success">Open</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  received() {
    return (
      <div class="table-responsive">
        <div>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Your Notifications</h3>
              <ConversationSearch placeholder="Search Notifications"/>
            </CardHeader>
              <table class="table align-items-center">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">
                            From
                        </th>
                        <th scope="col">
                            Subject
                        </th>
                        <th scope="col">
                            Timestamp
                        </th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody class="list">
                  {this.getReceived()}
                </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <NotifTabs send={this.send()} received={this.received()} />
          </Card>
        </Container>
      </>
    );
  }
}

export default Notifications;
