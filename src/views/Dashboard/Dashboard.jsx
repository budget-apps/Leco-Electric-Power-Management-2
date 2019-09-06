
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
        console.log(feedMatrix[feed_index][j])
        if(feedMatrix[feed_index][j]===1){
          
          feedMatrix[feed_index][j] = 11
        }
      }
      console.log("--------------")
    }
    this.setState({
      feedMatrix: feedMatrix
    })
    console.log("Feed matrix")
    console.log(feedMatrix)
  }

  drawGraph(){
    let feed_list = this.state.feeding_list
    let noopn_list = this.state.noopensw_list
    let sw_list = this.state.switch_list
    let se_list = this.state.section_list
    let nodes_arr = []
    let link_arr = []

    for(let i=0;i<se_list.length;i++){
      nodes_arr.push({id: se_list[i],color: "black", size: 300, symbolType: "circle"})
    }

    for(let i=0;i<sw_list.length;i++){
      let id = sw_list[i]
      let color = "green"
      let size = 2000
      let symbolType = "square"
      if(noopn_list.includes(sw_list[i])){
        color = "orange"
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
        this.generateElectricConnectivityMatrix()
        this.generateFeedingMatrix()

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
                  <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>{this.state!=null?this.state.branch:""} Electric Grid</h4>
                    <p className={classes.cardCategoryWhite}>
                      Physical connection graph will display here.
                    </p>
                  </CardHeader>
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
