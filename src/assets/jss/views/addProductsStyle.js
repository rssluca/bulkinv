const addProductsStyle = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  dropboxText: {
    display: "inline-flex"
  },
  submit: {
    marginLeft: 25
  }
});

const dropzoneStyle = {
  baseStyle: {
    flex: 1,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 5,
    padding: 20
  },
  activeStyle: {
    borderStyle: "solid",
    borderColor: "#6c6",
    backgroundColor: "#eee"
  },
  acceptStyle: {
    borderStyle: "solid",
    borderColor: "#00e676"
  },
  rejectStyle: {
    borderStyle: "solid",
    borderColor: "#ff1744"
  },
  thumbsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 25
  },
  thumb: {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box"
  },
  thumbInner: {
    display: "flex",
    minWidth: 0,
    overflow: "hidden"
  },
  img: {
    display: "block",
    width: "auto",
    height: "100%"
  }
};

export { addProductsStyle, dropzoneStyle };
