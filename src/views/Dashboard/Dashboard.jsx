
import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AddExelSheet from '../../components/Addexcel/addexcel.js'
import SelectBranch from '../../components/SelectBranch/selectBranch'

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import Swal from "sweetalert2";

var firebase = require("firebase");

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  /*Change map details on change of the drop down*/
  selectMapEventHandler=(event)=>{
    this.setState({
        branch: event.target.value
    })
    firebase.database().ref().child(event.target.value)
    .once('value')
    
    .then((snapshot) => {
        const val = snapshot.val();
        this.setState({electricMap:val})
        console.log(this.state)
      })
      .catch((e) => {
          console.log(e)
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
          })
      });

  }

  render() {
    const { classes } = this.props;
    return (
      <div>
       <div>
        </div>
        <div className="row">
            <div className="col-md-3">
                <AddExelSheet/>
            </div>
            <div className="col-md-3">
            </div>
            <div className="col-md-3">
                <SelectBranch changed={this.selectMapEventHandler}/>
            </div>
        </div>               
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
