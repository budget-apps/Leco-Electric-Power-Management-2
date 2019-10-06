import {findFeederInRow, findFeederInCol, getRow, rowOperation, colOperation} from "./matrixOperations"

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
      console.log(item)
      let temp_feeder_col = findFeederInRow(row_1, matrix)
      let temp_feeder_row = findFeederInCol(col_1, matrix)

      if(temp_feeder_col!==-1){
        console.log("->Faulty feeder")
        console.log("LOcation",row_1, temp_feeder_col)
        let sw_name = switch_list[row_1]
        console.log("Name",sw_name)
        console.log(matrix)

        return [sw_name, [row_1, temp_feeder_col]]
      }
      if(temp_feeder_row!==-1){
        console.log("->Faulty feeder")
        console.log("LOcation",temp_feeder_row, col_1)
        let sw_name = switch_list[temp_feeder_row]
        console.log("Name",sw_name)
        console.log(matrix)

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
      let itemRowSections = rowOperation(row_1, matrix)
      let itemCOlSections = colOperation(col_1, matrix)
      console.log(itemRowSections)
      console.log(itemCOlSections)
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

export {findFaultyFeeder, findFaultyPath, checkFaults}