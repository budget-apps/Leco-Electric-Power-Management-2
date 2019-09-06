import React from 'react'

class FilterSwithces extends React.Component {

    render(){
        return (
            <div>
                <select className="browser-default custom-select btn-primary btn-sm" style={{marginTop: "10px",marginBottom: "5px"}} onChange={this.props.changed}>
                  <option defaultValue={"AllSwithces"}>All swithces</option>
                  <option value="Feeders">Feeders</option>
                  <option value="NOOpenSwithces">Normally Open Switches</option>
                </select>
            </div>
        )
    }
}

export default FilterSwithces