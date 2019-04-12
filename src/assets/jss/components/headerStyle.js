import { DRAWER_WIDTH } from "../../../constants/dashboardConstants.js";

const styles = theme => ({
  appBar: {
    marginLeft: DRAWER_WIDTH,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`
    }
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  grow: {
    flexGrow: 1
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    color: "#333"
  }
});

export default styles;
