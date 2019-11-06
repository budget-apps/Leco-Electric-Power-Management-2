import React from 'react'

class FilterSwithces extends React.Component {

    render(){
        return (
            <div>
                <select onChange={this.props.changed}>
                <option defaultValue={"default"}>Select</option>
                  <option value="AllSwithces">All swithces</option>
                  <option value="Feeders">Feeding Switches</option>
                  <option value="NOOpenSwithces">Normally Open Switches</option>
                </select>
            </div>
        )
    }
}

export default FilterSwithces