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
  Badge,
  Card,
  CardHeader,
  Media,
  Table,
  Container,
  Row
} from "reactstrap";
// core components
import EmptyHeader from "components/Headers/EmptyHeader.jsx";
import SignUpTabs from "components/SignUpTabs.js";

class SignUpRequests extends React.Component {

  state = {
    pending : ['lenovo.com','apple.com','companyX.co.in'],
    allowed : [{ domain: 'airasia.com', by: 'John Doe', charge: ""}, { domain: 'bigbazaar.com', by: 'Jack Sams', charge: ""}, { domain: 'teachindia.org', by: 'John Doe', charge: ""}, { domain: 'agame.com', by: 'Rubert', charge: ""}],
    rejected : [{ domain: 'gmail.com', by: 'Rubert'}, { domain: 'qindustries.uk', by: 'Jack Sams'}]
  }

  getPending() {
    var items = [];

    for(var i=0; i<this.state.pending.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {this.state.pending[i]}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            <Badge color="" className="badge-dot mr-4">
              <i className="bg-warning" />
              pending
            </Badge>
          </td>
          <td>
            <button type="button" class="btn btn-success">Allow</button>
            <button type="button" class="btn btn-danger">Reject</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  setAmount(e) {
    var temp = this.state.allowed;
    temp[e.target.getAttribute("id")].charge = e.target.value;
    this.setState({ allowed: temp });
  }

  getAllowed() {
    var items = [];

    for(var i=0; i<this.state.allowed.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {this.state.allowed[i].domain}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            {this.state.allowed[i].by}
          </td>
          <td>
          <div class="input-group input-group-alternative mb-4" style={{ marginTop: 20, marginLeft: '15%', width: '70%' }}>
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="ni ni-money-coins"></i></span>
            </div>
            <input id={i} class="form-control form-control-alternative" placeholder="Amount" type="text" value={this.state.allowed[i].charge} onChange={e => this.setAmount(e)} />
          </div>
          </td>
          <td>
            <button type="button" class="btn btn-danger">Move To Rejected</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  getRejected() {
    var items = [];

    for(var i=0; i<this.state.rejected.length; i++)
    {
      items.push(
        <tr>
          <th scope="row">
            <Media className="align-items-center">
              <Media>
                <span className="mb-0 text-sm">
                  {this.state.rejected[i].domain}
                </span>
              </Media>
            </Media>
          </th>
          <td>
            {this.state.rejected[i].by}
          </td>
          <td>
            <button type="button" class="btn btn-success">Move To Allowed</button>
          </td>
        </tr>
      );
    }

    return items;
  }

  pendingTable() {
    return (
      <Row className="mt-5">
        <div className="col">
          <Card className="bg-default shadow">
            <CardHeader className="bg-transparent border-0">
              <h3 className="text-white mb-0">Domain Requests</h3>
            </CardHeader>
            <Table
              className="align-items-center table-dark table-flush"
              responsive
            >
              <thead className="thead-dark">

                <tr>
                  <th scope="col">Domain</th>
                  <th scope="col">By</th>
                  <th scope="col">Action</th>
                  <th scope="col" />
                </tr>
              </thead>

              <tbody>

                {this.getPending()}

              </tbody>
            </Table>
          </Card>
        </div>
      </Row>
    );
  }

allowedTable() {
  return (
    <Row className="mt-5">
      <div className="col">
        <Card className="bg-default shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="text-white mb-0">Allowed Domains</h3>
          </CardHeader>
          <Table
            className="align-items-center table-dark table-flush"
            responsive
          >
            <thead className="thead-dark">

              <tr>
                <th scope="col">Domain</th>
                <th scope="col">By</th>
                <th scope="col"><span style={{ marginLeft: '15%' }}>Handling Charges</span></th>
                <th scope="col">Action</th>
                <th scope="col" />
              </tr>
            </thead>

            <tbody>

              {this.getAllowed()}

            </tbody>
          </Table>
        </Card>
      </div>
    </Row>
  );
}

rejectedTable() {
  return (
    <Row>
      <div className="col">
        <Card className="bg-default shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="text-white mb-0">Rejected Domains</h3>
          </CardHeader>
          <Table
            className="align-items-center table-dark table-flush"
            responsive
          >
            <thead className="thead-dark">

              <tr>
                <th scope="col">Domain</th>
                <th scope="col">By</th>
                <th scope="col">Action</th>
                <th scope="col" />
              </tr>
            </thead>

            <tbody>

              {this.getRejected()}

            </tbody>
          </Table>
        </Card>
      </div>
    </Row>
  );
}

  render() {
    return (
      <>
        <EmptyHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <SignUpTabs pending={this.pendingTable()} allowed={this.allowedTable()} rejected={this.rejectedTable()} />
          </Card>
        </Container>
      </>
    );
  }
}

export default SignUpRequests;
