
import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AddExelSheet from '../../components/Addexcel/addexcel.js'
import SelectBranch from '../../components/SelectBranch/selectBranch'
import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import Swal from "sweetalert2";
import Button from 'react-bootstrap/Button'
import { Graph } from 'react-d3-graph';

var firebase = require("firebase");

class Dashboard extends React.Component {
  constructor(){
    super()
    this.state = {
      value: 0,
      show:false
    };
  }
  
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

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
        return switchtable[i].section.split(",")
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

  generatePhysicalConMatrix(switchtable){
    let switch_list = this.state.switch_list
    let section_list = this.state.section_list

    let physicalConMatrix = []

    for(let i=0;i<switch_list.length;i++){
      let temp_list = []
      for(let j=0;j<section_list.length;j++){
        temp_list[j] = 0
      }
      physicalConMatrix.push(temp_list)
    }

    for(let i=0;i<switch_list.length; i++){
      //console.log(this.getSectionOfSwitch(switchtable, switch_list[i]))
      let temp_list = this.getSectionOfSwitch(switchtable, switch_list[i])
      for (let j=0; j<temp_list.length; j++){
        physicalConMatrix[i][section_list.indexOf(temp_list[j])] = 1
      }
    }
    console.log("Physical connection matrix")
    console.log(physicalConMatrix)
  }

  drawGraph(){
    let feed_list = this.state.feeding_list
    let noopn_list = this.state.noopensw_list
    let sw_list = this.state.switch_list
    let se_list = this.state.section_list
    let nodes_arr = []
    let link_arr = []

    for(let i=0;i<se_list.length;i++){
      nodes_arr.push({id: se_list[i],color: "black", size: 300, symbolType: "circle", cx:10, cy:22, dx: 90})
    }

    for(let i=0;i<sw_list.length;i++){
      let id = sw_list[i]
      let color = "green"
      let size = 600
      let symbolType = "square"
      if(noopn_list.includes(sw_list[i])){
        color = "yellow"
      }else if (feed_list.includes(sw_list[i])){
        color = "blue"
      }
      nodes_arr.push({id: id,color: color, size: size, symbolType: symbolType})

      let section_list = this.getSectionOfSwitch(this.state.switchtable, sw_list[i])
      for(let j=0;j<section_list.length;j++){
          link_arr.push({source: id, target: section_list[j]})
      }
    }

    const graph_data = {
        nodes: nodes_arr,
        links: link_arr
    };

    // const graph_data = {
    //   nodes: [{ id: 'Harry', color: 'black' }, { id: 'Sally' }, { id: 'Alice' }],
    //   links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
    // };
    const graph_config = {
      nodeHighlightBehavior: true,
      node: {
          color: 'lightgreen',
          size: 120,
          highlightStrokeColor: 'blue'
      },
      link: {
          highlightColor: 'lightblue'
      }
    };
    this.setState(
      {
        graph_data: graph_data,
        graph_config: graph_config
      }
    )
    console.log(this.state.graph_data)
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

        this.generatePhysicalConMatrix(this.state.switchtable)

        this.drawGraph()

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

  handleClose = () => {
    this.setState({
      show: false,
  });
  }

  handleShow = () => {
    this.setState({
      show: true,
  });
    
  }

  render() {
    return (
      <div>
        <div className="row">
            <div style={{"border": "2px solid black", "border-radius": "10px", "padding": "10px", "margin-bottom": "5px"}}>
              <button onClick={this.handleShow} className="btn btn-default btn-sm">Upload <i className="fa fa-arrow-up"></i></button>
            </div>
            <div className="col-md-3" style={{"border": "2px solid black", "border-radius": "10px", "padding": "10px", "margin-bottom": "5px"}}>
                <SelectBranch changed={this.selectMapEventHandler}/>
            </div>
            <div style={{"border": "2px solid black", "border-radius": "10px", "padding": "10px", "margin-bottom": "5px"}}>
              {this.state.graph_data===undefined?"":
                <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={this.state.graph_data}
                config={this.state.graph_config}
                />
              }
              
            </div>
        </div>  
        <div>
        <Dialog
          open={this.state.show}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Upload excel files here"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddExelSheet/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </div>             
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
