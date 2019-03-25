import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useDropzone } from "react-dropzone";
import {
  addProductsStyle,
  dropzoneStyle
} from "../../assets/jss/views/addProductsStyle.js";

import AddProductsTable from "../../components/Tables/addProductsTable.js";

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
      console.log("HEEEEY");
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
    <div style={dropzoneStyle.thumb} key={file.name}>
      <div style={dropzoneStyle.thumbInner}>
        <img src={file.preview} style={dropzoneStyle.img} />
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
          className={classes.submit}
        >
          Upload
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>
      </div>
      <aside style={dropzoneStyle.thumbsContainer}>{thumbs}</aside>
      <AddProductsTable />
    </section>
  );
}

const AddProducts = props => {
  const { classes } = props;
  return <Dropzone classes={classes} />;
};

AddProducts.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(addProductsStyle)(AddProducts);
