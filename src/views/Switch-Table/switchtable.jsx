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
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FilterSwithces from "components/FilterSwithces/filterswithces"
import Swal from "sweetalert2";
import SelectBranch from "components/SelectBranch/selectBranch";
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



class SwitchTable extends React.Component {
  
  getSwitches(switchtable){
    let switch_list = []
    for (let i=0;i<switchtable.length;i++){
      switch_list.push(switchtable[i].switch)
    }
    console.log("Switches List: "+switch_list)
    this.setState({
      switch_list: switch_list
    })
  }

  getSections(switchtable){
    let section_list = []
    for (let i=0;i<switchtable.length;i++){
      let temp_list = switchtable[i].section.split(",")
      for(let j=0;j<temp_list.length;j++){
        if(section_list.indexOf(temp_list[j])===-1){
          section_list.push(temp_list[j])
        }
      }
      
    }
    console.log("Section List: "+section_list)
    this.setState({
      section_list: section_list
    })
  }

  getSectionOfSwitch(switchtable, switch_no){
    for (let i=0;i<switchtable.length;i++){
      if(switchtable[i].switch === switch_no){
        return switchtable[i].section
      } 
    }
  }

  getNormallyOpenSwitches(noopn){
    let noopensw_list = []
    for(let i=0;i<noopn.length;i++){
      noopensw_list.push(noopn[i].no_open)
    }
    console.log("Normally open switches: "+noopensw_list)
    this.setState({
      noopensw_list: noopensw_list
    })
  }

  getFeedingPoints(feedingpoints){
    let feeding_list = []
    for(let i=0;i<feedingpoints.length;i++){
      feeding_list.push(feedingpoints[i].feed_points)
    }
    console.log("Feeding points: "+feeding_list)
    this.setState({
      feeding_list: feeding_list
    })
  }

  generateSwitchTable(){
    let new_swithch_table = []
    let sw_list = this.state.switch_list
    let feed_list = this.state.feeding_list
    let no_open_list = this.state.noopensw_list
    let action = this.state.filterAction
    console.log(action)
    if(action === "Feeders"){
      for(let i=0;i<feed_list.length;i++){
      let temp_table = []
      temp_table.push(feed_list[i], this.getSectionOfSwitch(this.state.switchtable, feed_list[i]))
      new_swithch_table.push(temp_table)
      }
      console.log("Feeders")
      console.log(new_swithch_table)
      this.setState({
        new_swithch_table: new_swithch_table
      })
    }
    if(action === "AllSwithces"){
      for(let i=0;i<sw_list.length;i++){
        let temp_table = []
        temp_table.push(sw_list[i], this.getSectionOfSwitch(this.state.switchtable, sw_list[i]))
        new_swithch_table.push(temp_table)
        }
        console.log("AllSwithces")
        console.log(new_swithch_table)
        this.setState({
          new_swithch_table: new_swithch_table
        })
    }
    if(action === "NOOpenSwithces"){
      for(let i=0;i<sw_list.length;i++){
        let temp_table = []
        temp_table.push(no_open_list[i], this.getSectionOfSwitch(this.state.switchtable, no_open_list[i]))
        new_swithch_table.push(temp_table)
        }
        console.log("NOOpenSwithces")
        console.log(new_swithch_table)
        this.setState({
          new_swithch_table: new_swithch_table
        })
    }

    
  }

  filterSwitchEventHandler=(event)=>{
    this.setState({
      filterAction: event.target.value
    })
    this.generateSwitchTable()

  } 


  /*Change map details on change of the drop down*/
  selectMapEventHandler=(event)=>{
    this.setState({
        branch: event.target.value
    })
    //console.log(this.state.branch)
    firebase.database().ref().child(event.target.value)
    .once('value')
    
    .then((snapshot) => {
        const val = snapshot.val();
        this.setState({switchtable:val.switchtable,noswitch:val.noswitch,feedpoints:val.feedpoints})

        this.getSwitches(this.state.switchtable)
        this.getSections(this.state.switchtable)
        this.getNormallyOpenSwitches(this.state.noswitch)
        this.getFeedingPoints(this.state.feedpoints)

        

      })
      .catch((e) => {
          console.log(e)
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
          })
      });

  }

  render(){
    const { classes } = this.props;
    return (
    <div>
      <div>
      <SelectBranch changed={this.selectMapEventHandler}/>
    </div>
      <div>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Switch Table</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
            <FilterSwithces changed={this.filterSwitchEventHandler}/>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={['Switch', 'section']}
              tableData={this.state===null?[[]]:this.state.new_swithch_table===undefined?[[]]:this.state.new_swithch_table}
            />
          </CardBody>
        </Card>
      </GridItem>
     
    </GridContainer>
      </div>
      
    
    </div>
    
  );
}
}

SwitchTable.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(SwitchTable);