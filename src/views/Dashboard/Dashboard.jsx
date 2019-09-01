
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
import AddExelFeeding from "components/AddExelFeedingPoint/addexcelfeeding.js";
import AddExelNOSwitch from "components/AddExelNOSwitch/addexcelnoswitch.js";
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
    // graph payload (with minimalist structure)
    const graph_data = {
      nodes: [{ id: 'Harry', color: 'black' }, { id: 'Sally' }, { id: 'Alice' }],
      links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
    };
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
        this.setState({switchtable:val.switchtable})

        this.getSwitches(this.state.switchtable)
        this.getSections(this.state.switchtable)
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
      show1: false,
      show2: false,
      show3: false,
  });
  }

  handleShow = (id) => {
    if(id===1){
      this.setState({
        show1: true,
        show2: false,
        show3: false,
    });
    }else if (id===2){
      this.setState({
        show1: false,
        show2: true,
        show3: false,
    });
    }else if (id===3){
      this.setState({
        show1: false,
        show2: false,
        show3: true,
    });
    }
    
  }

  render() {
    return (
      <div>
        <div className="row">
            <div>
              <button onClick={() => this.handleShow(1)} className="btn btn-default btn-sm">Switch Table <i className="fa fa-arrow-up"></i></button>
              <button onClick={() => this.handleShow(2)} className="btn btn-default btn-sm">Feed Points Table <i className="fa fa-arrow-up"></i></button>
              <button onClick={() => this.handleShow(3)} className="btn btn-default btn-sm">Normally Open Table <i className="fa fa-arrow-up"></i></button>
            </div>
            <div className="col-md-3">
                <SelectBranch changed={this.selectMapEventHandler}/>
            </div>
            <div>
              {this.state.graph_data==undefined?"":
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
          open={this.state.show1}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Upload switch table excel files here"}</DialogTitle>
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
      <Dialog
          open={this.state.show2}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Upload feeding points table excel files here"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddExelFeeding/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
          open={this.state.show3}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Upload normally open switches table excel files here"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddExelNOSwitch/>
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
