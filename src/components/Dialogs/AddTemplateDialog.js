import React, { useState } from "react";
import { useSessionValue } from "../Session";
import classNames from "classnames";
import readXlsxFile from "read-excel-file";
import FileUploader from "react-firebase-file-uploader";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import ReactAutosuggest from "../Autocomplete/ReactAutosuggest.js";

const readFields = async (store, language, templateFile) => {
  let fields = [];
  let sheetName = "Model";
  switch (language) {
    case "IT":
      sheetName = "Modello";
      break;
    case "ES":
      sheetName = "Plantilla";
      break;
    default:
      sheetName = "Model";
  }

  await readXlsxFile(templateFile, { sheet: sheetName }).then(data => {
    data[1].forEach((field, index) => {
      fields.push({
        name: data[2][index],
        loc: field,
        match_value: "",
        in_parent: false,
        cell_index: index
      });
    });
  });

  return fields;
};

const AddTemplateDialog = ({
  classes,
  open,
  setOpen,
  categories,
  setSnackbarProps
}) => {
  const [store, setStore] = useState("amazon");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("IT");
  const [templateFile, setTemplateFile] = useState(null);

  // setting fileUploader instance, used to reference the fileupload when starting upload manually
  const [fileUploader, setFileUploader] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [{ firebase }] = useSessionValue();

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadError = error => {
    setIsUploading(false);
    console.error(error);
  };
  const handleUploadSuccess = async filename => {
    setIsUploading(false);

    const fields = await readFields(store, language, templateFile);

    firebase.storage
      .ref(`/templates/${store}/`)
      .child(filename)
      .getDownloadURL()
      .then(url => {
        firebase.db
          .collection("categories")
          .doc(category)
          .set(
            {
              templates: {
                [store]: {
                  [language]: {
                    fileUrl: url,
                    fields: fields
                  }
                }
              }
            },
            { merge: true }
          )
          .then(() => {
            setSnackbarProps({
              open: true,
              variant: "success",
              message: "Template addedd successfully!"
            });
            handleClose();
          });
      });
  };

  const handleSubmit = () => {
    fileUploader.startUpload(templateFile);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const stores = [
    {
      value: "amazon",
      label: "Amazon"
    }
  ];

  const languages = [
    {
      value: "IT",
      label: "IT"
    },
    {
      value: "EN",
      label: "EN"
    }
  ];

  const isInvalid = category === "" || !templateFile;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add a new template</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the store, category name, language and add an excel
          template (.xlsx) file.
        </DialogContentText>
        <form>
          <div className={classes.marginTop}>
            <ReactAutosuggest
              name="category"
              fieldValue={category}
              setFieldValue={setCategory}
              passedSuggestions={categories}
              label="Category"
            />
            <TextField
              id="store"
              select
              label="Store"
              className={classes.textField}
              value={store}
              onChange={e => setStore(e.target.value)}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
            >
              {stores.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="language"
              select
              label="Language"
              className={classes.languageTextField}
              value={language}
              onChange={e => setLanguage(e.target.value)}
              SelectProps={{
                MenuProps: {
                  className: classes.languageMenu
                }
              }}
              margin="normal"
            >
              {languages.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={classNames(classes.marginTop3)}>
            <Button variant="contained" color="default" component="label">
              Select Template File
              <FileUploader
                hidden
                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsm"
                name="template"
                filename={`${category}_${store}_${language}.xlsx`}
                storageRef={firebase.storage.ref(`/templates/${store}/`)}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
                onUploadSuccess={handleUploadSuccess}
                onChange={e => setTemplateFile(e.target.files[0])}
                ref={instance => {
                  setFileUploader(instance);
                }}
              />
            </Button>
            {!isUploading && templateFile && (
              <Typography>Selected File: {templateFile.name}</Typography>
            )}
            {isUploading && <Typography>Please wait..</Typography>}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose("addDialog")} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          disabled={isInvalid}
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTemplateDialog;
