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
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Badge,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  UncontrolledTooltip

} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample2
} from "variables/charts.jsx";


import {Pie} from 'react-chartjs-2';

import Header from "components/Headers/Header.jsx";
import PieChart from '../variables/PieChart';

class Analytics extends React.Component {
  state = {
    activeNav: 1,
    chartExample1Data: "data1"
  };
  
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);
    // this.chartReference.update();
  };
  componentWillMount() {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  render() {
	const data = {
		labels: [
			'Emp1',
			'Emp2',
			'Emp3'
		],
		datasets: [{
			data: [300, 50, 100],
			backgroundColor: [
			'#FF6384',
			'#36A2EB',
			'#FFCE56'
			],
			hoverBackgroundColor: [
			'#FF6384',
			'#36A2EB',
			'#FFCE56'
			]
		}]
	};
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
			
		<Row>
            {/*<Col className="mb-5 mb-xl-0" xl="8">*/}
            <Col xl="8">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Performance for Oct - 2019
                      </h6>
                      <h2 className="mb-0">Total Requests</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={chartExample2.data}
                      options={chartExample2.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

			<Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-1">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Performance</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <div style={{height:300, width:'100%', marginTop:'10%', marginBottom:'10%'}}>
					<Pie data={data} />
				</div>
              </Card>
            </Col>
          </Row>



          <Card className="shadow"  className="mt-5">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Top clients list for October 2019
                      </h6>
                      <h2 className="mb-0">Requests Handeled</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>

        <Table className="align-items-center" responsive>
  <thead className="thead-light">
	<tr>
		{/* TABLE HEADER */}
	  <th scope="col">Client</th>
	  <th scope="col">Total requests</th>
	  <th scope="col">Successful conversion</th>
	  <th scope="col">Incharge</th>
	  <th scope="col">Revenue</th>
	  <th scope="col" />
	</tr>
  </thead>

  <tbody>

	{/* CUSTOMER-1 */}
	<tr>
	  <th scope="row">
		<Media className="align-items-center">
		  <a
			className="avatar rounded-circle mr-3"
			href="#pablo"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  src={require("assets/img/theme/bootstrap.jpg")}
			/>
		  </a>
		  <Media>
			<span className="mb-0 text-sm">
			  Client 1
			</span>
		  </Media>
		</Media>
	  </th>
	  <td>235</td>
	  <td>
		<div className="d-flex align-items-center">
		  <span className="mr-2">70%</span>
		  <div>
			<Progress
			  max="100"
			  value="70"
			  barClassName="bg-info"
			/>
		  </div>
		</div>
	  </td>

	  <td>
		<div className="avatar-group">
		  <a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip742438047"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-1-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip742438047"
		  >
			Employee-1
		  </UncontrolledTooltip>
		  <a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip941738690"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-2-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip941738690"
		  >
			Employee-2
		  </UncontrolledTooltip>
		  <a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip804044742"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-3-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip804044742"
		  >
			Employee-3
		  </UncontrolledTooltip>
		  <a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip996637554"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-4-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip996637554"
		  >
			Employee-4
		  </UncontrolledTooltip>
		</div>
	  </td>

	  <td>
		<Badge color="" className="badge-dot mr-4">
		  <i className="bg-info" />
		  2.5L
		</Badge>
	  </td>

	  <td className="text-right">
		<UncontrolledDropdown>
		  <DropdownToggle
			className="btn-icon-only text-light"
			href="#pablo"
			role="button"
			size="sm"
			color=""
			onClick={e => e.preventDefault()}
		  >
			<i className="fas fa-ellipsis-v" />
		  </DropdownToggle>
		  <DropdownMenu className="dropdown-menu-arrow" right>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Client-1 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Employee-1 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Any other link
			</DropdownItem>
		  </DropdownMenu>
		</UncontrolledDropdown>
	  </td>
	</tr>

	{/* CUSTOMER-2 */}
	<tr>
	  <th scope="row">
		<Media className="align-items-center">
		  <a
			className="avatar rounded-circle mr-3"
			href="#pablo"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  src={require("assets/img/theme/angular.jpg")}
			/>
		  </a>
		  <Media>
			<span className="mb-0 text-sm">
			  Client 2
			</span>
		  </Media>
		</Media>
	  </th>
	  <td>215</td>
	  <td>
		<div className="d-flex align-items-center">
		  <span className="mr-2">95%</span>
		  <div>
			<Progress
			  max="100"
			  value="95"
			  barClassName="bg-success"
			/>
		  </div>
		</div>
	  </td>

	  <td>
		<div className="avatar-group">
		  <a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip742438047"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-1-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip742438047"
		  >
			Employee-1
		  </UncontrolledTooltip>
		</div>
	  </td>

	  <td>
		<Badge color="" className="badge-dot mr-4">
		  <i className="bg-success" />
		  2.12L
		</Badge>
	  </td>

	  <td className="text-right">
		<UncontrolledDropdown>
		  <DropdownToggle
			className="btn-icon-only text-light"
			href="#pablo"
			role="button"
			size="sm"
			color=""
			onClick={e => e.preventDefault()}
		  >
			<i className="fas fa-ellipsis-v" />
		  </DropdownToggle>
		  <DropdownMenu className="dropdown-menu-arrow" right>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Clinet-2 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Employee-1 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Any other link
			</DropdownItem>
		  </DropdownMenu>
		</UncontrolledDropdown>
	  </td>
	</tr>

{/* CUSTOMER-2 */}
	<tr>
	  <th scope="row">
		<Media className="align-items-center">
		  <a
			className="avatar rounded-circle mr-3"
			href="#pablo"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  src={require("assets/img/theme/sketch.jpg")}
			/>
		  </a>
		  <Media>
			<span className="mb-0 text-sm">
			  Client 3
			</span>
		  </Media>
		</Media>
	  </th>
	  <td>163</td>
	  <td>
		<div className="d-flex align-items-center">
		  <span className="mr-2">100%</span>
		  <div>
			<Progress
			  max="100"
			  value="100"
			  barClassName="bg-success"
			/>
		  </div>
		</div>
	  </td>

	  <td>
		<div className="avatar-group">
		<a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip996637554"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-4-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip996637554"
		  >
			Employee-4
		  </UncontrolledTooltip>
		</div>
	  </td>

	  <td>
		<Badge color="" className="badge-dot mr-4">
		  <i className="bg-success" />
		  2.9L
		</Badge>
	  </td>

	  <td className="text-right">
		<UncontrolledDropdown>
		  <DropdownToggle
			className="btn-icon-only text-light"
			href="#pablo"
			role="button"
			size="sm"
			color=""
			onClick={e => e.preventDefault()}
		  >
			<i className="fas fa-ellipsis-v" />
		  </DropdownToggle>
		  <DropdownMenu className="dropdown-menu-arrow" right>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Clinet-3 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Employee-4 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Any other link
			</DropdownItem>
		  </DropdownMenu>
		</UncontrolledDropdown>
	  </td>
	</tr>


{/* CUSTOMER-4 */}
	<tr>
	  <th scope="row">
		<Media className="align-items-center">
		  <a
			className="avatar rounded-circle mr-3"
			href="#pablo"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  src={require("assets/img/theme/react.jpg")}
			/>
		  </a>
		  <Media>
			<span className="mb-0 text-sm">
			  Client 4
			</span>
		  </Media>
		</Media>
	  </th>
	  <td>145</td>
	  <td>
		<div className="d-flex align-items-center">
		  <span className="mr-2">45%</span>
		  <div>
			<Progress
			  max="100"
			  value="45"
			  barClassName="bg-warning"
			/>
		  </div>
		</div>
	  </td>

	  <td>
		<div className="avatar-group">
		<a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip804044742"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-3-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip804044742"
		  >
			Employee-3
		  </UncontrolledTooltip>
		</div>
	  </td>

	  <td>
		<Badge color="" className="badge-dot mr-4">
		  <i className="bg-warning" />
		  0.9L
		</Badge>
	  </td>

	  <td className="text-right">
		<UncontrolledDropdown>
		  <DropdownToggle
			className="btn-icon-only text-light"
			href="#pablo"
			role="button"
			size="sm"
			color=""
			onClick={e => e.preventDefault()}
		  >
			<i className="fas fa-ellipsis-v" />
		  </DropdownToggle>
		  <DropdownMenu className="dropdown-menu-arrow" right>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Clinet-4 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Employee-3 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Any other link
			</DropdownItem>
		  </DropdownMenu>
		</UncontrolledDropdown>
	  </td>
	</tr>

{/* CUSTOMER-5 */}
	<tr>
	  <th scope="row">
		<Media className="align-items-center">
		  <a
			className="avatar rounded-circle mr-3"
			href="#pablo"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  src={require("assets/img/theme/vue.jpg")}
			/>
		  </a>
		  <Media>
			<span className="mb-0 text-sm">
			  Client 5
			</span>
		  </Media>
		</Media>
	  </th>
	  <td>130</td>
	  <td>
		<div className="d-flex align-items-center">
		  <span className="mr-2">80%</span>
		  <div>
			<Progress
			  max="100"
			  value="80"
			  barClassName="bg-info"
			/>
		  </div>
		</div>
	  </td>

	  <td>
		<div className="avatar-group">
		  <a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip941738690"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-2-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip941738690"
		  >
			Employee-2
		  </UncontrolledTooltip>
		  <a
			className="avatar avatar-sm"
			href="#pablo"
			id="tooltip804044742"
			onClick={e => e.preventDefault()}
		  >
			<img
			  alt="..."
			  className="rounded-circle"
			  src={require("assets/img/theme/team-3-800x800.jpg")}
			/>
		  </a>
		  <UncontrolledTooltip
			delay={0}
			target="tooltip804044742"
		  >
			Employee-3
		  </UncontrolledTooltip>
		</div>
	  </td>

	  <td>
		<Badge color="" className="badge-dot mr-4">
		  <i className="bg-info" />
		  1.25L
		</Badge>
	  </td>

	  <td className="text-right">
		<UncontrolledDropdown>
		  <DropdownToggle
			className="btn-icon-only text-light"
			href="#pablo"
			role="button"
			size="sm"
			color=""
			onClick={e => e.preventDefault()}
		  >
			<i className="fas fa-ellipsis-v" />
		  </DropdownToggle>
		  <DropdownMenu className="dropdown-menu-arrow" right>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Client-5 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Employee-3 details
			</DropdownItem>
			<DropdownItem
			  href="#pablo"
			  onClick={e => e.preventDefault()}
			>
			  Any other link
			</DropdownItem>
		  </DropdownMenu>
		</UncontrolledDropdown>
	  </td>
	</tr>

  </tbody>
      </Table>

</CardBody>
</Card>







</Container>
      </>
    );
  }
}

export default Analytics;
