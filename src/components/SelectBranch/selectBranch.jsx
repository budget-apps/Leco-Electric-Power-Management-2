import React from 'react'

class SelectBranch extends React.Component {

    render(){
        return (
            <div>
                <select color="info" onChange={this.props.changed}>
                  <option defaultValue={"No Branch"}> Select branch</option>
                  <option value="Negambo">Negambo-1</option>
                  <option value="Negambo-2">Negambo-2</option>
                </select>
            </div>
        )
    }
}

export default SelectBranch