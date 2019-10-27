import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import SelectBranch from "../../components/SelectBranch/selectBranch";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import Swal from "sweetalert2";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { Graph } from "react-d3-graph";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import MyDiagram from "../../components/ManualMap/MyDiagram";
import {
  getSwitches,
  getSections,
  getNormallyOpenSwitches,
  getFeedingPoints,
  generatePhysicalConMatrix,
  generateElectricConnectivityMatrix,
  generateFeedingMatrix,
  generatePhysicalConnectionFeederMatrix,
  getSwitchesCurrent,
  generateMapState,
  getSectionOfSwitch,
  processPrevReconfigure
} from "./matrixOperations";
import {
  findFaultyFeeder,
  findFaultyPath,
  checkFaults,
  sendFaultCurrentRequest,
  getFaultLoc
} from "./faultFinder";
import {
  drawGraph,
  onClickNode,
  onRightClickNode,
  onRightClickLink
} from "./drawMap";
import { findRecofigurePaths, sendReconfigurePathsToDB } from "./reconfigure";
import { InputLabel } from "@material-ui/core";
//import Tree from 'react-d3-tree';
var firebase = require("firebase");

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 0,
      manual: false,
      show: false,
      faultSwitch: "",
      showErr: false,
      faultyFeeder: "",
      showLinkPopUp: false,
      closeLinkPopUp: false,
      affectedNodes: [],
      newNode: {
        id: "",
        section: ""
      },
      affectedSections: [
        {
          id: "",
          sections: []
        }
      ],
      branch: "",
      faultyPathSwithces: [],
      faultyPathSections: [],
      ButtonCaption: "View Graph Map",
      faultLoc: []
    };
    this.onChageNewID = this.onChageNewID.bind(this);
    this.onChageNewSection = this.onChageNewSection.bind(this);
  }

  handleClickOpen = (event, source, target) => {
    var affectedNodes = onRightClickLink(
      event,
      source,
      target,
      this.state.switch_list,
      this.state.switchtable
    );
    // console.log(affectedNodes)
    var affectnsections = [];
    affectedNodes.map(id => {
      var obj = {
        id: id,
        sections: getSectionOfSwitch(this.state.switchtable, id)
      };
      affectnsections.push(obj);
      return affectnsections
    });
    console.log(affectnsections);
    this.setState({ affectedSections: affectnsections });
    this.setState({ affectedNodes: affectedNodes });
    this.setState({ showLinkPopUp: true });
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  onChangeDB() {
    let branch = this.state.branch !== undefined ? this.state.branch : "";
    if (branch === "") {
      return "";
    }
    firebase
      .database()
      .ref()
      .child(branch)
      .child("faultSwitch")
      .on("value", function(snapshot) {
        // Do whatever
        //let switchids = snapshot.val()
        // Swal.fire({
        //   type: "info",
        //   title: "DBChanged",
        //   text: switchids
        // });
        //this.changeGrid(this.state.branch)
      });
  }

  changeGrid(branch){
    //console.log(this.state.branch)
    firebase
      .database()
      .ref()
      .child(branch)
      .once("value")

      .then(snapshot => {
        const val = snapshot.val();
        this.setState({
          logIndex: val.logIndex,
          switchtable: val.switchtable,
          noswitch: val.noswitch,
          feedpoints: val.feedpoints,
          faultSwitch: val.faultSwitch,
          currentTable: val.currentTable,
          prevReconfigure: val.reconfigure
        });

        this.setState({
          switch_list: getSwitches(this.state.switchtable),
          section_list: getSections(this.state.switchtable),
          noopensw_list: getNormallyOpenSwitches(this.state.noswitch),
          feeding_list: getFeedingPoints(this.state.feedpoints),
          allFaultPaths: processPrevReconfigure(this.state.prevReconfigure)
        });

        this.setState({
          physicalConMatrix: generatePhysicalConMatrix(
            this.state.switchtable,
            this.state.switch_list,
            this.state.section_list
          )
        });
        this.setState({
          electricConMatrix: generateElectricConnectivityMatrix(
            this.state.physicalConMatrix,
            this.state.noopensw_list,
            this.state.switch_list,
            this.state.section_list
          )
        });
        this.setState({
          feedMatrix: generateFeedingMatrix(
            this.state.electricConMatrix,
            this.state.feeding_list,
            this.state.switch_list,
            this.state.section_list
          )
        });
        this.setState({
          physicalConFeedMatrix: generatePhysicalConnectionFeederMatrix(
            this.state.physicalConMatrix,
            this.state.feeding_list,
            this.state.switch_list,
            this.state.section_list
          )
        });

        //Find Faults
        this.findingFaults();

        this.setState({
          currentSwVal: getSwitchesCurrent(this.state.currentTable)
        });
        
        //Map State
        this.setState({
          mapState: generateMapState(this.state.switch_list,this.state.noopensw_list,this.state.branch,this.state.faultSwitch, this.state.faultLoc, this.state.allFaultPaths),
        })

        //Draw graph
        let graphData = drawGraph(
          this.state.feeding_list,
          this.state.noopensw_list,
          this.state.switch_list,
          this.state.section_list,
          this.state.faultyPathSwithces,
          this.state.faultyPathSections,
          this.state.switchtable,
          this.state.faultSwitch,
          this.state.allFaultPaths,
          this.state.mapState,
        )[0];
        let graphConfig = drawGraph(
          this.state.feeding_list,
          this.state.noopensw_list,
          this.state.switch_list,
          this.state.section_list,
          this.state.faultyPathSwithces,
          this.state.faultyPathSections,
          this.state.switchtable,
          this.state.faultSwitch,
          this.state.allFaultPaths,
          this.state.mapState,
        )[1];
        this.setState({
          graph_data: graphData,
          graph_config: graphConfig
        });
        //this.drawTree()
      })
      .catch(e => {
        console.log(e);
        Swal.fire({
          type: "error",
          title: e.name,
          text: e.message
        });
      });
  }

  findingFaults = () => {
    if (checkFaults(this.state.faultSwitch)) {
      this.setState({
        faultyFeeder: findFaultyFeeder(
          this.state.faultSwitch,
          this.state.feedMatrix,
          this.state.switch_list
        )
      });

      let path = findFaultyPath(
        this.state.faultyFeeder,
        this.state.feedMatrix
      )[0];
      let faultyPathSwithces = findFaultyPath(
        this.state.faultyFeeder,
        this.state.feedMatrix
      )[1];
      let faultyPathSections = findFaultyPath(
        this.state.faultyFeeder,
        this.state.feedMatrix
      )[2];
      console.log(faultyPathSections);
      console.log(faultyPathSwithces);
      this.setState({
        path: path,
        faultyPathSwithces: faultyPathSwithces,
        faultyPathSections: faultyPathSections
      });

      //sendFaultRequests
      sendFaultCurrentRequest(
        this.state.faultyPathSwithces,
        this.state.branch,
        this.state.faultSwitch,
        this.state.switch_list
      );
      
      firebase.database().ref().child(this.state.branch).child('faultCurrentRequest').once("value").then(snapshot => {
        const val = snapshot.val();
        this.setState({
          faultCurrentSwitchesNotValid: val.switchID.split(
            ","
          ),
          faultCurrentSwitches: val.switchIDValid.split(
            ","
          ),
        })

        //Find Loc
      let validSet = [];
      console.log(this.state.faultCurrentSwitchesNotValid[0]);
      console.log(this.state.faultCurrentSwitches[0]);
      if (this.state.faultCurrentSwitchesNotValid[0] === "") {
        console.log("In 1st condition")
        validSet = [];
      } else {
        if (this.state.faultCurrentSwitches[0] !== "") {
          console.log("In 2nd condition")
          validSet = this.state.faultCurrentSwitches;
        } else {
          console.log("In 3rd condition")
          console.log(this.state.faultSwitch.split(","))
          validSet = this.state.faultSwitch.split(",");
        }
      }

      console.log(validSet);
      let loc = getFaultLoc(
        this.state.faultyPathSwithces,
        validSet,
        this.state.switch_list,
        this.state.switchtable
      );
      this.setState({
        faultLoc: loc
      });
      console.log(this.state.faultLoc);

      //reconfigure
      this.setState({
        reconfigurePaths: findRecofigurePaths(
          this.state.faultLoc,
          this.state.noopensw_list,
          this.state.switchtable,
          this.state.switch_list,
          this.state.physicalConFeedMatrix,
          this.state.faultSwitch,
          this.state.faultyPathSections,
          this.state.section_list
        )
      });

      sendReconfigurePathsToDB(
        this.state.switch_list,
        this.state.logIndex,
        this.state.branch,
        this.state.faultSwitch,
        this.state.faultyFeeder,
        this.state.path,
        this.state.faultLoc,
        Date(),
        false,
        this.state.reconfigurePaths
      );

      Swal.fire({
        type: "error",
        title: "NodeFailure",
        text:
          "At " +
          this.state.faultSwitch +
          ".(*" +
          this.state.faultyFeeder[0] +
          "*)"
      });

      })

      
    }
  };

  /*Change map details on change of the drop down*/
  selectMapEventHandler = event => {
    this.setState({
      branch: event.target.value
    });
    this.changeGrid(event.target.value)
  };
  onChangeWithInput = (node, e) => {
    var arr = this.state.affectedSections;
    var sectionarr = node.sections;
    sectionarr[e.target.id] = e.target.value;
    var index = arr.findIndex(x => x.id === node.id);
    var updateObject = {
      id: node.id,
      sections: sectionarr
    };
    arr[index] = updateObject;
    this.setState({ affectedSections: arr });
  };

  chageMap=()=>{
    if(this.state.branch!==""){
      if(!this.state.manual){
        this.setState({ButtonCaption:"View Structural Map"})
      }
      else{
        this.setState({ButtonCaption:"View Graph Map"})
      }
      this.setState({ manual: !this.state.manual });
    }
    else{
      Swal.fire({
        type: "error",
        title: "No Branch Selected",
        text: "Please select a branch!"
      });
    }
  };

  handleClose = () => {
    this.setState({ showLinkPopUp: false, closeLinkPopUp: true });
  };

  submit = () => {
    console.log(this.state.newNode);
    console.log(this.state.affectedNodes);
    console.log(this.state.affectedSections);
  };

  onChageNewID = e => {
    e.persist();

    this.setState(prevState => ({
      newNode: {
        // object that we want to update
        ...prevState.newNode, // keep all other key-value pairs
        id: e.target.value // update the value of specific key
      }
    }));
  };

  onChageNewSection = e => {
    e.persist();

    this.setState(prevState => ({
      newNode: {
        // object that we want to update
        ...prevState.newNode, // keep all other key-value pairs
        section: e.target.value // update the value of specific key
      }
    }));
  };

  hadleOnclickErrorBtn = () => {};

  render() {
    this.onChangeDB();
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.state.showLinkPopUp}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Add New Node</h4>
            </CardHeader>
          </DialogTitle>
          <DialogContent>
            {/*<DialogContentText id="alert-dialog-description">*/}
            {/*    Let Google help apps determine location. This means sending anonymous location data to*/}
            {/*    Google, even when no apps are running.*/}
            {/*</DialogContentText>*/}
            <form>
              <FormLabel
                style={{ color: "green", textDecorationLine: "underline" }}
              >
                New Node Details
              </FormLabel>
              <TextField
                id="id"
                label="New Id"
                margin="dense"
                value={this.state.newNode.id}
                onChange={this.onChageNewID}
              />
              <TextField
                id="section"
                label="New Section"
                margin="dense"
                value={this.state.newNode.section}
                onChange={this.onChageNewSection}
              />
              <div>
                <FormLabel
                  style={{
                    color: "green",
                    top: "50px",
                    textDecorationLine: "underline"
                  }}
                >
                  AffectedNodes
                </FormLabel>
                <div>
                  {this.state.affectedSections.map(node => (
                    <div>
                      <InputLabel style={{ color: "blue" }}>
                        {node.id}
                      </InputLabel>
                      {/* eslint-disable-next-line no-unused-vars */}
                      {node.sections.map((section, index) => (
                        <TextField
                          id={index}
                          label="Edit Section"
                          margin="dense"
                          value={section}
                          onChange={e => this.onChangeWithInput(node, e)}
                        />
                      ))}
                      {"\n"}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={this.submit} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <div className="row">
          <div className="col-md-3">
            <SelectBranch changed={this.selectMapEventHandler} />
          </div>
          <div>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  {this.state.faultSwitch === "" ? (
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>
                        {this.state != null ? this.state.branch : ""} Electric
                        Grid {this.state.manual?"(Graph View)":"(Structural View)"}
                      </h4>

                      <p className={classes.cardCategoryWhite}>
                        Physical connection graph will display here. (Click on
                        node for auto arrange them)
                      </p>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.chageMap}
                      >
                        {this.state.ButtonCaption}
                      </Button>
                    </CardHeader>
                  ) : (
                    <CardHeader color="danger">
                      <h4 className={classes.cardTitleWhite}>
                        {this.state != null ? this.state.branch : ""} Electric
                        Grid {this.state.manual?"(Graph View)":"(Structural View)"} <small>(Check logs)</small>
                      </h4>
                      <p className={classes.cardCategoryWhite}>
                        Physical connection graph will display here.(Click on
                        node for auto arrange them)
                      </p>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.chageMap}
                      >
                        {this.state.ButtonCaption}
                      </Button>
                    </CardHeader>
                  )}
                  <CardBody id="Map" style={{ marginTop: 10 }}>
                    <div>
                      {this.state.graph_data === undefined ? (
                        "Please select a branch"
                      ) : this.state.manual ? (
                        <div>
                           <Graph
                            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                            data={this.state.graph_data}
                            config={this.state.graph_config}
                            onClickNode={nodeId =>
                              onClickNode(
                                nodeId,
                                this.state.noopensw_list,
                                this.state.feeding_list,
                                this.state.currentSwVal,
                                this.state.switch_list,
                              )
                            }
                            onRightClickNode={onRightClickNode}
                            onRightClickLink={(event, source, target) =>
                              this.handleClickOpen(event, source, target)
                            }
                          />
                          
                        </div>
                      ) : (
                        <div>
                          <MyDiagram></MyDiagram>
                        </div>
                      )}
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
