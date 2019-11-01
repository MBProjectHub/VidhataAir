import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";

class ProfileCard extends React.Component {
  render() {
    return (
      <>
        <div style={{ width: "20rem" }}>
          <Card className="card-stats mb-4 mb-lg-0" style={{backgroundColor:'#FAFAFA', borderColor:'#FAFAFA'}}>
            <CardBody style={{padding:5}}>
              <Row>
              <Col className="col-auto">
                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                    <i className="fas fa-chart-bar" />
                  </div>
                </Col>
                <div className="col">
                <span style={{color:'#272727'}} className="h2 font-weight-bold mb-0">{this.props.employee}</span>
                  <CardTitle className="text-uppercase text-muted mb-0">
                  {this.props.company}
                  </CardTitle>
                  
                </div>
                
              </Row>
              <p className="mt-3 mb-0 text-muted text-sm">
                <span className="text-success mr-2">
                  9:30
                </span>
                <span style={{color:'#272727'}} className="text-nowrap">Handled by Josh</span>
              </p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}

export default ProfileCard;