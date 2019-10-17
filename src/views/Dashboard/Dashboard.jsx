
import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import SelectBranch from '../../components/SelectBranch/selectBranch'
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import Swal from "sweetalert2";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { Graph } from 'react-d3-graph';

import { getSwitches, getSections, getNormallyOpenSwitches, getFeedingPoints, generatePhysicalConMatrix, generateElectricConnectivityMatrix, generateFeedingMatrix, generatePhysicalConnectionFeederMatrix } from "./matrixOperations";
import {findFaultyFeeder, findFaultyPath, checkFaults, sendFaultCurrentRequest, getFaultLoc} from './faultFinder'
import {drawGraph, onClickNode, onRightClickNode, onRightClickLink} from "./drawMap"
import {findRecofigurePaths, sendReconfigurePathsToDB} from './reconfigure'
//import Tree from 'react-d3-tree';
var firebase = require("firebase");

class Dashboard extends React.Component {
  constructor(){
    super()
    this.state = {
      value: 0,
      show:false,
      faultSwitch: "",
      showErr: false,
      faultyFeeder: "",
    };
  }
  
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  onChangeDB(){
    let branch = this.state.branch!==undefined?this.state.branch:""
    if(branch===""){return ""}
    firebase.database().ref().child(branch).child('faultSwitch').on('value', function(snapshot) {
      // Do whatever
      //let switchids = snapshot.val()
      //console.log(switchids)
      //this.findingFaults()
    })
  }

  findingFaults = () => {
    if(checkFaults(this.state.faultSwitch)){
      this.setState({
        faultyFeeder: findFaultyFeeder(this.state.faultSwitch, this.state.feedMatrix, this.state.switch_list)
      })
      Swal.fire({
        type: 'error',
        title: 'NodeFailure',
        text: "At "+this.state.faultSwitch + ".(*"+ this.state.faultyFeeder[0] + "*)",
      })
      let path = findFaultyPath(this.state.faultyFeeder,this.state.feedMatrix)[0]
      let faultyPathSwithces = findFaultyPath(this.state.faultyFeeder,this.state.feedMatrix)[1]
      let faultyPathSections = findFaultyPath(this.state.faultyFeeder,this.state.feedMatrix)[2]

      this.setState({
        path: path, 
        faultyPathSwithces: faultyPathSwithces, 
        faultyPathSections: faultyPathSections
      })
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
        this.setState({logIndex: val.logIndex,switchtable:val.switchtable,noswitch:val.noswitch,feedpoints:val.feedpoints,faultSwitch:val.faultSwitch, faultCurrentSwitches: val.faultCurrentRequest.switchIDValid.split(',')})
        
        this.setState({
          switch_list: getSwitches(this.state.switchtable),
          section_list: getSections(this.state.switchtable),
          noopensw_list: getNormallyOpenSwitches(this.state.noswitch),
          feeding_list: getFeedingPoints(this.state.feedpoints),
        })

        this.setState({
          physicalConMatrix: generatePhysicalConMatrix(this.state.switchtable, this.state.switch_list, this.state.section_list)
        })
        this.setState({
          electricConMatrix: generateElectricConnectivityMatrix(this.state.physicalConMatrix,this.state.noopensw_list,this.state.switch_list,this.state.section_list)
        })
        this.setState({
          feedMatrix: generateFeedingMatrix(this.state.electricConMatrix, this.state.feeding_list,this.state.switch_list,this.state.section_list)
        })
        this.setState({
          physicalConFeedMatrix: generatePhysicalConnectionFeederMatrix(this.state.physicalConMatrix, this.state.feeding_list,this.state.switch_list,this.state.section_list)
        })

        //Find Faults
        this.findingFaults()

        //sendFaultRequests
        sendFaultCurrentRequest(this.state.faultyPathSwithces, this.state.branch, this.state.faultSwitch, this.state.switch_list)

        //Find Loc
        let validSet = this.state.faultCurrentSwitches[0]!==""?this.state.faultCurrentSwitches:this.state.faultSwitch.split(',')
        let loc = getFaultLoc(this.state.faultyPathSwithces, validSet, this.state.switch_list, this.state.switchtable)
        this.setState({
          faultLoc: loc
        })
        console.log(this.state.faultLoc)

        //reconfigure
        this.setState({
          reconfigurePaths: findRecofigurePaths(this.state.faultLoc, this.state.noopensw_list,this.state.switchtable, this.state.switch_list, this.state.physicalConFeedMatrix, this.state.faultSwitch)
        }) 

        sendReconfigurePathsToDB(this.state.logIndex, this.state.branch, this.state.faultSwitch, this.state.faultyFeeder, this.state.path, this.state.faultLoc, Date(), false, this.state.reconfigurePaths)

        //Draw graph
        let graphData = drawGraph(this.state.feeding_list,this.state.noopensw_list,this.state.switch_list,this.state.section_list,this.state.faultyPathSwithces, this.state.faultyPathSections, this.state.switchtable, this.state.faultSwitch)[0]
        let graphConfig = drawGraph(this.state.feeding_list,this.state.noopensw_list,this.state.switch_list,this.state.section_list,this.state.faultyPathSwithces, this.state.faultyPathSections, this.state.switchtable, this.state.faultSwitch)[1]
        this.setState({
          graph_data: graphData,
          graph_config: graphConfig
        })
        //this.drawTree()
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

  hadleOnclickErrorBtn = () =>{
  }

  render() {
    this.onChangeDB()
    const { classes } = this.props;
    return (
      <div>
        <div className="row">
            <div className="col-md-3">
                <SelectBranch changed={this.selectMapEventHandler}/>
            </div>
            <div>
              <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                {this.state.faultSwitch===""?
                  <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>{this.state!=null?this.state.branch:""} Electric Grid (Graph View)</h4>
                  <p className={classes.cardCategoryWhite}>
                    Physical connection graph will display here. (Click on node for auto arrange them)
                  </p>
                </CardHeader>
                :
                <CardHeader color="danger">
                <h4 className={classes.cardTitleWhite}>{this.state!=null?this.state.branch:""} Electric Grid (Graph View) <small>(Check logs)</small></h4>
                  <p className={classes.cardCategoryWhite}>
                    Physical connection graph will display here.(Click on node for auto arrange them)
                  </p>
                </CardHeader>
                }
                  <CardBody id="Map" style={{marginTop: 10}}>
                  <div>
                    {this.state.graph_data===undefined?"Please select a branch":
                      <Graph
                        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                        data={this.state.graph_data}
                        config={this.state.graph_config}
                        onClickNode={(nodeId)=>onClickNode(nodeId, this.state.noopensw_list, this.state.feeding_list)}
                        onRightClickNode={onRightClickNode}
                        onRightClickLink={onRightClickLink}
                      />
                    }
                  </div>
                  {/* {this.state.treeData===undefined?"Please select a branch"
                    :
                    <div id="treeWrapper" style={{width: '50em', height: '20em'}}>
                      <Tree orientation={'vertical'} data={this.state.treeData} />
                    </div>
                  } */}
                  </CardBody>
                </Card>
              </GridItem>
            
            </GridContainer>
        </div>
          </div>     
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
