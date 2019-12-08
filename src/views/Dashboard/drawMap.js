import {getSectionOfSwitch, getSwitchType, getSwitchesFromSection} from "./matrixOperations"
import Swal from "sweetalert2";

const drawGraph = (faultyFeeder, faultLoc, feed_list, noopn_list, sw_list, se_list, faultyPathSwithces, faultyPathSections, switchtable, faultSwitch, prevReconfigure, mapState, isIsolated, isReconfigured, optimalPath) => {
    let nodes_arr = []
    let link_arr = []
    //console.log(faultLoc)
    for(let i=0;i<se_list.length;i++){
      let color = "grey"
    
      nodes_arr.push({id: se_list[i],color: color, size: 200, symbolType: "circle"})
    }

    //let f1 = faultyPathSwithces.indexOf(sw_list.indexOf(faultLoc[0]))
    let f2 = faultyPathSwithces.indexOf(sw_list.indexOf(faultLoc[1]))
    let faultSec = se_list[faultyPathSections[f2]]
    // let fpath = JSON.parse(JSON.stringify(faultyPathSections))
    // let recfNode = optimalPath[0][0]
    // let recfSec = optimalPath[0][1]
    // let newFaultPath = fpath.splice(f2+1, fpath.length)
    //console.log(newFaultPath)
    
    //console.log("Fault section---------> "+faultSec)

    for(let i=0;i<sw_list.length;i++){
      let typeofnode = ""
      let id = sw_list[i]
      let color = "#6fff6f"
      let size = 3000
      let symbolType = "circle"
      
      if(noopn_list.includes(sw_list[i])){
        color = "#ff4848"
        typeofnode = "Open"
        symbolType ="triangle"
      }else if(feed_list.includes(sw_list[i])){
        color = "#6fb7ff"
        typeofnode = "Close"
        symbolType ="square"
      }else{
        color = "#6fff6f"
        typeofnode = "Close"
      }
      //console.log("Switch:->>>>>>>>>>>>>"+sw_list[i])
      //console.log(mapState[sw_list[i]]===0)
      if(faultLoc.includes(sw_list[i]) && mapState[sw_list[i]]===0){
        //console.log("faultLoc.includes(sw_list[i]) && mapState[sw_list[i]]===0")
        color = "#ffff00"
      }
      else if(faultLoc.includes(sw_list[i]) && mapState[sw_list[i]]===1){
        //console.log("faultLoc.includes(sw_list[i]) && mapState[sw_list[i]]===1")
        color = "#654321"
      }else{
        //do nothing
      }

      
      if(mapState[sw_list[i]]===1 && noopn_list.includes(sw_list[i])){
        typeofnode = "Close"
        color = "#003366"
      }
      else if(mapState[sw_list[i]]===0 && noopn_list.includes(sw_list[i])){
        typeofnode = "Open"
      }else if(mapState[sw_list[i]]===1 && !noopn_list.includes(sw_list[i])){
        typeofnode = "Close"
      }else if(mapState[sw_list[i]]===0 && !noopn_list.includes(sw_list[i])){
        typeofnode = "Open"
      }else{}

     

      if(prevReconfigure.length!==0){
        for(let j=0;j<prevReconfigure.length-1;j++){
          for(let k=0;k<prevReconfigure[j].length;k++){
            if(sw_list[prevReconfigure[j][k][0]]===sw_list[i]){
              color = "#654321"
              typeofnode = "Open"
              break
            }
          }
        }
      }

      id = id + "\n" + typeofnode
      nodes_arr.push({id: id,color: color, size: size, symbolType: symbolType})
      console.log(faultyPathSections)
      let link_color ="#6fff6f"
      let section_list = getSectionOfSwitch(switchtable, sw_list[i])
      if(!isIsolated){
        for(let j=0;j<section_list.length;j++){
          //console.log(section_list[j], se_list.indexOf(section_list[j]))
          if(faultyPathSections.includes(se_list.indexOf(section_list[j]))){
            link_color = "#654321"
          }else{
            link_color = "#6fff6f"
          }
  
          
          link_arr.push({source: id, target: section_list[j], color: link_color})
            
        }
      }else{
        for(let j=0;j<section_list.length;j++){
          if(faultSec===section_list[j]){
            link_color = "#654321"
          }else{
            // link_color = "#6fff6f"
          }
          if(faultyPathSections.includes(se_list.indexOf(section_list[j]))){
            link_color = "#654321"
          }else{
            link_color = "#6fff6f"
          }
         
  
          if(mapState[sw_list[i]]===1 && noopn_list.includes(sw_list[i])){
            let recfinNodeSec = getSectionOfSwitch(switchtable, sw_list[i])
            if(recfinNodeSec.includes(section_list[j])){
              link_color = "#6fff6f"
            }
            
          }
          link_arr.push({source: id, target: section_list[j], color: link_color})
            
        }
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
      "minZoom": 0.3,
      "nodeHighlightBehavior": false,
      "panAndZoom": false,
      "staticGraph": false,
      "staticGraphWithDragAndDrop": false,
      "width": 1000,
      "d3": {
        "alphaTarget": 0.05,
        "gravity": -1200,
        "linkLength": 200,
        "linkStrength": 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      },
      node: {
          color: 'lightgreen',  
          size: 120,
          highlightStrokeColor: 'red',
          fontSize: 20                                                                        
      },
      link: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        color: '#6fff6f',
        highlightColor: 'green'
      }
    };
    console.log("Graph data")
    return [graph_data, graph_config]
  }

  const drawGraph2 = (feed_list, noopn_list, sw_list, se_list, switchtable, prevReconfigure) => {
    let nodes_arr = []
    let link_arr = []
    //console.log(faultLoc)
    for(let i=0;i<se_list.length;i++){
      let color = "grey"
    
      nodes_arr.push({id: se_list[i],color: color, size: 200, symbolType: "circle"})
    }

    for(let i=0;i<sw_list.length;i++){
      let typeofnode = ""
      let id = sw_list[i]
      let color = "#6fff6f"
      let size = 3000
      let symbolType = "circle"
      
      if(noopn_list.includes(sw_list[i])){
        color = "#ff4848"
        typeofnode = "Open"
        symbolType ="triangle"
      }else if(feed_list.includes(sw_list[i])){
        color = "#6fb7ff"
        typeofnode = "Close"
        symbolType ="square"
      }else{
        color = "#6fff6f"
        typeofnode = "Close"
      }
     
      if(prevReconfigure.length!==0){
        for(let j=0;j<prevReconfigure.length-1;j++){
          for(let k=0;k<prevReconfigure[j].length;k++){
            if(sw_list[prevReconfigure[j][k][0]]===sw_list[i]){
              color = "#654321"
              typeofnode = "Open"
              break
            }
          }
        }
      }

      id = id + "\n" + typeofnode
      nodes_arr.push({id: id,color: color, size: size, symbolType: symbolType})
      let link_color ="#6fff6f"
      let section_list = getSectionOfSwitch(switchtable, sw_list[i])
      
      for(let j=0;j<section_list.length;j++){
    
        link_arr.push({source: id, target: section_list[j], color: link_color})
          
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
      "minZoom": 0.3,
      "nodeHighlightBehavior": false,
      "panAndZoom": false,
      "staticGraph": false,
      "staticGraphWithDragAndDrop": false,
      "width": 1000,
      "d3": {
        "alphaTarget": 0.05,
        "gravity": -1200,
        "linkLength": 200,
        "linkStrength": 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      },
      node: {
          color: 'lightgreen',  
          size: 120,
          highlightStrokeColor: 'red',
          fontSize: 20                                                                        
      },
      link: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        color: '#6fff6f',
        highlightColor: 'green'
      }
    };
    console.log("Graph data")
    return [graph_data, graph_config]
  }

  const drawPath = (se_list,sw_list,noopn_list, feed_list) => {
    let nodes_arr = []
    let link_arr = []
    
    
    for(let i=0;i<se_list.length;i++){
      let color = "grey"
     
      nodes_arr.push({id: se_list[i],color: color, size: 100, symbolType: "circle"})
    }
    console.log("++++++++++++++++++++++++")
    console.log(feed_list)
    console.log(noopn_list)
    
    for(let i=0;i<sw_list.length;i++){
      
      let id = sw_list[i]
      console.log(id)
      let color = "green"
      let size = 3000
      let symbolType = "circle"
      //let typeofnode = 'Close'
      if(noopn_list.includes(sw_list[i])){
        color = "#ff4848"
        symbolType = "triangle"
        //typeofnode = "Open"
      }else if(feed_list.includes(sw_list[i])){
        color = "#6fb7ff"
        symbolType = "square"
       // typeofnode = "Close"
      }else{
        color = "#6fff6f"
       // typeofnode = "Close"
      }
      nodes_arr.push({id: id,color: color, size: size, symbolType: symbolType})

      link_arr.push({source: id, target: se_list[i]})
    }
    console.log("++++++++++++++++++++++++")

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
        "linkLength": 90,
        "linkStrength": 2
      },
      node: {
          color: 'lightgreen',
          size: 300,
          highlightStrokeColor: 'blue',
          fontSize: 10
      },
      link: {
        color: 'grey',
        highlightColor: 'lightblue'
      }
    };
    return [graph_data, graph_config]
  }

