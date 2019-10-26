import {findFeederInRow, findFeederInCol, getRow, rowOperation, colOperation, getSwitchsToSwitch} from "./matrixOperations"
var firebase = require("firebase");

const findFaultyFeeder = (faultSwitch, feedMatrix, switch_list) => {
    console.log("+++++++++++++++++++++++Find faulty feeder++++++++++++++++++++++++++++++")
    let faultSwitchRowId = getRow(faultSwitch, switch_list)
    let matrix = JSON.parse(JSON.stringify(feedMatrix))
    let faultSections = rowOperation(faultSwitchRowId, matrix)
    let sw_queue = []
    for(let i=0;i<faultSections.length;i++){
      sw_queue.push(faultSections[i])
    }
    while(sw_queue.length>0){
      
      let item = sw_queue.pop()
      let row_1 = item[0]
      let col_1 = item[1]
      //console.log(item)
      let temp_feeder_col = findFeederInRow(row_1, matrix)
      let temp_feeder_row = findFeederInCol(col_1, matrix)

      if(temp_feeder_col!==-1){
        console.log("->Faulty feeder")
        console.log("LOcation",row_1, temp_feeder_col)
        let sw_name = switch_list[row_1]
        console.log("Name",sw_name)
        //console.log(matrix)

        return [sw_name, [row_1, temp_feeder_col]]
      }
      if(temp_feeder_row!==-1){
        console.log("->Faulty feeder")
        console.log("LOcation",temp_feeder_row, col_1)
        let sw_name = switch_list[temp_feeder_row]
        console.log("Name",sw_name)
        //console.log(matrix)

        return [sw_name, [temp_feeder_row, col_1]]
      }
      let itemRowSections = rowOperation(row_1, matrix)
      let itemCOlSections = colOperation(col_1, matrix)

      for(let j=0;j<itemRowSections.length;j++){
        sw_queue.push(itemRowSections[j])
      }

      for(let j=0;j<itemCOlSections.length;j++){
        sw_queue.push(itemCOlSections[j])
      }
      
    }
    
  }

  const findFaultyPath = (faultyFeeder, feedMatrix) => {
    console.log("+++++++++++++++++++++++Find faulty path++++++++++++++++++++++++++++++")
    let matrix = JSON.parse(JSON.stringify(feedMatrix))
    let sw_queue = []
    let path = []
    sw_queue.push(faultyFeeder[1])
    //console.log(faultyFeeder[1])
    while(sw_queue.length>0){
      //console.log("--------------------------------------")
      let item = sw_queue.pop()
      if(!path.includes(item)){
        path.push(item)
      }

      let row_1 = item[0]
      let col_1 = item[1]
      //console.log(item)
      let itemRowSections = rowOperation(row_1, matrix)
      let itemCOlSections = colOperation(col_1, matrix)
      //console.log(itemRowSections)
      //console.log(itemCOlSections)
      for(let j=0;j<itemRowSections.length;j++){
        sw_queue.push(itemRowSections[j])
      }

      for(let j=0;j<itemCOlSections.length;j++){
        sw_queue.push(itemCOlSections[j])
      }
      
    }

    let faultyPathSwithces = []
    let faultyPathSections = []
    for(let i=0;i<path.length;i++){
      faultyPathSwithces.push(path[i][0])
      faultyPathSections.push(path[i][1])
    }
    console.log(path)
    console.log(faultyPathSwithces)
    console.log(faultyPathSections)
    return [path, faultyPathSwithces, faultyPathSections]
  }
  const checkFaults = (faultSwitch) => {
    if(faultSwitch===""){
      return false
    }
    
    return true
  }

  const sendFaultCurrentRequest = (faultyPath, branch, faultSwitch, switch_list) => {
    faultyPath = [...new Set(faultyPath)]
    let faultSwitchID = switch_list.indexOf(faultSwitch)
    console.log(faultSwitchID)
    let faultSWIDInFP = 0
    for(let i=0;i<faultyPath.length;i++){
      if(faultyPath[i]===faultSwitchID){
        faultSWIDInFP = i
        break
      }
    }

    console.log(faultSWIDInFP)
    
    let FPLength = faultyPath.length
    console.log(faultSWIDInFP+1<FPLength)
    if(faultSWIDInFP+1<FPLength){
      faultyPath = faultyPath.slice(faultSWIDInFP+1, FPLength)
      console.log(faultyPath)
      let faultPathSW = []
      for(let i=0;i<faultyPath.length;i++){
        faultPathSW.push(switch_list[faultyPath[i]])
      }

      let fautPathStr = faultPathSW.toString()
      console.log(fautPathStr)
      try{
        firebase.database().ref().child(branch).child('faultCurrentRequest').child('switchID').set(fautPathStr)
      }catch(e){
        console.log(e)
      }
    }else{
      firebase.database().ref().child(branch).child('faultCurrentRequest').child('switchID').set("")
    }
    
    
  }
  
  const getFaultLoc = (faultyPath, validset, switch_list, switch_table) => {
    console.log(validset)
    faultyPath = [...new Set(faultyPath)]
    let FPLength = faultyPath.length

    let loc = []
    for(let i=0;i<validset.length;i++){
      let tempLoc = []
      tempLoc.push(validset[i])
      let tempID = switch_list.indexOf(validset[i])
      if(FPLength>faultyPath.indexOf(tempID)+1){
        let endLoc = switch_list[faultyPath[faultyPath.indexOf(tempID)+1]]
        tempLoc.push(endLoc)
        loc.push(tempLoc)
      }else{
        tempLoc.push(validset[i])
        loc.push(tempLoc)
        let arr = getSwitchsToSwitch(switch_list,validset[i],switch_table)
        for(let j=0;j<faultyPath.length;j++){
          if(arr.includes(switch_list[faultyPath[j]])){
            console.log(switch_list[faultyPath[j]])
            console.log(j)
            arr.splice(arr.indexOf(switch_list[faultyPath[j]]), 1)
          }
        }
        console.log(arr)
      }
      
      
    }
    console.log(loc)
    return loc
  }

export {findFaultyFeeder, findFaultyPath, checkFaults, sendFaultCurrentRequest, getFaultLoc}