import { createMuiTheme } from "@material-ui/core/styles";

let theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      light: "#64b5f6",
      main: "#42a5f5",
      dark: "#006db3",
      contrastText: "#fff"
    }
  },
  shape: {
    borderRadius: 8
  }
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: "#18202c"
      }
    },
    MuiButton: {
      label: {
        textTransform: "initial"
      },
      contained: {
        boxShadow: "none",
        "&:active": {
          boxShadow: "none"
        }
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: "#404854"
      }
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 24
        }
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    mixins: {
      ...theme.mixins,
      toolbar: {
        minHeight: 48
      }
    }
  }
};

export default theme;