//graph event callbacks
const onClickGraph = () =>{
    //window.alert(`Electric map`);
  };

const onClickNode = (nodeId, noopensw_list, feeding_list, crrntTable,sw_list) =>{
  
  let typef = getSwitchType(nodeId.split('\n')[0], noopensw_list, feeding_list)
  console.log(typef)
  let swCurrent = ""
  let found = false
  for(let i=0;i<crrntTable.length;i++){
    if(crrntTable[i][0]===nodeId.split('\n')[0]){
      swCurrent = crrntTable[i][1]
      found = true
      break
    }
  }

  if(!found){
    Swal.fire({
      type: 'info',
      title: nodeId,
  showCloseButton: true,
  })
  return 
  }
  
  if(swCurrent===""){
    swCurrent = "Not Available"
  }

  console.log(swCurrent)
  let typeO = typef==="Close" || typef==="Feeder"?"Sectionalizing Switch":"Tie Switch"
  console.log(typeO)
  Swal.fire({
      type: 'info',
      title: nodeId,
      html:
    'Switch Type: <b>'+typeO+'</b> <br>'
    +'Last Recorded Current (Avg.): <b>'+swCurrent+' A</b> <br>',
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
export {onMouseOverLink, onMouseOutLink, onNodePositionChange, drawPath, drawGraph2}                                                                                                                                                                                                                                                              