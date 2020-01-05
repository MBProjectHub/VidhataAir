import React from "react";
import fire from '../config/firebaseConfig';
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
                <div className="col">
                <span style={{color:'#272727'}} className="h2 font-weight-bold mb-0">{this.props.data.name}</span>
                  <CardTitle className="text-uppercase text-muted mb-0">
                  {this.props.data.seat} | {this.props.data.meal}<br/>{this.props.data.phone}
                  </CardTitle>

                </div>

              </Row>
              <p className="mt-3 mb-0 text-muted text-sm">
              <span className="text-primary mr-2">
                {this.props.data.arrivedAt.substring(0,this.props.data.arrivedAt.length-5)}
              </span>
              <span className="text-success mr-2">
                {this.props.data.arrivedAt.substring(this.props.data.arrivedAt.length-5)}
              </span>
              <span style={{color:'#272727'}} className="text-nowrap">Delivered</span>
                <br/>
                <span className="text-primary mr-2">
                  {this.props.data.handledAt.substring(0,this.props.data.handledAt.length-5)}
                </span>
                <span className="text-success mr-2">
                  {this.props.data.handledAt.substring(this.props.data.handledAt.length-5)}
                </span>
                <span style={{color:'#272727'}} className="text-nowrap">Read by {this.props.name}</span>
              </p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}

export default ProfileCard;
