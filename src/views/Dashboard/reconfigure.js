import {getSwitchsToSwitch, getRow, rowOperation, colOperation,findFeederInCol, findFeederInRow, getSectionOfSwitch } from "./matrixOperations"
var firebase = require("firebase");

const findEndConnectedNOs = (faultLoc, noList, switch_table, switch_list) => {
    let nos = []
    for(let j=0;j<faultLoc.length;j++){
        let end = faultLoc[j][1]
        let arr = getSwitchsToSwitch(switch_list,end,switch_table)
        for(let i=0;i<arr.length;i++){
            if(!noList.includes(arr[i])){
                arr.splice(i,1)
            }
        }
        console.log(arr)
        nos.push(arr)
    }
    console.log(nos)
    return nos 
}

const NOToFeederPath = (switchID, faultSwitch, feedMatrix, switch_list, noList) => {
    console.log("+++++++++++++++++++++++Find NO to feeder++++++++++++++++++++++++++++++")
    let faultSwitchRowId = getRow(switchID, switch_list)
    let matrix = JSON.parse(JSON.stringify(feedMatrix))
    let faultSections = rowOperation(faultSwitchRowId, matrix)
    let sw_queue = []
    for(let i=0;i<faultSections.length;i++){
      sw_queue.push(faultSections[i])
    }
    let allPaths = []
    let path = []
    while(sw_queue.length>0){
      
      let item = sw_queue.pop()
      let row_1 = item[0]
      let col_1 = item[1]
      //console.log("Line 34-> Switch: "+switch_list[row_1]+"Fault Switch: "+faultSwitch+ " isEqual: "+(switch_list[row_1] !== faultSwitch))
      if(noList.includes(switch_list[row_1]) && switch_list[row_1]!==switchID && switch_list[row_1] !== faultSwitch){
          break
      }
      //console.log(item)
      path.push(item)
      let temp_feeder_col = findFeederInRow(row_1, matrix)
      let temp_feeder_row = findFeederInCol(col_1, matrix)

      if(temp_feeder_col!==-1){
        //console.log("->Faulty feeder")
        //console.log("LOcation",row_1, temp_feeder_col)
        //let sw_name = switch_list[row_1]
        //console.log("Name",sw_name)
        //console.log(matrix)
        path.push([row_1, temp_feeder_col])
        //console.log(path)
        allPaths.push(path)
        path = []
        //return [sw_name, [row_1, temp_feeder_col]]
      }
      if(temp_feeder_row!==-1){
        //console.log("->Faulty feeder")
        //console.log("LOcation",temp_feeder_row, col_1)
        //let sw_name = switch_list[temp_feeder_row]
        //console.log("Name",sw_name)
        //console.log(matrix)
        path.push([temp_feeder_row, col_1])
        //console.log(path)
        allPaths.push(path)
        path = []
        //return [sw_name, [temp_feeder_row, col_1]]
      }
      let itemRowSections = rowOperation(row_1, matrix)
      let itemCOlSections = colOperation(col_1, matrix)

      //console.log(itemCOlSections)
      //console.log(itemRowSections)
      if(itemRowSections!==undefined){
        for(let j=0;j<itemRowSections.length;j++){
            sw_queue.push(itemRowSections[j])
        }
      }
     
      if(itemCOlSections!==undefined){
        for(let j=0;j<itemCOlSections.length;j++){
            sw_queue.push(itemCOlSections[j])
        }
      }
      
    }
    console.log("-->Reconfigure path from "+switchID)
    console.log(allPaths)
    return allPaths
    
  }

const findRecofigurePaths = (faultLoc, noList, switch_table, switch_list, feedMatrix, faultSwitch, faultyPathSections,section_list) => {
    let noSet = findEndConnectedNOs(faultLoc, noList, switch_table, switch_list)
  
    let allPaths = []
    for(let i=0;i<noSet.length;i++){
        for(let j=0;j<noSet[i].length;j++){
            
            let feederPaths = NOToFeederPath(noSet[i][j],faultSwitch, feedMatrix, switch_list, noList)
            allPaths.push(feederPaths)
        }
    }
  //   for(let i=0;i<allPaths.length;i++){
  //     for(let j=0;j<allPaths[i].length;j++){
  //       let se = allPaths[i][j][0][0]
  //       console.log(switch_list[se])
  //       let seSec = getSectionOfSwitch(switch_table, switch_list[se])
  //       console.log(seSec)
  //       for(let k=0;k<faultyPathSections.length;k++){
  //         console.log(section_list[faultyPathSections[k]])
  //         if(seSec.includes(section_list[faultyPathSections[k]])){
  //           allPaths[i].splice(j,1)
  //           break
  //         }
  //       }
        
  //     }
  // }
    console.log("All reconfigure paths")
    console.log(allPaths)
    return allPaths
}

const sendReconfigurePathsToDB = (logIndex, branch, faultSwitch, faultyFeeder, faultyPath, faultySection, time, isFaultRepaired, reconfiguredPaths) => {
    console.log("Sending recnfigured paths to DB...")
    faultyFeeder = JSON.stringify(faultyFeeder)
    faultyPath = JSON.stringify(faultyPath)
    faultySection = JSON.stringify(faultySection)
    reconfiguredPaths = JSON.stringify(reconfiguredPaths)
    
    try{
        firebase.database().ref().child(branch).child('reconfigure')
        .once('value')
        
        .then((snapshot, key) => {
        const val = snapshot.val();
        
        let isRepaired = val!==null?val[logIndex]['isFaultRepaired']:null
        
        if(isRepaired || isRepaired === null){
          //console.log(val[logIndex]['isFaultRepaired'])
          logIndex = logIndex+1
          console.log("OK. Sending new reconfiguartions...")
          firebase.database().ref().child(branch).child('reconfigure').child(logIndex).set({faultSwitch: faultSwitch, faultyFeeder: faultyFeeder, faultyPath: faultyPath, faultySection: faultySection, time: time, isFaultRepaired: isFaultRepaired, reconfiguredPaths: reconfiguredPaths})
          firebase.database().ref().child(branch).child('logIndex').set(logIndex)

          }
        else{
            console.log("Reconfiguration not done.")
        }
        })
      }catch(e){
        console.log(e)
      }
}

export {findRecofigurePaths, sendReconfigurePathsToDB}