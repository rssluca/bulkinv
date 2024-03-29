const dropzoneStyle = {
  baseStyle: {
    flex: 1,
    outline: "none"
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
    width: "100px",
    height: "100px"
  }
};

export default dropzoneStyle;
