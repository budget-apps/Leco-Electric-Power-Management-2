import React from 'react'
import * as excel from 'xlsx';
import swal from 'sweetalert';
var firebase = require("firebase");


class  AddExelSheet extends React.Component{
    constructor(){
        super()
    this.state={
        arr:{}
    }
    this.uploadfile = this.uploadfile.bind(this)
}

    uploadfile(event){
        let file =event.target.files[0]
        var reader = new FileReader();
        
        reader.readAsArrayBuffer(file)
        reader.onload=(e)=>{
          var data = new Uint8Array(reader.result);
          var wb = excel.read(data,{type:'array'});
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data1 = excel.utils.sheet_to_json(ws);      
        
          this.setState({arr : data1, branch: this.state.branch})
          
        }
    }

    changeInputHandler=(event)=>{
        this.setState(
            {
                branch: event.target.value
            }
        )
        console.log(this.state.branch)
    }

    submitFile=()=>{
        firebase.database().ref().child(this.state.branch).set({switchtable:this.state.arr},(err,doc)=>{
            if(!err){
                swal("File added to database!!!")
            }
            else{
                console.log(err)
            }
        })
    }
    render(){
    return (
        <div>
            <input className="btn-primary btn-sm" type="file" onChange={this.uploadfile} style={{width: "20%"}} />
            <input placeholder="branch" type='text' onChange={this.changeInputHandler}/>
            <button className="btn-primary btn-sm" type="submit" size="sm" onClick={this.submitFile} style={{width: "18%"}}><i className="fa fa-upload"></i> Upload</button>
        </div>
    )
}
}

export default AddExelSheet