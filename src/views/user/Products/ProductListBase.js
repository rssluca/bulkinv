import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useDropzone } from "react-dropzone";
import combineStyles from "../../../utils/combineStyles.js";
import addProductsStyle from "../../../assets/jss/views/addProductsStyle.js";
import dropzoneStyle from "../../../assets/jss/components/dropzoneStyle.js";
import commonStyle from "../../../assets/jss/commonStyle.js";

function Dropzone(props) {
  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  // Set styles
  const { classes } = props;
  const style = useMemo(
    () => ({
      ...dropzoneStyle.baseStyle,
      ...(isDragActive ? dropzoneStyle.activeStyle : {}),
      ...(isDragAccept ? dropzoneStyle.acceptStyle : {}),
      ...(isDragReject ? dropzoneStyle.rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  // Thumbs
  const [files, setFiles] = useState([]);
  const thumbs = files.map(file => (
    <div className={classes.thumb} key={file.name}>
      <div className={classes.thumbInner}>
        <img src={file.preview} className={classes.img} alt="Preview" />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const rootProps = getRootProps({
    style: style,
    // Disable click and keydown behavior
    onClick: event => event.stopPropagation(),
    onKeyDown: event => {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
      }
    }
  });
  return (
    <section>
      <div {...rootProps}>
        <input {...getInputProps()} />
        <Typography className={classes.dropboxText}>
          Drag and drop images, or click the button to select files
        </Typography>
        <Button
          onClick={open}
          variant="contained"
          color="default"
          className={classes.rightSubmit}
        >
          Upload
          <CloudUploadIcon className={classes.marginRight} />
        </Button>
      </div>
      <aside className={classes.thumbsContainer}>{thumbs}</aside>
    </section>
  );
}

const AddProductsBase = props => {
  const { classes } = props;
  return <Dropzone classes={classes} />;
};

AddProductsBase.propTypes = {
  classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(
  addProductsStyle,
  commonStyle,
  dropzoneStyle
);

export default withStyles(combinedStyles)(AddProductsBase);
