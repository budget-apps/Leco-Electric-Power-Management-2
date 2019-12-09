import {getSwitchsToSwitch, getSectionOfSwitch, getRow, rowOperation, colOperation,findFeederInCol, findFeederInRow, getSwitchCurrent } from "./matrixOperations"
import {getFaultPathCurrent} from './faultFinder'

var firebase = require("firebase");

const findEndConnectedNOs = (faultLoc, noList, switch_table, switch_list) => {
    let nos = []
    for(let j=0;j<faultLoc.length;j++){
      if(faultLoc[j][1]==="-1")continue
        let end = faultLoc[j][1]
        let arr = getSwitchsToSwitch(switch_list,end,switch_table)
        let arrLen = arr.length
        let removed = []
        for(let i=0;i<arr.length;i++){
            if(!noList.includes(arr[i])){
                removed.push(arr[i])
                arr.splice(i,1)
            }
        }
        if(arrLen!==arr.length){
          for(let j=0;j<removed.length;j++){
            let temper = getSwitchsToSwitch(switch_list, removed[j], switch_table)
            for(let k=0;k<temper.length;k++){
              if(!arr.includes(temper[k])&&noList.includes(temper[k])){
                arr.push(temper[k])
              }
            }
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
      
      // console.log("-------------------------")
      // console.log(sw_queue)
      // for(let h=0;h<sw_queue.length;h++){
      //   console.log(switch_list[sw_queue[h][0]])
      // }
      // console.log("-------------------------")
      //console.log("Line 34-> Switch: "+switch_list[row_1]+"Fault Switch: "+faultSwitch+ " isEqual: "+(switch_list[row_1] !== faultSwitch))
      if(noList.includes(switch_list[row_1]) && switch_list[row_1]!==switchID && switch_list[row_1] !== faultSwitch){
        continue
      }
      
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
        //console.log(switch_list[row_1])
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
        //console.log(switch_list[temp_feeder_row])
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

const findRecofigurePaths = (faultLoc, noList, switch_table, switch_list, feedMatrix, faultSwitch, faultyPathSections,section_list, faultPathSwitches) => {
    if(faultLoc.length<1){
      return []
    }
    let noSet = findEndConnectedNOs(faultLoc, noList, switch_table, switch_list)

    let allPaths = []
    for(let i=0;i<noSet.length;i++){
        for(let j=0;j<noSet[i].length;j++){
            
            let feederPaths = NOToFeederPath(noSet[i][j],faultSwitch, feedMatrix, switch_list, noList)
            //console.log(feederPaths[0].length)
            for(let k=0;k<feederPaths.length;k++){
              allPaths.push(feederPaths[k])
            }
            
            //console.log(feederPaths)
            
        }
    }
    let new_path = []
    console.log(allPaths)
    console.log(faultLoc)
    let f1 = switch_list.indexOf(faultLoc[0][0])
    let f2 = switch_list.indexOf(faultLoc[0][1])

    let ff1 = faultPathSwitches.indexOf(f1)
    let ff2 = faultPathSwitches.indexOf(f2)
    let faultLocSec = []
    for(let x=ff1;x<ff2+1;x++){
      faultLocSec.push([faultPathSwitches[x],faultyPathSections[x]])
    }
    

    for(let i=0;i<allPaths.length;i++){
      
      let se = allPaths[i][0][0]
      //console.log( switch_list[se])
      //console.log(faultLocSec)
      let found1 = false
      let found2 = false
      
      //console.log("Cheking sw: "+switch_list[se]+"----------------")
      let seSec = getSectionOfSwitch(switch_table, switch_list[se])
      //console.log(seSec)
      for(let k=0;k<faultLocSec.length;k++){
        console.log(section_list[faultLocSec[k][1]])
        if(seSec.includes(section_list[faultLocSec[k][1]])){
          
          found1 = true
        }
      }

      for(let k=0;k<allPaths[i].length;k++){
        //console.log(switch_list[allPaths[i][k][0]]+", "+faultLoc[0][0]+","+faultLoc[0][1])
        if(switch_list[allPaths[i][k][0]]===faultLoc[0][0] || switch_list[allPaths[i][k][0]]===faultLoc[0][1]){
          found2 = true
        }
      }
      let temp = []
      temp.push(allPaths[i])
      //console.log(found1)
      //console.log(found2)
      if(!found1 && !found2){
        new_path.push(temp)
      }
      //console.log("End check")
    }

    console.log("All reconfigure paths")
    console.log(new_path)
    return new_path
}

const optimalPath = (allPaths, faultySection, faultPathSwitches, currentTable, switch_list, minOut) => {
  //console.log(faultPathSwitches)
  //console.log(faultySection)
  //console.log(minOut)
  let diff = 0
  let maxDiffPath = 0
  let uptoo = ""
  for(let i=0;i<allPaths.length;i++){
    //console.log(allPaths[i][0][allPaths[i][0].length-1][0])
    let tempNode = switch_list[allPaths[i][0][allPaths[i][0].length-1][0]]
    let tempCrnt = getSwitchCurrent(tempNode, currentTable)
    
    let minCap = -1
    let k0 = minOut[tempNode].k0

    if(k0!==0){
      minCap= minOut[tempNode].minCapacity
    }
    console.log(tempNode+" ------------------------>>> "+minCap)
    let maxOut = minCap - tempCrnt 
    //console.log(maxOut)
    faultPathSwitches = [...new Set(faultPathSwitches)]
    //console.log(faultPathSwitches)
    let faultEnd = switch_list.indexOf(faultySection[0][1])
    //console.log(faultEnd)
    let endInFp = faultPathSwitches.indexOf(faultEnd)
    let endInFpCrnt = getSwitchCurrent(switch_list[faultPathSwitches[endInFp]], currentTable)

    if(endInFpCrnt<maxOut){
      console.log("Valid path")
      if(diff<(maxOut-endInFpCrnt)){
        diff = maxOut-endInFpCrnt
        maxDiffPath = i
        uptoo = switch_list[faultPathSwitches[endInFp]]
      }
    }else{
      let fcrnt = getFaultPathCurrent(faultPathSwitches, currentTable, switch_list)
      let found = false
      for(let j=endInFp+1;j<fcrnt.length;j++){
        if(fcrnt[j]<maxOut){
          if(diff<(maxOut-fcrnt[j])){
            maxDiffPath = i
            uptoo = switch_list[faultPathSwitches[j]]
          }
          found = true
          break
        }
      }
      if(!found){
        maxDiffPath = -1
      }
    }  
  }
  // console.log(diff)
  // console.log(maxDiffPath)
  // console.log(allPaths[maxDiffPath][0])
  // console.log(uptoo)
  return [maxDiffPath, diff, uptoo]
  
}

const sendReconfigurePathsToDB = (switch_list, logIndex, branch, faultSwitch, faultyFeeder, faultyPath, faultySection, time, isFaultRepaired, reconfiguredPaths, optimalPath) => {
    console.log("Sending recnfigured paths to DB...")
    
    try{
        firebase.database().ref().child(branch).child('reconfigure')
        .once('value')
        
        .then((snapshot, key) => {
        const val = snapshot.val();
        let prevFaultPath = JSON.parse(val[logIndex]['faultyPath'])
        let isRep = val[logIndex]['isFaultRepaired']
        let faultSwitchID = switch_list.indexOf(faultSwitch)
        let sameFault = false
        for(let i=0;i<prevFaultPath.length;i++){
          console.log(prevFaultPath[i][0]+", "+faultSwitchID)
          if(prevFaultPath[i][0]===faultSwitchID && !isRep){
            sameFault = true
            break
          }
        }

        console.log(sameFault)

        //let isRepaired = val!==null?val[logIndex]['isFaultRepaired']:null
        
        faultyFeeder = JSON.stringify(faultyFeeder)
        faultyPath = JSON.stringify(faultyPath)
        faultySection = JSON.stringify(faultySection)
        reconfiguredPaths = JSON.stringify(reconfiguredPaths)
        optimalPath[0] = JSON.stringify(optimalPath[0])

        if(!sameFault){
          //console.log(val[logIndex]['isFaultRepaired'])
          logIndex = logIndex+1
          console.log("OK. Sending new reconfiguartions...")
          firebase.database().ref().child(branch).child('reconfigure').child(logIndex).set({faultSwitch: faultSwitch, faultyFeeder: faultyFeeder, faultyPath: faultyPath, faultySection: faultySection, time: time, isFaultRepaired: isFaultRepaired, reconfiguredPaths: reconfiguredPaths, optimalPath: optimalPath})
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

export {findRecofigurePaths, sendReconfigurePathsToDB, optimalPath}