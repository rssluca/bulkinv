import React, { useState } from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import { withStyles } from "@material-ui/core/styles";

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;
  return (
    <TextField
      className={classes.textField}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestions(suggestions, value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  popper: {
    zIndex: theme.zIndex.modal
  }
});

const ReactAutosuggest = props => {
  const {
    name,
    label = null,
    placeholder = null,
    passedSuggestions,
    fieldValue,
    setFieldValue,
    classes
  } = props;

  const [suggestions, setSuggestions] = useState([]);
  const [popperNode, setPopperNode] = useState(null);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(passedSuggestions, value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = () => (event, { newValue }) => {
    setFieldValue(newValue);
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: suggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion
  };

  return (
    <Autosuggest
      {...autosuggestProps}
      inputProps={{
        name: name,
        classes,
        label: label,
        placeholder: placeholder,
        value: fieldValue,
        onChange: handleChange(),
        inputRef: node => {
          setPopperNode(node);
        },
        InputLabelProps: {
          shrink: true
        }
      }}
      theme={{
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion
      }}
      renderSuggestionsContainer={options => {
        return (
          <Popper
            anchorEl={popperNode}
            open={Boolean(options.children)}
            className={classes.popper}
          >
            <Paper
              square
              {...options.containerProps}
              style={{
                width: popperNode ? popperNode.clientWidth : null
              }}
            >
              {options.children}
            </Paper>
          </Popper>
        );
      }}
    />
  );
};

ReactAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ReactAutosuggest);
