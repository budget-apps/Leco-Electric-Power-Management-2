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
import { Graph } from 'react-d3-graph';
import Swal from "sweetalert2";
import SelectBranch from "components/SelectBranch/selectBranch";
import { getSwitches, getSections, getNormallyOpenSwitches, resetMapState, reconfigureMapState, isolateMapState } from "../Dashboard/matrixOperations";
import {drawPath} from "../Dashboard/drawMap"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "components/CustomButtons/Button.jsx";
import CheckIcon from '@material-ui/icons/Check';


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

class PhysicalConnectivity extends React.Component {
  constructor(){
    super()
    this.state = {
      tableData: [[]],
      graphs: [],
      viewIndex: 0,
      subIndex: 0,
      showOp: false
    };
  }

  processLogs(reconfigure, switch_list, section_list, switchtable){

    let tableData = []
    for(let i=1;i<reconfigure.length;i++){
      let faultSwitch = reconfigure[i]['faultSwitch']
      let faultyFeeder = JSON.parse(reconfigure[i]['faultyFeeder'])
      //let faultyPath = JSON.parse(reconfigure[i]['faultyPath'])
      let faultySection = JSON.parse(reconfigure[i]['faultySection'])
      let isFaultRepaired = reconfigure[i]['isFaultRepaired']
      let reconfiguredPaths = JSON.parse(reconfigure[i]['reconfiguredPaths'])
      let time = reconfigure[i]['time']
      let optimalPath = reconfigure[i]['optimalPath']
      // console.log(faultSwitch)
      // console.log(faultyFeeder)
      // console.log(faultyPath)
      console.log(faultySection)
      // console.log(isFaultRepaired)
      // console.log(reconfiguredPaths)
      console.log(optimalPath)
      let graphDatas = []
      let viewBtn = []
      for(let j=0;j<reconfiguredPaths.length;j++){
        let tempArr = reconfiguredPaths[j]
        console.log(tempArr)
        let sw = []
        let se = []
        for(let k=0;k<tempArr[0].length;k++){
          //console.log(tempArr[k][0])
          sw.push(switch_list[tempArr[0][k][0]])
          se.push(section_list[tempArr[0][k][1]])
        }
        console.log(sw)
        console.log(se)
        let graphData = drawPath(se, sw, switchtable)[0]
        let graphConfig  = drawPath(se, sw, switchtable)[1]

        graphDatas.push([graphData,graphConfig])
        viewBtn.push(<Button color='info' onClick={()=>this.handleShow(i-1, j)}>View Reconfigure {j+1}</Button>)
      }
      let gphs = this.state.graphs
      gphs.push(graphDatas)
      console.log(gphs[0][0][0])
      let details = []  
      let dts = <div>Fault switch is {faultSwitch}. Faulty Feeder is {faultyFeeder[0]}. Fault section is {JSON.stringify(faultySection[0])}.</div>
      details.push(dts)
      details.push(viewBtn)
      let opindex = <div>No Optimal path </div>
      if(optimalPath[0]!==undefined && optimalPath[0]!==-1){
        opindex = <Button color='primary' onClick={()=>this.handleShowOp(i-1, optimalPath[0])}>Optimal path </Button>
      }
      else{
        opindex = <Button color='primary' > No optimal path </Button>
      }
      details.push(opindex)
      details.push(<div>
                      <Button color='warning' onClick={()=>this.isolateBtnHandler(faultySection[0], this.state.mapState,this.state.branch, isFaultRepaired)}> Isolate </Button>
                      <Button color='success' onClick={()=>this.handleReconfigure(optimalPath, reconfiguredPaths, this.state.mapState, faultySection[0], isFaultRepaired, switch_list, faultSwitch, i)}> Reconfigure </Button>
                  </div>)
      let row = [time, details, <Button color={isFaultRepaired?"success":"default"} onClick={()=>this.repairedBtnHandler(i, isFaultRepaired)}>{isFaultRepaired?<div>Repaired <CheckIcon/></div>:"Repair"}</Button>]
      tableData.push(row)
      
    }

    this.setState({
      tableData: tableData
    })

  }

