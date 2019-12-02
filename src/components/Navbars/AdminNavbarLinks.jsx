import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import { Link } from "react-router-dom";
import AddExelSheet from "../../components/Addexcel/addexcel.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SelectBranch from "../SelectBranch/selectBranch";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
// eslint-disable-next-line no-unused-vars
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";

import Button from "components/CustomButtons/Button.jsx";
import { auth } from "../../firebase";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import Swal from "sweetalert2";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import * as excel from "xlsx";
var firebase = require("firebase");
class AdminNavbarLinks extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-this-before-super
    this.uploadfile = this.uploadfile.bind(this);
this.updateWeightFactors =this.updateWeightFactors.bind(this)
    this.state = {
      openNotifcation: false,
      openProfile: false,
      switchCapacity: 0,
      switchID: "",
      feederCapacity: 0,
      feederFactor: 0,
      feederlineCapacity: 0,
      feederlineFactor: 0,
      notofication: false,
      weightFactor: 0,
      K0: 0
    };
  }

  selectMapEventHandler = event => {
    this.setState({
      branch: event.target.value
    });
  };

  uploadfile(event) {
    let file = event.target.files[0];
    var reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = e => {
      var data = new Uint8Array(reader.result);
      var wb = excel.read(data, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data1 = excel.utils.sheet_to_json(ws);

      this.setState({ arr: data1, branch: this.state.branch });
      // eslint-disable-next-line no-console
      console.log(this.state.arr);
      console.log(this.state.branch);
    };
  }
  handleToggleNotification = () => {
    this.setState(state => ({ openNotifcation: !state.openNotifcation }));
  };
  handleCloseNotification = event => {
    if (this.anchorNotification.contains(event.target)) {
      return;
    }
    this.setState({ openNotifcation: false });
  };
  handleToggleProfile = () => {
    this.setState(state => ({ openProfile: !state.openProfile }));
  };
  handleCloseProfile = event => {
    if (this.anchorProfile.contains(event.target)) {
      return;
    }
    this.setState({ openProfile: false });
  };

  handleToggleSettings = () => {
    this.setState(state => ({ openSettings: !state.openSettings }));
  };
  handleCloseSettings = event => {
    if (this.anchorProfile.contains(event.target)) {
      return;
    }
    this.setState({ openSettings: false });
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  signOut = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    return auth
      .doSignOut()
      .then(response => {
        console.log("successfully signed out", response);
      })
      .catch(err => {
        console.log("failed to sign out", err);
      });
  };

  handleClose = () => {
    this.setState({
      show: false
    });
  };

  handleShow = () => {
    this.setState({
      show: true
    });
  };

  handleCloseWeight = () => {
    this.setState({
      showWeight: false
    });
  };

  handleShowWeight = () => {
    this.setState({
      showWeight: true
    });
  };

  weightInputHandler = event => {
    this.setState({
      weightText: event.target.value
    });
  };

  sendWeightBtnHandler = () => {
    firebase
      .database()
      .ref()
      .child("Negambo")
      .child("minOut")
      .set(this.state.weightText);
  };
  calculateMinimum = () => {
    var switchCurrent = this.state.switchFactor * this.state.switchCapacity;
    var feederCurrent = this.state.feederCapacity * this.state.feederFactor;
    var feederlineCurrent =
      this.state.feederlineCapacity * this.state.feederlineFactor;
    //alert(Math.min(switchCurrent,feederCurrent,feederlineCurrent))
    var min = Math.min(switchCurrent, feederCurrent, feederlineCurrent);
    try {
      firebase
        .database()
        .ref()
        .child("Negambo")
        .child("minOut")
        .set(min);

      this.setState({
        showWeight: false
      });
      Swal.fire({
        type: "success"
      });
    } catch (e) {
      Swal.fire({
        type: "error"
      });
    }
  };
  addWeightFacters = () => {
    firebase
      .database()
      .ref()
      .child(this.state.branch)
      .child("WeightFactor")
      .set(this.state.arr, (err, doc) => {
        if (!err) {
          console.log("2File added");
          //swal("File added to database!!!")
        } else {
          console.log(err);
        }
      });
  };
  updateWeightFactors = () => {
 var switchid=(this.state.switchID);
    var newarr = [];
    firebase
      .database()
      .ref()
      .child(this.state.branch)
      .child("WeightFactor")
      .on("value", function(snapshot) {
        snapshot.forEach(function(val) {
          console.log(val.val());
          if (switchid === val.val().switchID) {
            const obj = {
              switchID: this.state.switchID,
              K0: this.state.K0,
              weightFactor: this.state.weightFactor
            };
            newarr.push(obj);
          } else {
            newarr.push(val.val());
          }
        });
      });
    console.log(newarr);
  };

  componentDidMount() {
    this.onChangeDB();
  }

  onChangeDB = () => {
    firebase
      .database()
      .ref()
      .child(this.state.branch + "/faultSwitch")
      .on("value", snapshot => {
        //Do whatever
        console.log(snapshot.val());
        this.setState({ notification: true });
      });
  };

  render() {
    const { classes } = this.props;
    const { openNotifcation, openProfile, openSettings } = this.state;
    return (
      <div style={{ backgroundColor: "white" }}>
        {/* <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button> */}
        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorNotification = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={openNotifcation ? "notification-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggleNotification}
            className={classes.buttonLink}
          >
            <Notifications className={classes.icons} />
            <span className={classes.notifications}>
              {this.state.notofication ? 1 : null}
            </span>
            <Hidden mdUp implementation="css">
              <p onClick={this.handleClick} className={classes.linkText}>
                Notification
              </p>
            </Hidden>
          </Button>
          {/*<Poppers*/}
          {/*  open={openNotifcation}*/}
          {/*  anchorEl={this.anchorNotification}*/}
          {/*  transition*/}
          {/*  disablePortal*/}
          {/*  className={*/}
          {/*    classNames({ [classes.popperClose]: !openNotifcation }) +*/}
          {/*    " " +*/}
          {/*    classes.popperNav*/}
          {/*  }*/}
          {/*>*/}
          {/*  {({ TransitionProps, placement }) => (*/}
          {/*    <Grow*/}
          {/*      {...TransitionProps}*/}
          {/*      id="notification-menu-list-grow"*/}
          {/*      style={{*/}
          {/*        transformOrigin:*/}
          {/*          placement === "bottom" ? "center top" : "center bottom"*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <Paper>*/}
          {/*        <ClickAwayListener onClickAway={this.handleCloseNotification}>*/}
          {/*          /!*<MenuList role="menu">*!/*/}
          {/*          /!*  <MenuItem*!/*/}
          {/*          /!*    onClick={this.handleCloseNotification}*!/*/}
          {/*          /!*    className={classes.dropdownItem}*!/*/}
          {/*          /!*  >*!/*/}
          {/*          /!*    Mike John responded to your email*!/*/}
          {/*          /!*  </MenuItem>*!/*/}
          {/*          /!*  <MenuItem*!/*/}
          {/*          /!*    onClick={this.handleCloseNotification}*!/*/}
          {/*          /!*    className={classes.dropdownItem}*!/*/}
          {/*          /!*  >*!/*/}
          {/*          /!*    You have 5 new tasks*!/*/}
          {/*          /!*  </MenuItem>*!/*/}
          {/*          /!*</MenuList>*!/*/}
          {/*        </ClickAwayListener>*/}
          {/*      </Paper>*/}
          {/*    </Grow>*/}
          {/*  )}*/}
          {/*</Poppers>*/}
        </div>
        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorProfile = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={openNotifcation ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggleProfile}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
            </Hidden>
          </Button>
          <Poppers
            open={openProfile}
            anchorEl={this.anchorProfile}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !openProfile }) +
              " " +
              classes.popperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseNotification}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.signOut}
                        className={classes.dropdownItem}
                      >
                        <Link to="/" style={{ color: "black" }}>
                          logout
                        </Link>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorProfile = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={openNotifcation ? "notification-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggleSettings}
            className={classes.buttonLink}
          >
            <SettingsApplicationsIcon className={classes.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile2</p>
            </Hidden>
          </Button>
          <Poppers
            open={openSettings}
            anchorEl={this.anchorProfile}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !openSettings }) +
              " " +
              classes.popperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseNotification}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.handleShow}
                        className={classes.dropdownItem}
                      >
                        upload files
                      </MenuItem>

                      <MenuItem className={classes.dropdownItem}>
                        <Link to="/faultgenerater" style={{ color: "black" }}>
                          Fault Generator
                        </Link>
                      </MenuItem>
                      <MenuItem className={classes.dropdownItem}>
                        <Link to="/admin" style={{ color: "black" }}>
                          Admin Panel
                        </Link>
                      </MenuItem>

                      <MenuItem
                        onClick={this.handleShowWeight}
                        className={classes.dropdownItem}
                      >
                        Manage Weight Factors
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        <div>
          <Dialog
            fullScreen={true}
            fullWidth={true}
            maxWidth="xl"
            open={this.state.show}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Upload excel files here"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <AddExelSheet />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="danger">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <Dialog
            fullWidth={true}
            maxWidth="xl"
            open={this.state.showWeight}
            onClose={this.handleCloseWeight}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Add Weight Facter"}
            </DialogTitle>
            <div className="col-md-3" style={{ marginTop: "50px" }}>
              <SelectBranch changed={this.selectMapEventHandler} />
            </div>
            <FormLabel>Add Weight Factors</FormLabel>
            <Input fullWidth="true" type="file" onChange={this.uploadfile} />
            <Button onClick={this.addWeightFacters} color="primary">
              Add Weight Factors
            </Button>
            <DialogTitle id="alert-dialog-title">
              {"Update Weight Facter"}
            </DialogTitle>
            {/*<DialogContent>*/}
            {/*  <DialogContentText id="alert-dialog-description">*/}
            {/*    <div>*/}
            {/*      <label*/}
            {/*        htmlFor="switchCapacity"*/}
            {/*        style={{*/}
            {/*          display: "inline-block",*/}
            {/*          width: "140px",*/}
            {/*          textAlign: "right"*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        Switch Capacity*/}
            {/*      </label>*/}
            {/*      <input*/}
            {/*        onChange={this.onChange}*/}
            {/*        aria-label={"Switch Capacity"}*/}
            {/*        placeholder="Switch Capacity"*/}
            {/*        type="number"*/}
            {/*        id="switchCapacity"*/}
            {/*        name="switchCapacity"*/}
            {/*        value={this.state.switchCapacity}*/}
            {/*      ></input>*/}
            {/*      <input*/}
            {/*        onChange={this.onChange}*/}
            {/*        placeholder="Multiply Factor"*/}
            {/*        type="number"*/}
            {/*        id="switchFactor"*/}
            {/*        name="switchFactor"*/}
            {/*        value={this.state.switchFactor}*/}
            {/*      ></input>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*      <label*/}
            {/*        htmlFor="feederCapacity"*/}
            {/*        style={{*/}
            {/*          display: "inline-block",*/}
            {/*          width: "140px",*/}
            {/*          textAlign: "right"*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        Feeder Capacity*/}
            {/*      </label>*/}
            {/*      <input*/}
            {/*        onChange={this.onChange}*/}
            {/*        placeholder="feeder Capacity"*/}
            {/*        type="number"*/}
            {/*        id="feederCapacity"*/}
            {/*        name="feederCapacity"*/}
            {/*        value={this.state.feederCapacity}*/}
            {/*      ></input>*/}
            {/*      <input*/}
            {/*        onChange={this.onChange}*/}
            {/*        placeholder="Multiply Factor"*/}
            {/*        type="number"*/}
            {/*        id="feederFactor"*/}
            {/*        name="feederFactor"*/}
            {/*        value={this.state.feederFactor}*/}
            {/*      ></input>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*      <label*/}
            {/*        htmlFor="feederlineCapacity"*/}
            {/*        style={{*/}
            {/*          display: "inline-block",*/}
            {/*          width: "140px",*/}
            {/*          textAlign: "right"*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        feeder line Capacity*/}
            {/*      </label>*/}
            {/*      <input*/}
            {/*        onChange={this.onChange}*/}
            {/*        placeholder="feeder line Capacity "*/}
            {/*        type="number"*/}
            {/*        id="feederlineCapacity"*/}
            {/*        name="feederlineCapacity"*/}
            {/*        value={this.state.feederlineCapacity}*/}
            {/*      ></input>*/}
            {/*      <input*/}
            {/*        onChange={this.onChange}*/}
            {/*        placeholder="Multiply Factor"*/}
            {/*        type="number"*/}
            {/*        id="feederlineFactor"*/}
            {/*        name="feederlineFactor"*/}
            {/*        value={this.state.feederlineFactor}*/}
            {/*      ></input>*/}
            {/*    </div>*/}
            {/*    <div style={{ width: "30px" }}>*/}
            {/*      <Button onClick={this.calculateMinimum} color="primary">*/}
            {/*        Get Minimum Output Current*/}
            {/*      </Button>*/}
            {/*    </div>*/}
            {/*    /!*<button onClick={this.sendWeightBtnHandler}>Send</button>*!/*/}
            {/*  </DialogContentText>*/}
            {/*</DialogContent>*/}
            <label>Switch ID</label>

            <input
              onChange={this.onChange}
              placeholder="Switch ID"
              id="switchID"
              name="switchID"
              value={this.state.switchID}
            ></input>
            <label>Weight Factor</label>
            <input
              onChange={this.onChange}
              placeholder="Weight Factor"
              type="number"
              id="weightFactor"
              name="weightFactor"
              value={this.state.weightFactor}
            ></input>
            <label>K0</label>
            <input
              onChange={this.onChange}
              placeholder="K0"
              type="number"
              id="K0"
              name="K0"
              value={this.state.K0}
            ></input>

            <Button onClick={this.updateWeightFactors} color="primary">
              Update
            </Button>
            <DialogActions>
              <Button onClick={this.handleCloseWeight} color="danger">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

AdminNavbarLinks.propTypes = {
  classes: PropTypes.object
};

export default withStyles(headerLinksStyle)(AdminNavbarLinks);
