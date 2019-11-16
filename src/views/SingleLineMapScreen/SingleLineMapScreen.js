/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SelectBranch from "components/SelectBranch/selectBranch";
import ImageZoom from "react-medium-image-zoom";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class SingleLineMapScreen extends React.Component {
  // eslint-disable-next-line constructor-super
  constructor() {
    super();
    this.state = {
      branch: ""
    };
  }

  /*Change map details on change of the drop down*/
  selectMapEventHandler = event => {
    this.setState({ branch: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div style={{ marginTop: "40px" }}>
          <SelectBranch changed={this.selectMapEventHandler} />
        </div>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>
                    Single Line Diagram
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Here is a single line diagram
                  </p>
                </CardHeader>
                <CardBody>
                  {this.state.branch == "Negambo" ? (
                    <ImageZoom
                      image={{
                        src: require("../../assets/img/enlarge1.jpg"),
                        alt: "Negambo",
                        className: "img",
                        style: { width: "50em" }
                      }}
                      zoomImage={{
                        src: "../../assets/img/enlarge1.png",
                        alt: "Golden Gate Bridge"
                      }}
                    />
                  ) : this.state.branch == "Negambo-2" ? (
                    <div>
                      <ImageZoom
                        image={{
                          src: require("../../assets/img/enlarge2.jpg"),
                          alt: "Negamobo2",
                          className: "img",
                          style: { width: "50em" }
                        }}
                        zoomImage={{
                          src: "../../assets/img/enlarge2.png",
                          alt: "Golden Gate Bridge"
                        }}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

SingleLineMapScreen.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(SingleLineMapScreen);
