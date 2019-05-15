import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Link from "@material-ui/core/Link";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useDropzone } from "react-dropzone";
import combineStyles from "../../../utils/combineStyles.js";
import { jsUcfirst } from "../../../utils/textUtils.js";
import addProductsStyle from "../../../assets/jss/views/addProductsStyle.js";
import dropzoneStyle from "../../../assets/jss/components/dropzoneStyle.js";
import commonStyle from "../../../assets/jss/commonStyle.js";
import ReactTable from "react-table";
import "react-table/react-table.css";
import AlertDialog from "../../../components/Dialogs/AlertDialog.js";
import Snackbar from "../../../components/Snackbar";
import { useSessionValue } from "../../../components/Session";

/**
 * Check image filename validity
 *
 * @param {String}  name  The image file name.
 * @returns {Boolean} The adjusted value.
 */
const checkImgName = name => {
  const regex = RegExp(
    "[A-Z]{3,5}-\\d*\\S-[A-Z]{3}-[A-Z]{3}-[a-zA-Z_\\d]*-\\d?-?\\S"
  );

  const maxImages = 3;

  if (regex.test(name) && Number(name.split("-")[5].charAt(0)) <= maxImages) {
    return true;
  }
  return false;
};

/**
 * Remove all image preview blobs
 *
 * @param {Object}  color  The product color
 * @returns {Boolean} true
 */
const revokePreviewImages = color => {
  color.images.forEach(image => {
    URL.revokeObjectURL(image);
  });

  return true;
};

/**
 * Check if special price is set
 *
 * @param {Object}  price_mappings  The mappings array from the DB
 * @param {String}  size  The current size
 * @param {String}  color  The current color
 * @returns {Integer} The adjusted value.
 */
const checkPrice = (price_mappings, size, color) => {
  let returnPrice = null;
  for (const price in price_mappings) {
    if (
      price_mappings[price].sizes.includes(size) &&
      price_mappings[price].colors.includes(color)
    ) {
      returnPrice = price;
    }
  }
  return returnPrice;
};

/**
 * Create a list of sizes to be added for each product color
 *
 * @param {Array}  details  split image name
 * @param {Object}  settings  DB store settings
 * @param {String}  productCode  The product code
 * @returns {Array} the list of size models
 */
const createSizes = (details, settings, productCode) => {
  // Start by adding the parent item
  let size_models = [];

  settings.size_groups.forEach(group => {
    // RETRIEVE PRICE FOR COLOR/GENDER
    // We assign the value as we do not want to run checkPrice too many times
    const mapped_price = checkPrice(
      settings.price_mappings,
      group.name,
      details[2]
    );
    const price =
      mapped_price === null ? settings.default_values.price : mapped_price;

    // prefix is same for all sizes, create it once
    const sku_prefix = [productCode, group.code, details[2]].join("-");

    // Cycle through sizes groups and create size_models object
    group.sizes.forEach((size, index) => {
      const size_name = jsUcfirst(group.name) + " " + size;
      const sku = [sku_prefix, (index + 1).toString().padStart(2, "0")].join(
        "-"
      );

      // If more than one node mapped, spread nodes evenly
      // Return the array id (-1 as starts with 0)
      const node =
        Math.ceil(
          (index + 1) /
            Math.ceil(
              group.sizes.length /
                settings.amazon.node_mappings[group.name].length
            )
        ) - 1;
      size_models.push({
        sku: sku,
        size: size_name,
        node: settings.amazon.node_mappings[group.name][node],
        price: price,
        quantity: settings.default_values.quantity,
        active: true
      });
    });
  });
  return size_models;
};

/**
 * Create rows for the grid
 *
 * @param {Object}  products  The products object
 * @returns {Array} The list of rows
 */
const renderRows = products => {
  const productRows = [];
  for (const productCode in products) {
    const colorRows = [];

    const colors = products[productCode].colors;
    for (const color in colors) {
      // Push first row with color and images
      colorRows.push({
        type: "color",
        product_code: productCode,
        color: color,
        image1: colors[color].images[0],
        image2: colors[color].images[1],
        image3: colors[color].images[2]
      });
      // Size idex is used to refer to the product color size array index when editing in table (see rendeEditable)
      colors[color].sizes.forEach((size, sizeIndex) => {
        colorRows.push({
          size_index: sizeIndex,
          type: "size",
          product_code: productCode,
          sku: size.sku,
          color: color,
          size: size.size,
          node: size.node,
          price: size.price,
          quantity: size.quantity
        });
      });
    }
    // Create parent row
    productRows.push({
      type: "product",
      product_code: productCode,
      sku: [productCode, "parent"].join("-"),
      name: products[productCode].name,
      material: products[productCode].material,
      colors: colorRows
    });
  }

  return productRows;
};

/**
 * Return object of expanded rows
 *
 * @param {Object}  products  The products object
 * @returns {Object} The expanded rows object
 */
const getExpandedRows = products => {
  const expanded = {};
  let index = 0;
  for (const product in products) {
    expanded[index] = products[product].expanded;
    index += 1;
  }
  return expanded;
};

