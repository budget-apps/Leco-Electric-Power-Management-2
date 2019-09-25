// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import TableChartIcon from '@material-ui/icons/TableChart';

// core components/views for Admin layout

import FaultGenerator from "views/FaultGenerater/FaultGenerator";

// core components/views for RTL layout

const dashboardRoutes = [
    {
        path: "/faultgenerator",
        name: "Fault Generator",
        rtlName: "طباعة",
        icon: TableChartIcon,
        component: FaultGenerator,
        layout: "/faultgenerater"

    }
];

export default dashboardRoutes;
