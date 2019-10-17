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
import { getSwitches, getSections } from "../Dashboard/matrixOperations";
import {drawPath} from "../Dashboard/drawMap"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "components/CustomButtons/Button.jsx";
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
      subIndex: 0
    };
  }

  processLogs(reconfigure, switch_list, section_list, switchtable){
    console.log(reconfigure)
    let tableData = []
    for(let i=1;i<reconfigure.length;i++){
      let faultSwitch = reconfigure[i]['faultSwitch']
      let faultyFeeder = JSON.parse(reconfigure[i]['faultyFeeder'])
      let faultyPath = JSON.parse(reconfigure[i]['faultyPath'])
      let faultySection = JSON.parse(reconfigure[i]['faultySection'])
      let isFaultRepaired = reconfigure[i]['isFaultRepaired']
      let reconfiguredPaths = JSON.parse(reconfigure[i]['reconfiguredPaths'])
      let time = reconfigure[i]['time']
      console.log(faultSwitch)
      console.log(faultyFeeder)
      console.log(faultyPath)
      console.log(faultySection)
      console.log(isFaultRepaired)
      console.log(reconfiguredPaths)
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
        viewBtn.push(<button onClick={()=>this.handleShow(i-1, j)}>View Reconfigure {j+1}</button>)
      }
      let gphs = this.state.graphs
      gphs.push(graphDatas)
      console.log(gphs[0][0][0])
      let details = []
      let dts = <div>Fault switch is {faultSwitch}. Faulty Feeder is {faultyFeeder[0]}.</div>
      details.push(dts)
      details.push(viewBtn)
      let row = [time, details, <button>Repaired</button>]
      tableData.push(row)
      
    }
    this.setState({
      tableData: tableData
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
        
        this.setState({faultSwitch:val.faultSwitch,log: val.reconfigure, switchtable: val.switchtable})
        this.setState({
          switch_list: getSwitches(this.state.switchtable),
          section_list: getSections(this.state.switchtable),
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

  showGraphs(){
    let arr = this.state.graphs[this.state.viewIndex]
    for(let i=0;i<arr.length;i++){
      console.log(arr[i])
      return arr[i]
    }
  }
  render(){
    const { classes } = this.props;
    console.log(this.state.graphs!==undefined?this.state.graphs[this.state.viewIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex]!==undefined?this.state.graphs[this.state.viewIndex][this.state.subIndex][0]:"No":"Noo":"Nooo")
    // const table_data= this.state===null?"":this.state.physicalConMatrix;
    console.log("table data"+(this.state===null?"":this.state.physicalConMatrix));
    return (
    <div>
      <div>
        <Dialog
          open={this.state.show}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Reconfigurations paths"}</DialogTitle>
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
          <Button onClick={this.handleClose} color="success">
            Reconfigure
          </Button>
        </DialogActions>
       </Dialog>
      </div>   
      <div>
      <SelectBranch changed={this.selectMapEventHandler}/>
    </div>
      <div>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="warning">
            <h4 className={classes.cardTitleWhite}>Logs</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
          <Table
              tableHeaderColor="primary"
              tableHead={['Timestamp', 'Details', 'Repaired']}
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