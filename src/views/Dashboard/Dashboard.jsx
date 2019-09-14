
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

var firebase = require("firebase");

class Dashboard extends React.Component {
  constructor(){
    super()
    this.state = {
      value: 0,
      show:false,
      faultSwitch: ""
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
    this.setState({
      physicalConMatrix: physicalConMatrix
    })
    console.log("Physical connection matrix")
    console.log(physicalConMatrix)
  }

  generateElectricConnectivityMatrix(){
    let electricConMatrix = JSON.parse(JSON.stringify(this.state.physicalConMatrix))
    let no_open = this.state.noopensw_list
    let sw_list = this.state.switch_list
    let se_list_len = this.state.section_list.length

    for(let i=0;i<no_open.length;i++){
      let sw_index = sw_list.indexOf(no_open[i])
      for(let j=0;j<se_list_len;j++){
        electricConMatrix[sw_index][j] = 0
      }
    }
    this.setState({
      electricConMatrix: electricConMatrix
    })
    console.log("Electric connected matrix")
    console.log(electricConMatrix)
  }

  generateFeedingMatrix(){
    let feedMatrix = JSON.parse(JSON.stringify(this.state.electricConMatrix))
    let feed_list = this.state.feeding_list
    let sw_list = this.state.switch_list
    let se_list_length= this.state.section_list.length

    for(let i=0;i<feed_list.length;i++){
      let feed_index = sw_list.indexOf(feed_list[i])
      //console.log(feed_index, feed_list[i])
      for(let j=0;j<se_list_length;j++){
        if(feedMatrix[feed_index][j]===1){
          
          feedMatrix[feed_index][j] = 11
        }
      }
    }
    this.setState({
      feedMatrix: feedMatrix
    })
    console.log("Feed matrix")
    console.log(feedMatrix)
  }

  rowOperation(row_id, matrix){
    let arr = []
    for(let i=0;i<matrix[row_id].length;i++){
      if(matrix[row_id][i]===1){
        arr.push([row_id,i])
        matrix[row_id][i] = 23
      }
    }
    console.log("->Row operation: ", row_id)
    console.log(arr)
    console.log("->End row operation")
    return arr
  }

  colOperation(col_id, matrix){
    let arr = []
    for(let i=0;i<matrix.length;i++){
      if(matrix[i][col_id]===1){
        arr.push([i,col_id])
        matrix[i][col_id]=23
      }
    }
    console.log("->Col operation: ", col_id)
    console.log(arr)
    console.log("->End col operation")
    return arr
  }

  findFeederInRow(row_id, matrix){
    console.log("->Find feeder in row")
    console.log(row_id)
    for(let i=0;i<matrix[row_id].length;i++){
      if(matrix[row_id][i]===11){
        console.log(i)
        console.log("->End Find feeder in row")
        return i
      }
    }
    console.log(-1)
    console.log("->End Find feeder in row")
    return -1
  }

  findFeederInCol(col_id, matrix){
    console.log("->Find feeder in col")
    console.log(col_id)
    for(let i=0;i<matrix.length;i++){
      if(matrix[i][col_id]===11){
        console.log(i)
        console.log("->End Find feeder in col")
        return i
      }
    }
    console.log(-1)
    console.log("->End Find feeder in col")
    return -1
  }

  findFaultyFeeder(){
    console.log("+++++++++++++++++++++++Find faulty feeder++++++++++++++++++++++++++++++")
    let faultSwitch = this.state.faultSwitch
    let faultSwitchRowId = this.getRow(faultSwitch)
    let matrix = JSON.parse(JSON.stringify(this.state.feedMatrix))
    let faultSections = this.rowOperation(faultSwitchRowId, matrix)
    let sw_queue = []
    for(let i=0;i<faultSections.length;i++){
      sw_queue.push(faultSections[i])
    }
    while(sw_queue.length>0){
      
      let item = sw_queue.pop()
      let row_1 = item[0]
      let col_1 = item[1]
      console.log(item)
      let temp_feeder_col = this.findFeederInRow(row_1, matrix)
      let temp_feeder_row = this.findFeederInCol(col_1, matrix)

      if(temp_feeder_col!==-1){
        console.log("->Faulty feeder")
        console.log("LOcation",row_1, temp_feeder_col)
        let sw_name = this.state.switch_list[row_1]
        console.log("Name",sw_name)
        console.log(matrix)
        this.setState({
          faultyFeeder: [sw_name, [row_1, temp_feeder_col]]
        })
        return [row_1, temp_feeder_col]
      }
      if(temp_feeder_row!==-1){
        console.log("->Faulty feeder")
        console.log("LOcation",temp_feeder_row, col_1)
        let sw_name = this.state.switch_list[temp_feeder_row]
        console.log("Name",sw_name)
        console.log(matrix)
        this.setState({
          faultyFeeder: [sw_name, [temp_feeder_row, col_1]]
        })
        return [temp_feeder_row, col_1]
      }
      let itemRowSections = this.rowOperation(row_1, matrix)
      let itemCOlSections = this.colOperation(col_1, matrix)

      for(let j=0;j<itemRowSections.length;j++){
        sw_queue.push(itemRowSections[j])
      }

      for(let j=0;j<itemCOlSections.length;j++){
        sw_queue.push(itemCOlSections[j])
      }
      
    }
    
  }

  findFaultyPath(){
    let faultyFeeder = this.state.faultyFeeder
    console.log("+++++++++++++++++++++++Find faulty path++++++++++++++++++++++++++++++")
    let matrix = JSON.parse(JSON.stringify(this.state.feedMatrix))
    let sw_queue = []
    let path = []
    sw_queue.push(faultyFeeder[1])
    console.log(faultyFeeder[1])
    while(sw_queue.length>0){
      console.log("--------------------------------------")
      let item = sw_queue.pop()
      if(!path.includes(item)){
        path.push(item)
      }

      let row_1 = item[0]
      let col_1 = item[1]
      console.log(item)
      let itemRowSections = this.rowOperation(row_1, matrix)
      let itemCOlSections = this.colOperation(col_1, matrix)
      console.log(itemRowSections)
      console.log(itemCOlSections)
      for(let j=0;j<itemRowSections.length;j++){
        sw_queue.push(itemRowSections[j])
        path.push(itemRowSections[j])
      }

      for(let j=0;j<itemCOlSections.length;j++){
        sw_queue.push(itemCOlSections[j])
        path.push(itemRowSections[j])
      }
      
    }
    console.log(path)
  }

  getRow(sw_id){
    return this.state.switch_list.indexOf(sw_id)
  }

  drawGraph(){
    let feed_list = this.state.feeding_list
    let noopn_list = this.state.noopensw_list
    let sw_list = this.state.switch_list
    let se_list = this.state.section_list
    let nodes_arr = []
    let link_arr = []
    
    for(let i=0;i<se_list.length;i++){
      nodes_arr.push({id: se_list[i],color: "black", size: 300, symbolType: "circle",cx:10, cy:200})
    }

    for(let i=0;i<sw_list.length;i++){
      let id = sw_list[i]
      let color = "green"
      let size = 2000
      let symbolType = "square"
      if(noopn_list.includes(sw_list[i])){
        color = "orange"
      }else if(feed_list.includes(sw_list[i])){
        color = "blue"
      }else if(this.state.faultSwitch===sw_list[i]){
        color = "red"
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
    const graph_config = {
      "automaticRearrangeAfterDropNode": true,
      "collapsible": true,
      "directed": false,
      "focusAnimationDuration": 0.75,
      "focusZoom": 5,
      "height": 700,
      "highlightDegree": 1,
      "highlightOpacity": 1,
      "linkHighlightBehavior": true,
      "maxZoom": 8,
      "minZoom": 0.8,
      "nodeHighlightBehavior": false,
      "panAndZoom": false,
      "staticGraph": false,
      "staticGraphWithDragAndDrop": false,
      "width": 1000,
      "d3": {
        "alphaTarget": 0.05,
        "gravity": -500,
        "linkLength": 90,
        "linkStrength": 2
      },
      node: {
          color: 'lightgreen',
          size: 120,
          highlightStrokeColor: 'blue',
      },
      link: {
        color: 'grey',
        highlightColor: 'lightblue'
      }
    };
    this.setState(
      {
        graph_data: graph_data,
        graph_config: graph_config
      }
    )
    console.log("Graph data")
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
        this.setState({switchtable:val.switchtable,noswitch:val.noswitch,feedpoints:val.feedpoints,faultSwitch:val.faultSwitch})

        this.getSwitches(this.state.switchtable)
        this.getSections(this.state.switchtable)
        this.getNormallyOpenSwitches(this.state.noswitch)
        this.getFeedingPoints(this.state.feedpoints)

        this.generatePhysicalConMatrix(this.state.switchtable)
        this.generateElectricConnectivityMatrix()
        this.generateFeedingMatrix()

        this.findFaultyFeeder()
        this.findFaultyPath()
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

  render() {
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
                  <h4 className={classes.cardTitleWhite}>{this.state!=null?this.state.branch:""} Electric Grid</h4>
                  <p className={classes.cardCategoryWhite}>
                    Physical connection graph will display here.
                  </p>
                </CardHeader>
                :
                <CardHeader color="danger">
                <h4 className={classes.cardTitleWhite}>{this.state!=null?this.state.branch:""} Electric Grid</h4>
                <p className={classes.cardCategoryWhite}>
                  Warning!
                </p>
                </CardHeader>
                }
                  <CardBody>
                  <div>
                    {this.state.graph_data===undefined?"Please select a branch":
                      <Graph
                      id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                      data={this.state.graph_data}
                      config={this.state.graph_config}
                      />
                    }
                    
                  </div>
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
