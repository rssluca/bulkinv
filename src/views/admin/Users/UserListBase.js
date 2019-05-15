import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSessionValue } from "../../../components/Session";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import combineStyles from "../../../utils/combineStyles.js";
import commonStyle from "../../../assets/jss/commonStyle.js";
import Typography from "@material-ui/core/Typography";

const UserListBase = props => {
  const [{ firebase }] = useSessionValue();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      setLoading(true);

      const unsubscribe = firebase.db.collection("users").onSnapshot(snapshot => {
        let users = [];

        snapshot.forEach(doc => users.push({ ...doc.data(), uid: doc.id }));

        setUsers(users);
        setLoading(false);
      });

      return () => {
        // Clean up the subscription
        unsubscribe();
      };
    },
    [firebase.db]
  );

  const { classes } = props;

  // Create table header details
  const columns = [
    {
      field: "uid",
      title: "UID",
      options: {
        filter: false,
        sort: false
      }
    },
    {
      field: "email",
      title: "E-mail",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      field: "name.first",
      title: "First Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      field: "name.last",
      title: "Last Name",
      options: {
        filter: true,
        sort: true
      }
    }
  ];

  const options = {
    actionsColumnIndex: -1,
    showTitle: false,
    // toolbarButtonAlignment: "left",
    searchFieldAlignment: "left"
  };

  const actions = [
    {
      icon: "edit",
      tooltip: "Edit User",
      onClick: (event, rowData) => {
        alert("You clicked user " + rowData.name);
      },
      iconProps: {
        color: "primary"
      }
    },
    {
      icon: "delete",
      tooltip: "Delete User",
      onClick: (event, rowData) => {
        alert("You clicked user " + rowData.name);
      },
      iconProps: {
        color: "secondary"
      }
    },
    {
      icon: "add",
      tooltip: "Add User",
      onClick: (event, rowData) => {
        alert("You clicked user " + rowData.name);
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
        <MaterialTable data={users} columns={columns} options={options} actions={actions} />
      )}
    </div>
  );
};

UserListBase.propTypes = {
  classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(commonStyle);

export default withStyles(combinedStyles)(UserListBase);
