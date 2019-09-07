import React from 'react'

class SelectBranch extends React.Component {

    render(){
        return (
            <div>
                <select color="info" onChange={this.props.changed}>
                  <option defaultValue={"No Branch"}> Select branch</option>
                  <option value="Negambo">Negambo</option>
                </select>
            </div>
        )
    }
}

export default SelectBranch