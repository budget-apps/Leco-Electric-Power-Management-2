import React, { Component } from "react";

class SingleLineMap extends Component {
    render() {
        return (
            <div>
                <img src={require("../../assets/img/single_map.png")} style={{
                    height: "100%",
                    width:"100%"
                }}/>
            </div>
        );
    }
}

export default SingleLineMap;