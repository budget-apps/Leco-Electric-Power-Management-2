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
  constructor(props){
    super(props)
    this.state={
      branch:""
    }
  }
  
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

  generateSwitchTable(swit){
    let new_swithch_table = []
    let sw_list = this.state.switch_list
    let feed_list = this.state.feeding_list
    let no_open_list = this.state.noopensw_list
    let action = swit
    console.log("Action"+action)
    if(action === "Feeders"){
      for(let i=0;i<feed_list.length;i++){
      let temp_table = []
      temp_table.push(feed_list[i], this.getSectionOfSwitch(this.state.switchtable, feed_list[i]))
      new_swithch_table.push(temp_table)
      }
      console.log("Selected : Feeders")
      console.log(new_swithch_table)
      this.setState({
        new_swithch_table: new_swithch_table
      })
    }else if(action === "NOOpenSwithces"){
      for(let i=0;i<sw_list.length;i++){
        let temp_table = []
        temp_table.push(no_open_list[i], this.getSectionOfSwitch(this.state.switchtable, no_open_list[i]))
        new_swithch_table.push(temp_table)
        }
        console.log("Selected : NOOpenSwithces")
        console.log(new_swithch_table)
        this.setState({
          new_swithch_table: new_swithch_table
        })
    }else{
      for(let i=0;i<sw_list.length;i++){
        let temp_table = []
        temp_table.push(sw_list[i], this.getSectionOfSwitch(this.state.switchtable, sw_list[i]))
        new_swithch_table.push(temp_table)
        }
        console.log("Selected : AllSwithces")
        console.log(new_swithch_table)
        this.setState({
          new_swithch_table: new_swithch_table
        })
    }

    
  }


  filterSwitchEventHandler=(event)=>{

    if(!this.state.branch.length>0){
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Please select a branch!',
      })
      return
    }

    if(this.state.switch_list!=null) {
      this.setState({
        filterAction: event.target.value
      })
      try {
        this.generateSwitchTable(event.target.value)
      } catch (err) {
        console.log(err)
        Swal.fire({
          type: "info",
          title: 'Oops...',
          text: 'Please select a branch!',
        })
      }
    }
    else{
      Swal.fire({
        type: "error",
        title: "Please Wait",
        text: "Please wait a while after selecting branch"
      });
    }
    

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
      <div style={{marginTop:'40px'}}>
      <SelectBranch changed={this.selectMapEventHandler}/>
    </div>
      <div>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Switch Table</h4>
            <p className={classes.cardCategoryWhite}>
              Here is the table for {this.state===null?"":this.state.filterAction}
            </p>
            <FilterSwithces changed={this.filterSwitchEventHandler}/>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={['Switch', 'Sections']}
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