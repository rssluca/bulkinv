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
import ReactDataGrid from "react-data-grid";
import AlertDialog from "../../../components/Dialogs/AlertDialog.js";
import { useSessionValue } from "../../../components/Session";

const generateRow = () => {};

const checkImgName = (files, name) => {
  const regex = RegExp(
    "[A-Z]{3,4}\\d*\\S-[A-Z]{3}-[A-Z]{3}-[a-zA-Z_]*-\\d?-?\\S"
  );

  console.log("test returns", regex.test(name));

  if (!regex.test(name)) {
    console.log("regexerror");
    return false;
  }
  const nameArray = name.split("-");

  nameArray.forEach(i => {
    console.log(i);
  });

  return true;
};

const AddProductsBase = props => {
  const [files, setFiles] = useState([]);
  const [products, setProducts] = useState();
  const [rows, setRows] = useState([]);
  const { classes } = props;
  const [{ appSession }, dispatch] = useSessionValue();

  useEffect(() => {
    dispatch({
      type: "set",
      newTitle: "Products - Add new"
    });
  }, []);

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
      let addedFiles = [];
      acceptedFiles.map(file => {
        if (checkImgName(files, file.name)) {
          // Add preview blob
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          });
          setFiles([...files, file]);
          setRows([...rows, generateRow(file)]);
        } else {
          console.log("File", file.name, "name is invalid");
        }
      });
    }
  });

  // Set styles
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

  const columns = [
    { key: "SKU", name: "sku" },
    { key: "Brand", name: "brand", editable: true },
    { key: "Name", name: "name", editable: true },
    { key: "Type", name: "type", editable: true },
    { key: "Material", name: "material", editable: true },
    { key: "Color", name: "color", editable: true },
    { key: "Size", name: "size", editable: true },
    { key: "Price", name: "price", editable: true },
    { key: "Quantity", name: "quantity", editable: true },
    { key: "Images", name: "images", editable: true }
  ];

  return (
    <div>
      <div className={classes.marginBottom2}>
        <Typography className={classes.iconText}>
          Drag and drop images to the table below or click{" "}
        </Typography>
        <Button
          onClick={open}
          variant="contained"
          color="default"
          className={classes.rightSubmit}
        >
          Add images
          <CloudUploadIcon className={classes.marginLeft} />
        </Button>
      </div>
      <div {...rootProps}>
        <input {...getInputProps()} />
        <ReactDataGrid
          columns={columns}
          rowGetter={i => rows[i]}
          rowsCount={0}
          minHeight={250}
        />
      </div>
    </div>
  );
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
