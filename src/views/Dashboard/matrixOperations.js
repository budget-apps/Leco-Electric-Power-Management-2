var firebase = require("firebase");

const getSwitches = (switchtable) => {
  let switch_list = []
  for (let i = 0; i < switchtable.length; i++) {
    switch_list.push(switchtable[i].switch)
  }
  console.log("Switches List: " + switch_list)
  return switch_list
}

const getSections = (switchtable) => {
  let section_list = []
  for (let i = 0; i < switchtable.length; i++) {
    let temp_list = switchtable[i].section.split(",")
    for (let j = 0; j < temp_list.length; j++) {
      if (section_list.indexOf(temp_list[j]) === -1) {
        section_list.push(temp_list[j])
      }
    }

  }
  console.log("Section List: " + section_list)
  return section_list
}

const getSectionOfSwitch = (switchtable, switch_no) => {
  for (let i = 0; i < switchtable.length; i++) {
    if (switchtable[i].switch === switch_no) {
      return switchtable[i].section.split(",")
    }
  }
}

const getNormallyOpenSwitches = (noopn) => {
  let noopensw_list = []
  for (let i = 0; i < noopn.length; i++) {
    noopensw_list.push(noopn[i].no_open)
  }
  console.log("Normally open switches: " + noopensw_list)
  return noopensw_list
}

const getSwitchType = (nodeiD, noList, feedlist) => {

  if (noList.includes(nodeiD)) {
    return "Open"
  }
  else if (feedlist.includes(nodeiD)) {
    return "Feeder"
  }
  return "Close"

}

const getFeedingPoints = (feedingpoints) => {
  let feeding_list = []
  for (let i = 0; i < feedingpoints.length; i++) {
    feeding_list.push(feedingpoints[i].feed_points)
  }
  console.log("Feeding points: " + feeding_list)
  return feeding_list
}

const generatePhysicalConMatrix = (switchtable, switch_list, section_list) => {
  let physicalConMatrix = []

  for (let i = 0; i < switch_list.length; i++) {
    let temp_list = []
    for (let j = 0; j < section_list.length; j++) {
      temp_list[j] = 0
    }
    physicalConMatrix.push(temp_list)
  }

  for (let i = 0; i < switch_list.length; i++) {
    //console.log(this.getSectionOfSwitch(switchtable, switch_list[i]))
    let temp_list = getSectionOfSwitch(switchtable, switch_list[i])
    for (let j = 0; j < temp_list.length; j++) {
      physicalConMatrix[i][section_list.indexOf(temp_list[j])] = 1
    }
  }
  console.log("Physical connection matrix")
  console.log(physicalConMatrix)
  return physicalConMatrix
}

const generateElectricConnectivityMatrix = (physicalConMatrix, no_open, sw_list, section_list) => {
  let electricConMatrix = JSON.parse(JSON.stringify(physicalConMatrix))
  let se_list_len = section_list.length

  for (let i = 0; i < no_open.length; i++) {
    let sw_index = sw_list.indexOf(no_open[i])
    for (let j = 0; j < se_list_len; j++) {
      electricConMatrix[sw_index][j] = 0
    }
  }
  console.log("Electric connected matrix")
  console.log(electricConMatrix)
  return electricConMatrix
}

const generateFeedingMatrix = (electricConMatrix, feed_list, sw_list, section_list) => {
  let feedMatrix = JSON.parse(JSON.stringify(electricConMatrix))
  let se_list_length = section_list.length

  for (let i = 0; i < feed_list.length; i++) {
    let feed_index = sw_list.indexOf(feed_list[i])
    //console.log(feed_index, feed_list[i])
    for (let j = 0; j < se_list_length; j++) {
      if (feedMatrix[feed_index][j] === 1) {

        feedMatrix[feed_index][j] = 11
      }
    }
  }
  console.log("Feed matrix")
  console.log(feedMatrix)
  return feedMatrix
}

