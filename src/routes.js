/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import LibraryBooks from "@material-ui/icons/LibraryBooks";

// core components/views for Admin layout
import ElectricalConnectivity from "views/Electrical-connectivity/econnectivity";
import PhysicalConnectivity from "views/Physical-connectivity/pconnectivity";
import FeedingPointMatrix from "views/Feeding-point-matrix/feedingpointmatrix";
import DashboardPage from 'views/Dashboard/Dashboard'
import switchtable from "views/Switch-Table/switchtable";
import feedpoints from "views/Feed-points/feedpoints";
import { Switch } from "@material-ui/core";
import noopen from "views/No-open-switches/noopen";

// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Home",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },

  {
    path: "/pconnectivity",
    name: "Physical Connectivity",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: PhysicalConnectivity,
    layout: "/admin"
  },
  {
    path: "/econnectivity",
    name: "Electrical Connectivity",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: ElectricalConnectivity,
    layout: "/admin"
  },
  {
    path: "/feedingpointmatrix",
    name: "Feeding Point Matrix",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: FeedingPointMatrix,
    layout: "/admin"
  },
  {
    path: "/switchtable",
    name: "Switches Table",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: switchtable,
    layout: "/admin"
  },
  {
    path: "/feedpointswitches",
    name: "Feeding Point Switches",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: feedpoints,
    layout: "/admin"
  },
  {
    path: "/noopenswithces",
    name: "Normally Open Switches",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: noopen,
    layout: "/admin"
  },
 

];

export default dashboardRoutes;
