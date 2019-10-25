import {getSectionOfSwitch, getSwitchType, getSwitchesFromSection} from "./matrixOperations"
import Swal from "sweetalert2";

const drawGraph = (feed_list, noopn_list, sw_list, se_list, faultyPathSwithces, faultyPathSections, switchtable, faultSwitch) => {
    let nodes_arr = []
    let link_arr = []

    for(let i=0;i<se_list.length;i++){
      let color = "black"
      if(faultyPathSections.includes(i)){
        color = "red"
      }
      nodes_arr.push({id: se_list[i],color: color, size: 200, symbolType: "circle"})
    }

    for(let i=0;i<sw_list.length;i++){
      let id = sw_list[i]
      let color = "green"
      let size = 3000
      let symbolType = "square"
      if(noopn_list.includes(sw_list[i])){
        color = "orange"
      }else if(feed_list.includes(sw_list[i])){
        color = "blue"
      }else if(faultSwitch===sw_list[i]){
        color = "red"
      }else if(faultyPathSwithces.includes(i)){
        color = "red"
      }
      nodes_arr.push({id: id,color: color, size: size, symbolType: symbolType})

      let section_list = getSectionOfSwitch(switchtable, sw_list[i])
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
      "highlightDegree": 5,
      "highlightOpacity": 1,
      "linkHighlightBehavior": true,
      "maxZoom": 1,
      "minZoom": 0.8,
      "nodeHighlightBehavior": false,
      "panAndZoom": false,
      "staticGraph": false,
      "staticGraphWithDragAndDrop": false,
      "width": 1000,
      "d3": {
        "alphaTarget": 0.05,
        "gravity": -400,
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
    console.log("Graph data")
    return [graph_data, graph_config]
  }

  const drawPath = (se_list,sw_list, switchtable) => {
    let nodes_arr = []
    let link_arr = []

    for(let i=0;i<se_list.length;i++){
      let color = "black"
      nodes_arr.push({id: se_list[i],color: color, size: 100, symbolType: "circle"})
    }

    for(let i=0;i<sw_list.length;i++){
      let id = sw_list[i]
      let color = "green"
      let size = 3000
      let symbolType = "square"
      nodes_arr.push({id: id,color: color, size: size, symbolType: symbolType})

      link_arr.push({source: id, target: se_list[i]})
    }

    const graph_data = {
        nodes: nodes_arr,
        links: link_arr
    };
    const graph_config = {
      "automaticRearrangeAfterDropNode": false,
      "collapsible": false,
      "directed": false,
      "focusAnimationDuration": 0.75,
      "focusZoom": 5,
      "height": 300,
      "highlightDegree": 5,
      "highlightOpacity": 1,
      "linkHighlightBehavior": true,
      "maxZoom": 1,
      "minZoom": 0.8,
      "nodeHighlightBehavior": false,
      "panAndZoom": false,
      "staticGraph": false,
      "staticGraphWithDragAndDrop": false,
      "width": 500,
      "d3": {
        "alphaTarget": 0.05,
        "gravity": -500,
        "linkLength": 50,
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
    console.log("Graph data")
    return [graph_data, graph_config]
  }

//graph event callbacks
const onClickGraph = () =>{
    //window.alert(`Electric map`);
  };

const onClickNode = (nodeId, noopensw_list, feeding_list, crrntTable,sw_list) =>{
  
  let type = getSwitchType(nodeId, noopensw_list, feeding_list)
  let swCurrent = 0
  if(type!=='Feeder'){
    swCurrent = crrntTable[sw_list.indexOf(nodeId)]
  }else{
    swCurrent = 300
  }

  console.log(swCurrent)

  Swal.fire({
      type: 'info',
      title: nodeId,
      html:
    'Switch Status: <b>'+type+'</b>, <br>'
    +'Power Consupmtion: <b>'+swCurrent+'</b>, <br>',
  showCloseButton: true,
  focusConfirm: false,
  })
  };

const onDoubleClickNode = (nodeId) =>{
  window.alert(`Double clicked node ${nodeId}`);
};

const onRightClickNode = (event, nodeId, fw) =>{
  document.oncontextmenu = function() { return false; }
  console.log(event)
  Swal.fire({
    type: 'error',
    title: 'Delete '+nodeId,
    text: 'Do you want to remove '+nodeId+'?',
  }).then((result) => {
    if (result.value) {
      document.oncontextmenu = function() { return true; }
    }
  })
};

const onMouseOverNode = (nodeId) =>{
//window.alert(`Mouse over node ${nodeId}`);
};

const onMouseOutNode = (nodeId) =>{
//window.alert(`Mouse out node ${nodeId}`);
};

const onClickLink = (source, target) =>{
window.alert(`Clicked link between ${source} and ${target}`);
};

const onRightClickLink = (event, source, target,switch_list, switchtable) =>{

  let switchesConnectedToTargeswitchesConnectedToTargett = getSwitchesFromSection(target,switch_list, switchtable)
  // console.log(source)
  // Swal.fire({
  //   type: 'info',
  //   title: 'Add Switch',
  //   text: 'Do you want to add switch between '+source+' and'+ target+' ?',
  // })
  return switchesConnectedToTargeswitchesConnectedToTargett;
};

const onMouseOverLink = (source, target) =>{
//window.alert(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = (source, target) =>{
//window.alert(`Mouse out link between ${source} and ${target}`);
};

const onNodePositionChange = (nodeId, x, y) =>{
//window.alert(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
};

export {drawGraph, onClickGraph, onClickNode, onDoubleClickNode, onRightClickNode, onMouseOverNode, onMouseOutNode, onClickLink, onRightClickLink}
export {onMouseOverLink, onMouseOutLink, onNodePositionChange, drawPath}                                                                                                                                                                                                                                                              