const generatePhysicalConnectionFeederMatrix = (physicalConMatrix, feed_list, sw_list, section_list) => {
  let physicalConFeedMatrix = JSON.parse(JSON.stringify(physicalConMatrix))
  let se_list_length = section_list.length

  for (let i = 0; i < feed_list.length; i++) {
    let feed_index = sw_list.indexOf(feed_list[i])
    //console.log(feed_index, feed_list[i])
    for (let j = 0; j < se_list_length; j++) {
      if (physicalConFeedMatrix[feed_index][j] === 1) {

        physicalConFeedMatrix[feed_index][j] = 11
      }
    }
  }
  console.log("Physical Con Feed matrix")
  console.log(physicalConFeedMatrix)
  return physicalConFeedMatrix
}

const rowOperation = (row_id, matrix) => {
  let arr = []
  for (let i = 0; i < matrix[row_id].length; i++) {
    if (matrix[row_id][i] === 1) {
      arr.push([row_id, i])
      matrix[row_id][i] = 23
    }
  }
  //console.log("->Row operation: ", row_id)
  //console.log(arr)
  //console.log("->End row operation")
  return arr
}

const colOperation = (col_id, matrix) => {
  let arr = []
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][col_id] === 1) {
      arr.push([i, col_id])
      matrix[i][col_id] = 23
    }
  }
  // console.log("->Col operation: ", col_id)
  // console.log(arr)
  // console.log("->End col operation")
  return arr
}

const findFeederInRow = (row_id, matrix) => {
  // console.log("->Find feeder in row")
  // console.log(row_id)
  for (let i = 0; i < matrix[row_id].length; i++) {
    if (matrix[row_id][i] === 11) {
      // console.log(i)
      // console.log("->End Find feeder in row")
      return i
    }
  }
  // console.log(-1)
  // console.log("->End Find feeder in row")
  return -1
}

const findFeederInCol = (col_id, matrix) => {
  // console.log("->Find feeder in col")
  // console.log(col_id)
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][col_id] === 11) {
      // console.log(i)
      // console.log("->End Find feeder in col")
      return i
    }
  }
  // console.log(-1)
  // console.log("->End Find feeder in col")
  return -1
}

const getRow = (sw_id, switch_list) => {
  return switch_list.indexOf(sw_id)
}

const getSwitchsToSwitch = (switch_list, switchh, switch_table) => {
  let swSeList = getSectionOfSwitch(switch_table, switchh)
  let bypasssw = switch_list.indexOf(switchh)
  // console.log(switch_list)
  // console.log(swSeList)
  let arr = []
  for (let i = 0; i < swSeList.length; i++) {
    for (let j = 0; j < switch_list.length; j++) {
      if (getSectionOfSwitch(switch_table, switch_list[j]).includes(swSeList[i]) && !arr.includes(switch_list[j]) && bypasssw !== j) {
        arr.push(switch_list[j])
      }
    }

  }
  console.log(arr)
  return arr
}

const getSwitchesFromSection = (section_no, switch_list, switch_table) => {
  let sw_list = []
  for (let i = 0; i < switch_list.length; i++) {
    let arr = getSectionOfSwitch(switch_table, switch_list[i])
    if (arr.includes(section_no)) {
      sw_list.push(switch_list[i])
    }
  }
  console.log(sw_list)
  return sw_list
}

const getSwitchesCurrent = (curretTable) => {
  let d = new Date();
  let hrs = d.getHours()*60; // => 9
  let mnts = d.getMinutes(); // =>  30
  let scnds = d.getSeconds()/60; // => 51

  let timeNowMnts = hrs+mnts+scnds
  console.log(timeNowMnts)
  let index = timeNowMnts-(timeNowMnts%15)
  let arr = []
  console.log(index)
  for(let i=0;i<curretTable.length-1;i++){
    console.log(curretTable[i][index].split(','))
    let vals = curretTable[i][index].split(',')
    let avg = (parseFloat(vals[0])+parseFloat(vals[1])+parseFloat(vals[2]))/3
    arr.push([curretTable[i]['switch'] ,(Math.round(avg*100)/100)])
  }
  console.log(arr)
  return arr
}

const getSwitchCurrent = (switchid, currentTable) => {
  for(let i=0;i<currentTable.length;i++){
    if(currentTable[i][0]===switchid){
      return currentTable[i][1]
    }
  }
  return -1
}

