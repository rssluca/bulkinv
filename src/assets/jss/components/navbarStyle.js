import { DRAWER_WIDTH } from "../../../constants/dashboardConstants.js";

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: DRAWER_WIDTH
  },
  toolbar: theme.mixins.toolbar,
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white
  },
  item: {
    paddingTop: 8,
    paddingBottom: 8,
    color: "rgba(255, 255, 255, 0.7)"
  },
  logo: {
    // backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingLeft: 8
  },
  itemActionable: {
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)"
    }
  },
  itemActiveItem: {
    color: "#4fc3f7"
  },
  itemPrimary: {
    color: "inherit",
    fontSize: 15,
    "&$textDense": {
      fontSize: 15
    }
  },
  textDense: {}
});

export default styles;