const AddProductsBase = props => {
  const [files, setFiles] = useState([]);
  const [products, setProducts] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState();
  const [{ app }, dispatch] = useSessionValue();
  const { classes } = props;

  useEffect(() => {
    dispatch({
      type: "set",
      newTitle: "Products - Add new"
    });
  }, []);

  // Use this if we want to store info not saved to te cache
  // useEffect(() => {
  //   if (
  //     JSON.parse(localStorage.getItem("products")) !== null &&
  //     Object.values(products).length === 0
  //   ) {
  //     setProducts(JSON.parse(localStorage.getItem("products")));
  //   }
  // }, []);

  // -------------------------------------------------------------------------------------
  // Dropzone functions
  // Initialise dropzone and file addition handling
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
      let newFiles = [];
      let newRows = [];
      let addedFiles = [];
      acceptedFiles.map(file => {
        // Make sure file name is correct, including image sequence
        if (checkImgName(file.name)) {
          // Add preview blob
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          });
          addedFiles.push(file);
        } else {
          console.log(
            "File",
            file.name,
            "name is invalid or image number is greater than max allowed."
          );
        }
      });

      const newProducts = products;
      // Cycle trhough all added files
      addedFiles.forEach(addedFile => {
        const details = addedFile.name.split("-");

        const productCode = [
          details[0],
          app.authUser.current_store.category[1],
          details[1]
        ].join("-");
        // If both product and color already exist..
        if (
          newProducts.hasOwnProperty(productCode) &&
          newProducts[productCode].colors.hasOwnProperty(details[2])
        ) {
          if (newProducts[productCode].name !== details[4]) {
            console.log(
              "This product has already been added with a different name. Please check the name, or delete the existing product to upload a new name."
            );
          } else {
            // if color is present update/add image only
            newProducts[productCode].colors[details[2]].images[details[5] - 1] =
              addedFile.preview;
          }
        } else {
          // otherwise create new  or, if product exists add to existing colors
          const sizes = createSizes(details, app.storeSettings, productCode);
          if (
            newProducts.hasOwnProperty(productCode) &&
            !newProducts[productCode].colors.hasOwnProperty(details[2])
          ) {
            newProducts[productCode].colors[details[2]] = {
              sizes: sizes,
              images: []
            };
            newProducts[productCode].colors[details[2]].images[details[5] - 1] =
              addedFile.preview;
          } else {
            // We use the expanded property to track table expansion for each product
            const product = {
              [productCode]: {
                name: details[4],
                colors: {
                  [details[2]]: {
                    sizes: sizes,
                    images: []
                  }
                },
                material: app.storeSettings.materials[0],
                expanded: true
              }
            };

            product[productCode].colors[details[2]].images[details[5] - 1] =
              addedFile.preview;

            newProducts = { ...newProducts, ...product };
          }
        }
      });

      setFiles(newFiles);
    }
  });

  // Set styles for the dropzone
  const style = useMemo(
    () => ({
      ...dropzoneStyle.baseStyle,
      ...(isDragActive ? dropzoneStyle.activeStyle : {}),
      ...(isDragAccept ? dropzoneStyle.acceptStyle : {}),
      ...(isDragReject ? dropzoneStyle.rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  // Make sure to revoke the previewdata uris to avoid memory leaks
  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  // Dropzone properties
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

  // -------------------------------------------------------------------------------------
  // Data grid functions

  const RowRenderer = ({ renderBaseRow, ...props }) => {
    const backgroundColor = props.row.sku.includes("parent")
      ? "rgb(251, 222, 72)"
      : "";
    return <div style={{ backgroundColor }}>{renderBaseRow(props)}</div>;
  };

  const clearProducts = () => {
    // Remove all preview files first
    // for (const product in products) {
    //   for (const color in products[product].colors) {
    //     revokePreviewImages(products[product].colors[color]);
    //   }
    // }
    setProducts({});
    // localStorage.removeItem("products");
    setAlertDialogOpen(false);
  };

  const deleteProduct = (code, color) => {
    const tempProducts = products;
    // if color is defined and more than one color is present then delete only the product color
    if (color !== undefined && tempProducts[code].colors.length > 1) {
      delete tempProducts[code].colors[color];
    } else {
      delete tempProducts[code];
    }
    // localStorage.setItem("products", JSON.stringify(tempProducts));
    setProducts(tempProducts);
    setAlertDialogOpen(false);
  };

  // Used to render image cell thumb on color header row
  const renderImageCell = (row, image) => {
    if (row.original[image] !== undefined) {
      return (
        <div>
          <img
            src={row.original[image]}
            className={classes.img}
            alt="Preview"
          />
        </div>
      );
    } else {
      return "";
    }
  };

  const toggleExpandAll = () => {
    const tempExpandAll = !expandAll;
    const tempProducts = products;
    for (const code in tempProducts) {
      tempProducts[code].expanded = tempExpandAll;
    }
    setProducts(tempProducts);
    setExpandedRows(getExpandedRows(tempProducts));
    setExpandAll(tempExpandAll);
  };

  const renderEditable = cellInfo => {
    if (cellInfo.original.type === "size") {
      return (
        <div
          style={{ backgroundColor: "#fafafa" }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            const tempProducts = products;
            tempProducts[cellInfo.original.product_code].colors[
              cellInfo.original.color
            ].sizes[cellInfo.original.size_index][cellInfo.column.id] =
              e.target.innerHTML;
            setProducts(tempProducts);
          }}
          dangerouslySetInnerHTML={{
            __html:
              products[cellInfo.original.product_code].colors[
                cellInfo.original.color
              ].sizes[cellInfo.original.size_index][cellInfo.column.id]
          }}
        />
      );
    } else {
      return null;
    }
  };

  const columns = [
    {
      width: 30,
      resizable: false,
      sortable: false,
      Cell: row => {
        if (
          (row.original.sku !== undefined &&
            row.original.sku.includes("parent")) ||
          row.original.sku === undefined
        ) {
          return (
            <div>
              <span>&#xD7;</span>
            </div>
          );
        } else {
          return "";
        }
      },
      style: {
        cursor: "pointer",
        fontSize: 20,
        padding: 0,
        textAlign: "center",
        userSelect: "none"
      },
      getProps: (state, rowInfo, column, instance) => {
        if (rowInfo !== undefined && rowInfo.original.type !== "size") {
          const row = rowInfo.original;
          const color = row.type === "color" ? " - color " + row.color : "";
          return {
            onClick: () => {
              setAlertDialogProps({
                open: true,
                action: () => deleteProduct(row.product_code, row.color),
                icon: "warning",
                type: "continue",
                title: `Are you sure?`,
                message: `Do you want to delete product ${
                  row.product_code
                } ${color}?`
              });

              setAlertDialogOpen(true);
            }
          };
        } else {
          return {};
        }
      }
    },
    {
      expander: true,
      width: 30,
      resizable: false,
      sortable: false,
      Expander: ({ isExpanded, ...rest }) => {
        if (rest.original.type === "product") {
          return (
            <div className={classnames("rt-expander", isExpanded && "-open")}>
              &bull;
            </div>
          );
        } else {
          return null;
        }
      },
      style: {
        cursor: "pointer",
        fontSize: 20,
        padding: "0",
        textAlign: "center",
        userSelect: "none"
      }
    },
    { Header: "SKU", accessor: "sku", width: 200 },
    { Header: "Name", accessor: "name", width: 300 },
    { Header: "Color", accessor: "color", sortable: false },
    { Header: "Size", accessor: "size", sortable: false },
    {
      Header: "Node",
      accessor: "node",
      sortable: false,
      Cell: renderEditable
    },
    {
      Header: "Price",
      accessor: "price",
      sortable: false,
      Cell: renderEditable
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      sortable: false,
      Cell: renderEditable
    },
    {
      Header: "Image 1",
      accessor: "image1",
      sortable: false,
      Cell: row => renderImageCell(row, "image1")
    },
    {
      Header: "Image 2",
      accessor: "image2",
      sortable: false,
      Cell: row => renderImageCell(row, "image2")
    },
    {
      Header: "Image 3",
      accessor: "image3",
      sortable: false,
      Cell: row => renderImageCell(row, "image3")
    }
  ];

  // Do not show columns in subcomponent
  const TheadComponent = props => null;

  return (
    <div>
      <div className={classes.marginBottom4} {...rootProps}>
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
        <input {...getInputProps()} />
      </div>
      <div>
        <Link
          component="button"
          variant="body2"
          className={classnames(classes.marginRight4, classes.marginBottom)}
          onClick={() => toggleExpandAll(true)}
        >
          Expand all
        </Link>
        <Link
          component="button"
          variant="body2"
          className={classnames(classes.marginRight4, classes.marginBottom)}
          onClick={() => toggleExpandAll(false)}
        >
          Collapse all
        </Link>
        <ReactTable
          data={renderRows(products)}
          columns={columns}
          style={{ fontSize: 14 }}
          collapseOnDataChange={false}
          expanded={expandedRows}
          onExpandedChange={(newExpanded, index, event, row) => {
            const tempProducts = products;
            tempProducts[row.original.product_code].expanded = !tempProducts[
              row.original.product_code
            ].expanded;
            setProducts(tempProducts);
            setExpandedRows(getExpandedRows(tempProducts));
          }}
          SubComponent={row => {
            return (
              <div style={{ paddingLeft: "34px" }}>
                <ReactTable
                  data={row.original.colors}
                  columns={columns}
                  showPagination={false}
                  pageSize={10000}
                  TheadComponent={TheadComponent}
                  minRows={0}
                />
              </div>
            );
          }}
        />
      </div>
      {Object.values(products).length !== 0 && (
        <div className={classes.textRight}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => {
              setAlertDialogProps({
                open: true,
                action: () => clearProducts(),
                icon: "warning",
                type: "continue",
                title: `Are you sure?`,
                message: "Remove all added products?"
              });
              setAlertDialogOpen(true);
            }}
          >
            Clear products
          </Button>
        </div>
      )}

      <AlertDialog
        alertDialogOpen={alertDialogOpen}
        setAlertDialogOpen={setAlertDialogOpen}
        alertDialogProps={alertDialogProps}
      />
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
