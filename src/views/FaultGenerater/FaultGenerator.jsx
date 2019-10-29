import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
//import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import AddExelCurrentData from "../../components/AddExcelCurrentData/addExcelCurrentData";
import Swal from "sweetalert2";
import SelectBranch from "../../components/SelectBranch/selectBranch";

import { getSwitches } from "../Dashboard/matrixOperations";
var firebase = require("firebase");
var switchtable = [];
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
var switchId;
class FaultGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { branch: "", switchId: "", switchidss: "", switchtable: [] };
  }

  componentDidMount() {
    //  this.onChangeDB()

    firebase
      .database()
      .ref()
      .child("Negambo")
      .once("value")

      .then(snapshot => {
        const val = snapshot.val();
        switchtable = val.switchtable;
        console.log(switchtable);
        this.setState({ switchtable: val.switchtable });
      });
    console.log(switchtable);
  }

  /*Change map details on change of the drop down*/
  selectMapEventHandler = event => {
    this.setState({
      branch: event.target.value
    });
  };

  onChangeHandler = event => {
    this.setState({
      switchId: event.target.value
    });
    console.log(this.state.switchId);
  };

  sendFault = () => {
    let branch = this.state.branch;
    let switchid = switchId;

    try {
      firebase
        .database()
        .ref()
        .child(branch)
        .child("faultSwitch")
        .set(switchid);
      Swal.fire({
        type: "success",
        title: "SwitchOFF",
        text: switchid + " turned off."
      });
    } catch (e) {
      Swal.fire({
        type: "error",
        title: e.name,
        text: "Please select a branch"
      });
    }
    this.setState({
      switchId: ""
    });
  };
  handleChange = e => {
    switchId = e.target.value;
  };

  onChangeDB() {
    try {
      firebase
        .database()
        .ref()
        .child(this.state.branch + "/faultCurrentRequest/switchID")
        .on("value", snapshot => {
          // Do whatever
          var switchids = "";
          if (snapshot.val().includes(",")) {
            switchids = snapshot.val().split(",");
          } else {
            switchids = snapshot.val();
          }
          console.log(switchids);
          if (switchids !== "") {
            Swal.fire({
              type: "info",
              title: "RequestFaultLocation",
              text: "Requesting switches are " + ".",
              input: "text",
              inputPlaceholder: "Enter swithces",
              showCancelButton: true,
              inputValidator: value => {
                // if (!value) {
                //   return 'You need to write something!'
                // }
                // else{
                firebase
                  .database()
                  .ref()
                  .child(this.state.branch)
                  .child("faultCurrentRequest")
                  .child("switchIDValid")
                  .set(value);

                // Swal.fire({
                //   type: 'success',
                //   text: 'Fault location sent.'
                // })
                //}
              }
            });
          }
        });
    } catch (e) {
      console.log(e.err);
    }
  }

  render() {
    if (this.state.branch.length > 0) {
      this.onChangeDB();
    }
    const { classes } = this.props;
    // const table_data= this.state===null?"":this.state.physicalConMatrix;
    //console.log("table data"+(this.state===null?"":this.state.electricConMatrix));
    return (
      <div>
        <div>
          <div className="col-md-3">
            <SelectBranch changed={this.selectMapEventHandler} />
          </div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>Fault Generater</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={6} sm={6} md={12}>
                      <p>1. Create a fault</p>
                      {/*<input*/}
                      {/*    type='text'*/}
                      {/*    value={this.state.switchId}*/}
                      {/*    onChange={this.onChangeHandler}*/}
                      {/*    placeholder="Switch ID"*/}
                      {/*/>*/}
                      {/*  <InputLabel id="demo-simple-select-label">Age</InputLabel>*/}
                      <div>
                        <div>
                          <label>Select Switch Id</label>
                        </div>
                        <select color="info" onChange={this.handleChange}>
                          {getSwitches(this.state.switchtable).map(ee => (
                            <option key={ee} value={ee}>
                              {ee}
                            </option>
                          ))}
                        </select>
                        {/*<select color="info" onChange={this.handleChange}>*/}
                        {/*<option defaultValue={"No Branch"}> Select ID</option>*/}
                        {/*<option value="Negambo">Negambo</option>*/}
                        {/*</select>*/}
                      </div>
                      <Button
                        onClick={this.sendFault}
                        style={{ marginLeft: 5 }}
                        color="danger"
                      >
                        Power Down
                      </Button>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={12}>
                      <p>
                        2. Add current table (Do not use this without except
                        admin)
                      </p>

                      <AddExelCurrentData branch={this.state.branch} />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

FaultGenerator.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(FaultGenerator);
