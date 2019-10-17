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
//import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from '../../components/CustomButtons/Button.jsx';

import Swal from "sweetalert2";
//import SelectBranch from "components/SelectBranch/selectBranch";
//import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
//import People from "@material-ui/icons/People";
// core components
//import CustomInput from "../../components/CustomInput/CustomInput";
import SelectBranch from '../../components/SelectBranch/selectBranch'
var firebase = require("firebase");

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

class FaultGenerator extends React.Component {
  constructor(props){
    super(props)
    this.state = {switchId: ''}
  }
  /*Change map details on change of the drop down*/
  selectMapEventHandler=(event)=>{
    this.setState({
        branch: event.target.value
    })
  }
  
  onChangeHandler = (event) => {
    this.setState({
      switchId: event.target.value
    })
    console.log(this.state.switchId)
  }

  sendFault = () => {
    let branch = this.state.branch
    let switchid = this.state.switchId

    try{
      firebase.database().ref().child(branch).child('faultSwitch').set(switchid)
      Swal.fire({
        type: 'success',
        title: "SwitchOFF",
        text: switchid+" turned off.",
    })
    }catch(e){
      Swal.fire({
        type: 'error',
        title: e.name,
        text: 'Please select a branch',
    })
    }
    this.setState({
      switchId: ''
    })
  }

  onChangeDB(){
    let branch = this.state.branch!==undefined?this.state.branch:""
    if(branch===""){return ""}
    firebase.database().ref().child(branch).child('faultCurrentRequest').child('switchID').on('value', function(snapshot) {
      // Do whatever
      let switchids = snapshot.val().split(',')
      console.log(switchids)
      if(switchids!==''){
        Swal.fire({
          type: 'info',
          title: 'RequestFaultLocation',
          text: 'Requesting switches are '+switchids.toString()+".",
          input: 'text',
          inputPlaceholder: 'Enter swithces',
          showCancelButton: true,
          inputValidator: (value) => {
            // if (!value) {
            //   return 'You need to write something!'
            // }
            // else{
            firebase.database().ref().child(branch).child('faultCurrentRequest').child('switchIDValid').set(value)
              
              // Swal.fire({
              //   type: 'success',
              //   text: 'Fault location sent.'
              // })
            //}
          }
        })
      }
    })
  }

  render() {
    this.onChangeDB()
    const { classes } = this.props;
    // const table_data= this.state===null?"":this.state.physicalConMatrix;
    //console.log("table data"+(this.state===null?"":this.state.electricConMatrix));
    return (
      <div>
        <div>
        <div className="col-md-3">
          <SelectBranch changed={this.selectMapEventHandler}/>
        </div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success">
                <h4 className={classes.cardTitleWhite}>
                  Fault Generater
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={6} sm={6} md={6}>
                    <input
                        type='text'
                        value={this.state.switchId}
                        onChange={this.onChangeHandler}
                        placeholder="Switch ID"
                    />
                    <Button onClick={this.sendFault} style={{marginLeft: 5}} color="danger">Power Down</Button>
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