// const generateMapState = (switchlist,nolist,branch,faultSwitch, faultyLoc, prevReconfigure) => {
//   let mapState = []
//   console.log(faultyLoc)
//   for(let i=0;i<switchlist.length;i++){
//     if(nolist.includes(switchlist[i])){
//       mapState[switchlist[i]] = 0
//     }
//     else if(faultyLoc.includes(switchlist[i])){
//       mapState[switchlist[i]] = 0
//     }else if(faultSwitch===switchlist[i]){
//       mapState[switchlist[i]] = 0
//     }else{
//       mapState[switchlist[i]] = 1
//     }

//     if(prevReconfigure.length!==0){
//       for(let j=0;j<prevReconfigure.length;j++){
//         for(let k=0;k<prevReconfigure[j].length;k++){
//           if(switchlist[prevReconfigure[j][k][0]]===switchlist[i]){
//             mapState[switchlist[i]] = 0
//             break
//           }
//         }
//       }
//     }
    
//   }
//   return mapState
// }

const generateMapState = (mapStated, switchlist, isGenerated, nolist,branch,faultSwitch, faultyLoc, prevReconfigure) => {
  let mapState = []
  if(isGenerated){
    for(let i=0;i<switchlist.length;i++){
      mapState[switchlist[i]]= mapStated[switchlist[i]]
      
    }
    console.log(mapState)
    return mapState
  }else{
    for(let i=0;i<switchlist.length;i++){
      if(nolist.includes(switchlist[i])){
        mapState[switchlist[i]] = 0
      }
      else if(faultyLoc.includes(switchlist[i])){
        mapState[switchlist[i]] = 0
      }else if(faultSwitch===switchlist[i]){
        mapState[switchlist[i]] = 0
      }else{
        mapState[switchlist[i]] = 1
      }
  
      if(prevReconfigure.length!==0){
        for(let j=0;j<prevReconfigure.length;j++){
          for(let k=0;k<prevReconfigure[j].length;k++){
            if(switchlist[prevReconfigure[j][k][0]]===switchlist[i]){
              mapState[switchlist[i]] = 0
              break
            }
          }
        }
      }
      
    }
    firebase.database().ref().child(branch).child('mapState').set(mapState)
    return mapState
  }
  
}

const resetMapState = (switchlist,nolist,branch) => {
  let mapState = []
  for(let i=0;i<switchlist.length;i++){
    if(nolist.includes(switchlist[i])){
      mapState[switchlist[i]] = 0
    }else{
      mapState[switchlist[i]] = 1
    }
    
  }
  firebase.database().ref().child(branch).child('mapState').set(mapState)
  return mapState
}

const reconfigureMapState = (affectedlist, normal, switchlist,nolist,branch, logIndex) => {
  let mapState = []
  for(let i=0;i<switchlist.length;i++){
    mapState[switchlist[i]] = 1
    if(nolist.includes(switchlist[i])){
      mapState[switchlist[i]] = 0
    }
    if(affectedlist.includes(switchlist[i])){
      mapState[switchlist[i]] = 0
    }
    if(normal.includes(switchlist[i])){
      mapState[switchlist[i]] = 1
    }
    
  }
  firebase.database().ref().child(branch).child('mapState').set(mapState)
  firebase.database().ref().child(branch).child('reconfigure').child(logIndex).child('isReconfigured').set(true)
  return mapState
}

const processPrevReconfigure = ( prevReconfigure ) => {
  let arr = []
  for(let i=1;i<prevReconfigure.length;i++){
    console.log(prevReconfigure[i]['isFaultRepaired'])
    if(!prevReconfigure[i]['isFaultRepaired']){
      arr.push(JSON.parse(prevReconfigure[i]['faultyPath']))
    }
  }
  console.log(arr)
  return arr
}


export { getSwitches, getSections, getSectionOfSwitch, getNormallyOpenSwitches, getSwitchType, getFeedingPoints, generatePhysicalConMatrix };
export { generateElectricConnectivityMatrix, generateFeedingMatrix, rowOperation, colOperation, findFeederInRow, findFeederInCol }
export { getRow, getSwitchsToSwitch, generatePhysicalConnectionFeederMatrix, getSwitchesFromSection, getSwitchesCurrent, generateMapState }
export { processPrevReconfigure, resetMapState, getSwitchCurrent, reconfigureMapState }