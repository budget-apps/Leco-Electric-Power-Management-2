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
    this.uploadfile_1 = this.uploadfile_1.bind(this)
    this.uploadfile_2 = this.uploadfile_2.bind(this)
    this.uploadfile_3 = this.uploadfile_3.bind(this)
}

    uploadfile_1(event){
        let file =event.target.files[0]
        var reader = new FileReader();
        
        reader.readAsArrayBuffer(file)
        reader.onload=(e)=>{
          var data = new Uint8Array(reader.result);
          var wb = excel.read(data,{type:'array'});
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data1 = excel.utils.sheet_to_json(ws);      
        
          this.setState({arr_1 : data1, branch: this.state.branch})
          
        }
    }

    uploadfile_2(event){
        let file =event.target.files[0]
        var reader = new FileReader();
        
        reader.readAsArrayBuffer(file)
        reader.onload=(e)=>{
          var data = new Uint8Array(reader.result);
          var wb = excel.read(data,{type:'array'});
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data1 = excel.utils.sheet_to_json(ws);      
        
          this.setState({arr_2 : data1, branch: this.state.branch})
          
        }
    }

    uploadfile_3(event){
        let file =event.target.files[0]
        var reader = new FileReader();
        
        reader.readAsArrayBuffer(file)
        reader.onload=(e)=>{
          var data = new Uint8Array(reader.result);
          var wb = excel.read(data,{type:'array'});
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data1 = excel.utils.sheet_to_json(ws);      
        
          this.setState({arr_3 : data1, branch: this.state.branch})
          
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
        firebase.database().ref().child(this.state.branch).child('switchtable').set(this.state.arr_1,(err,doc)=>{
            if(!err){
                console.log("File added")
                //swal("File added to database!!!")
            }
            else{
                console.log(err)
            }
        })
        firebase.database().ref().child(this.state.branch).child('feedpoints').set(this.state.arr_2,(err,doc)=>{
            if(!err){
                console.log("File added")
                //swal("File added to database!!!")
            }
            else{
                console.log(err)
            }
        })
        firebase.database().ref().child(this.state.branch).child('noswitch').set(this.state.arr_3,(err,doc)=>{
            if(!err){
                swal("Files added to database!!!")
            }
            else{
                console.log(err)
            }
        })
    }
    render(){
    return (
        <div className="container-fluid">
            <label>Switches table</label>
            <input className="btn-primary btn-sm" type="file" onChange={this.uploadfile_1} style={{width: "100%"}} />
            <label>Feed points</label>
            <input className="btn-primary btn-sm" type="file" onChange={this.uploadfile_2} style={{width: "100%"}} />
            <label>Normally open swithches</label>
            <input className="btn-primary btn-sm" type="file" onChange={this.uploadfile_3} style={{width: "100%"}} />
            <input placeholder="branch" type='text' onChange={this.changeInputHandler} style={{width: "100%"}}/>
            <button className="btn-primary btn-sm" type="submit" size="sm" onClick={this.submitFile} style={{width: "100%"}}><i className="fa fa-upload"></i> Upload</button>
        </div>
    )
}
}

export default AddExelSheet