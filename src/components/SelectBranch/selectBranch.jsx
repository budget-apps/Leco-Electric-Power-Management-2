import React from 'react'

class SelectBranch extends React.Component {

    render(){
        return (
            <div>
                <select className="browser-default custom-select btn-primary btn-sm" style={{marginTop: "10px",marginBottom: "5px"}} onChange={this.props.changed}>
                  <option defaultValue={"No Branch"}> Select branch</option>
                  <option value="Negambo">Negambo</option>
                </select>
            </div>
        )
    }
}

export default SelectBranch