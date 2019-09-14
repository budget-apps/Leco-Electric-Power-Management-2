import React from 'react'

class FilterSwithces extends React.Component {

    render(){
        return (
            <div>
                <select onChange={this.props.changed}>
                <option defaultValue={"default"}>Filter switches</option>
                  <option value="AllSwithces">All swithces</option>
                  <option value="Feeders">Feeders</option>
                  <option value="NOOpenSwithces">Normally Open Switches</option>
                </select>
            </div>
        )
    }
}

export default FilterSwithces