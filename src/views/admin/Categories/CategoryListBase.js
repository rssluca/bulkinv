import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import combineStyles from "../../../utils/combineStyles.js";
import commonStyle from "../../../assets/jss/commonStyle.js";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddTemplateDialog from "../../../components/Dialogs/AddTemplateDialog.js";
import AlertDialog from "../../../components/Dialogs/AlertDialog.js";
import Snackbar from "../../../components/Snackbar";

import { useSessionValue } from "../../../components/Session";

// Create table header details
const columns = [
  {
    field: "uid",
    title: "Name",
    options: {
      filter: false,
      sort: false
    }
  },
  {
    field: "amazon_links",
    title: "Amazon Templates",
    options: {
      filter: false,
      sort: false
    }
  }
];

const options = {
  actionsColumnIndex: -1,
  showTitle: false,
  // toolbarButtonAlignment: "left",
  // searchFieldAlignment: "left"
  search: false,
  paging: false
};

const getTemplateLinks = (btnClass, templates) => {
  let links = [];
  let fileUrls = [];
  Object.keys(templates).map(template => {
    return (
      links.push(
        <Button
          color="primary"
          size="small"
          key={template}
          onClick={() => {
            alert("I'm a button.");
          }}
          className={btnClass}
        >
          {template}
        </Button>
      ),
      fileUrls.push(templates[template].fileUrl)
    );
  });
  return [links, fileUrls];
};

const CategoryListBase = props => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState();
  const [snackbarProps, setSnackbarProps] = useState();
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [{ firebase }] = useSessionValue();
  const { classes } = props;

  useEffect(() => {
    setLoading(true);

    const unsubscribe = firebase.db
      .collection("categories")
      .onSnapshot(snapshot => {
        let categories = [];
        let suggestions = []; // Pass to autocomplete
        console.log(snapshot);
        snapshot.forEach(doc => {
          // This will return a list of templates and images.
          const amazon_templates = getTemplateLinks(
            classes.smallButton,
            doc.data().templates.amazon
          );

          categories.push({
            uid: doc.id,
            amazon_links: amazon_templates[0],
            amazon_file_urls: amazon_templates[1]
          });

          suggestions.push({ label: doc.id });
        });

        setCategories(categories);
        setSuggestions(suggestions);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const handleCategoryDelete = rowData => {
    firebase.db
      .collection("categories")
      .doc(rowData.uid)
      .delete()
      .then(function() {
        let error = 0;
        // Delete files
        rowData.amazon_file_urls.forEach(file => {
          firebase.storage
            .refFromURL(file)
            .delete()
            .then(() => {
              console.log("Deleted file ", file);
            })
            .catch(error => {
              console.log("Could not delete file ", file);
            });
        });

        if (error === 0) {
          setSnackbarProps({
            open: true,
            variant: "success",
            message: "Category and all templates deleted!"
          });
        } else {
          setSnackbarProps({
            open: true,
            variant: "warning",
            message: "Some templates could not be deleted!"
          });
        }
        setAlertDialogOpen(false);
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
        alert("Error removing document: ", error);
      });
  };

  const actions = [
    {
      icon: "delete",
      tooltip: "Delete Category",
      onClick: (event, rowData) => {
        setAlertDialogProps({
          showLoading: true,
          action: () => handleCategoryDelete(rowData),
          icon: "warning",
          type: "continue",
          title: `Delete category "${rowData.uid}"?`,
          message:
            "Are you sure you want to delete this category? This will also remove all related templates!"
        });
        setAlertDialogOpen(true);
      },
      iconProps: {
        color: "secondary",
        size: "small"
      }
    },
    {
      icon: "add",
      onClick: (event, rowData) => {
        setAddDialogOpen(true);
      },
      iconProps: {
        color: "primary"
      },
      isFreeAction: true
    }
  ];

  return (
    <div>
      {loading ? (
        <Typography className={classes.loadingText}>Loading...</Typography>
      ) : (
        <MaterialTable
          data={categories}
          columns={columns}
          options={options}
          actions={actions}
        />
      )}
      <AddTemplateDialog
        classes={classes}
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        categories={suggestions}
        setSnackbarProps={setSnackbarProps}
      />
      <AlertDialog
        alertDialogOpen={alertDialogOpen}
        setAlertDialogOpen={setAlertDialogOpen}
        alertDialogProps={alertDialogProps}
      />
      <Snackbar
        snackbarProps={snackbarProps}
        setSnackbarProps={setSnackbarProps}
      />
    </div>
  );
};

CategoryListBase.propTypes = {
  classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(commonStyle);

export default withStyles(combinedStyles)(CategoryListBase);
