import React from 'react'
import * as excel from 'xlsx';
import swal from 'sweetalert';
import Button from "components/CustomButtons/Button.jsx";
import Input from '@material-ui/core/Input';
var firebase = require("firebase");


class  AddExelCurrentData extends React.Component{
    constructor(){
        super()
    this.state={
        arr:{}
    }
    this.uploadfile_1 = this.uploadfile_1.bind(this)
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

    submitFile=()=>{
        console.log(this.props.branch)
        firebase.database().ref().child(this.props.branch).child('currentTable').set(this.state.arr_1,(err,doc)=>{
            if(!err){
                console.log("File added")
                swal("File added to database!!!")
            }
            else{
                console.log(err)
                swal(err.message)
            }
        })
        
    }
    render(){
    return (
        <div className="container-fluid">
            <Input fullWidth="true" type="file" onChange={this.uploadfile_1} />
            
            <Button fullWidth="true" color="success" type="submit" onClick={this.submitFile} style={{width: "100%"}}><i className="fa fa-upload"></i> Upload</Button>
        </div>
    )
}
}

export default AddExelCurrentData