  isolateBtnHandler= (faultSection, mapState, branch, isFaultRepaired) => {
    if(!isFaultRepaired){
      isolateMapState(faultSection, mapState, branch)
      Swal.fire({
        title: 'Success!',
        text: "Fault section isolated successfully!",
        type: 'success',
      })
    }else{
      Swal.fire({
        title: 'Sorry!',
        text: "Fault repaired already!",
        type: 'error',
      })
    }
    
  }

  handleReconfigure = (optimalPath, reconfiguredPaths, mapState, faultySection, isFaultRepaired, switch_list, faultSwitch, logIndex) => {
    let path = reconfiguredPaths[optimalPath[0]]
    let upto = optimalPath[2]
    let affected = []
    let normal = []
    console.log(mapState)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reconfigure!'
    }).then((result) => {
      if (result['dismiss']!=='cancel') {
        if(!isFaultRepaired && faultySection[1]===upto && !faultySection.includes(faultSwitch)){
          console.log(path[0][0][0])
          affected.push(faultySection[0], faultySection[1])
          normal.push(faultSwitch, switch_list[path[0][0][0]])
          console.log(affected)
          reconfigureMapState(affected, normal, mapState, switch_list,this.state.branch, logIndex)
          Swal.fire({
            title: 'Reconfiguration Report',
            type: 'success',
            html:
              'Isolation: <b>'+faultySection[0]+',</b>'+faultySection[1]+'<br>'+
              'Upstream restored<br>'+
              'Reconfiguration<br>'
              +'Closed: <b>'+switch_list[path[0][0][0]]+'</b> <br>'
              +'Opened: <b></b> <br>',
            
          })
        }else if(!isFaultRepaired && faultySection[1]===upto && faultySection.includes(faultSwitch)){
    
          console.log(path[0][0])
          affected.push(faultySection[0], faultySection[1])
          normal.push(switch_list[path[0][0][0]])
          console.log(affected)
          reconfigureMapState(affected, normal, mapState, switch_list,this.state.branch, logIndex)
          Swal.fire({
            title: 'Reconfiguration Report',
            type: 'success',
            html:
              'Isolation: <b>'+faultySection[0]+',</b>'+faultySection[1]+'<br>'+
              'Upstream restored<br>'+
              'Reconfiguration<br>'
              +'Closed: <b>'+switch_list[path[0][0][0]]+'</b> <br>'
              +'Opened: <b></b> <br>',
            
          })
        }
        else if(!isFaultRepaired && faultySection[1]!==upto && !faultySection.includes(faultSwitch)){
    
          console.log(path[0][0])
          affected.push(faultySection[0], faultySection[1])
          normal.push(switch_list[path[0][0][0]])
          console.log(affected)
          reconfigureMapState(affected, normal, mapState, switch_list,this.state.branch, logIndex)
          Swal.fire({
            title: 'Reconfiguration Report',
            type: 'success',
            html:
              'Isolation: <b>'+faultySection[0]+',</b>'+faultySection[1]+'<br>'+
              'Upstream restored<br>'+
              'Reconfiguration<br>'
              +'Closed: <b>'+switch_list[path[0][0][0]]+'</b> <br>'
              +'Opened: <b></b> <br>',
            
          })
        }
        else if(!isFaultRepaired && faultySection[1]!==upto && faultySection.includes(faultSwitch)){
    
          console.log(path[0][0])
          affected.push(faultySection[0], faultySection[1])
          normal.push(switch_list[path[0][0][0]])
          console.log(affected)
          reconfigureMapState(affected, normal, mapState, switch_list,this.state.branch, logIndex)
          Swal.fire({
            title: 'Reconfiguration Report',
            type: 'success',
            html:
              'Isolation: <b>'+faultySection[0]+',</b>'+faultySection[1]+'<br>'+
              'Upstream restored<br>'+
              'Reconfiguration<br>'
              +'Closed: <b>'+switch_list[path[0][0][0]]+'</b> <br>'
              +'Opened: <b></b> <br>',
            
          })
        }
        else{
          Swal.fire({
            type: 'error',
            title: 'Unsuccessfull!!!',
            text: 'Cannot reconfigured!',
          })
        }
      }
    })
    

  }

  repairedBtnHandler = (index, isFaultRepaired) =>{
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Power up fault switch!'
    }).then((result) => {
      console.log(result['dismiss']==='cancel')
      if(!isFaultRepaired){
        if (result['dismiss']!=='cancel') {
          firebase.database().ref().child(this.state.branch).child('faultSwitch').set("")
          firebase.database().ref().child(this.state.branch).child('faultCurrentRequest').child("switchID").set("")
          firebase.database().ref().child(this.state.branch).child('faultCurrentRequest').child("switchIDValid").set("")
          firebase.database().ref().child(this.state.branch).child('reconfigure').child(index).child('isFaultRepaired').set(true)
          firebase.database().ref().child(this.state.branch).child('mapUpdated').set(false)
          resetMapState(this.state.switch_list,this.state.noopensw_list,this.state.branch)
          console.log("Updating "+index+" record...")
          Swal.fire({
            type: 'success',
            title: 'Successfull!!!',
            text: 'Fault switch power up succesfully!',
          })
        }
      }else{
        Swal.fire({
          type: 'error',
          title: 'Unsuccessfull!!!',
          text: 'Fault switch power up already!',
        })
      }
      
    })
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
        
        this.setState({faultSwitch:val.faultSwitch,log: val.reconfigure, switchtable: val.switchtable, logIndex: val.logIndex,  noswitch: val.noswitch, mapState: val.mapState})
        this.setState({
          switch_list: getSwitches(this.state.switchtable),
          section_list: getSections(this.state.switchtable),
          noopensw_list: getNormallyOpenSwitches(this.state.noswitch),
        })
        console.log(this.state.log)
        console.log(this.state.section_list)
        this.processLogs(this.state.log, this.state.switch_list, this.state.section_list, this.state.switchtable)
        console.log(this.state.graphs)
      })
    .catch((e) => {
        console.log(e)
        Swal.fire({
          type: 'error',
          title: e.name,
          text: e.message,
      })
    });

  }
  handleClose = () => {
    this.setState({
      show: false,
  });
  }

  handleShow = (viewIndex, subIndex) => {
    console.log(viewIndex, subIndex)
    this.setState({
      show: true,
      viewIndex: viewIndex,
      subIndex: subIndex
  });
    
  }

  handleCloseOp = () => {
    this.setState({
      showOp: false,
  });
  }

  handleShowOp = (viewIndex, subIndex) => {
    this.setState({
      showOp: true,
      viewIndex: viewIndex,
      subIndex: subIndex
  });
    
  }

  showGraphs(){
    let arr = this.state.graphs[this.state.viewIndex]
    for(let i=0;i<arr.length;i++){
      console.log(arr[i])
      return arr[i]
    }
  }
  render(){
    const { classes } = this.props;
    //console.log(this.state.graphs!==undefined?this.state.graphs[this.state.viewIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex][0]:"No":"Noo":"Nooo")
    // const table_data= this.state===null?"":this.state.physicalConMatrix;
    //console.log("table data"+(this.state===null?"":this.state.physicalConMatrix));
    return (
    <div>
      <div>
        <Dialog
          open={this.state.show}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Reconfiguration path"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={this.state.graphs!==undefined?this.state.graphs[this.state.viewIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex][0]:"No":"Noo":"Nooo"}
            config={this.state.graphs!==undefined?this.state.graphs[this.state.viewIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex][1]:"No":"Noo":"Nooo"}
          />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="danger">
            Close
          </Button>
        </DialogActions>
       </Dialog>
      </div>  

      <div>
        <Dialog
          open={this.state.showOp}
          onClose={this.handleCloseOp}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Optimal path"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Graph
              id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
              data={this.state.graphs!==undefined?this.state.graphs[this.state.viewIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex][0]:"No":"Noo":"Nooo"}
              config={this.state.graphs!==undefined?this.state.graphs[this.state.viewIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex][1]:"No":"Noo":"Nooo"}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseOp} color="danger">
            Close
          </Button>
        </DialogActions>
       </Dialog>
      </div>  

      <div style={{marginTop:'40px'}}>
      <SelectBranch changed={this.selectMapEventHandler}/>
    </div>
      <div>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Logs</h4>
            <p className={classes.cardCategoryWhite}>
              Fault log of the {this.state.branch} branch.
            </p>
          </CardHeader>
          <CardBody style={{maxHeight: 800, overflow: 'auto'}}>
          <Table
              tableHeaderColor="primary"
              tableHead={['Time', 'Details', 'Current Status']}
              tableData={this.state.tableData}
              
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

PhysicalConnectivity.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(PhysicalConnectivity);