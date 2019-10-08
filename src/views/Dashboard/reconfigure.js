import {getSwitchsToSwitch} from "./matrixOperations"
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

export {findEndConnectedNOs}