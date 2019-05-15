import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import combineStyles from "../../../utils/combineStyles.js";
import { jsUcfirst } from "../../../utils/textUtils.js";
import addProductsStyle from "../../../assets/jss/views/addProductsStyle.js";
import commonStyle from "../../../assets/jss/commonStyle.js";
import ReactTable from "react-table";
import "react-table/react-table.css";
import AlertDialog from "../../../components/Dialogs/AlertDialog.js";
import Snackbar from "../../../components/Snackbar";
import { useSessionValue } from "../../../components/Session";
import Icon from "@material-ui/core/Icon";
import ToggleOnIcon from "@material-ui/icons/ToggleOnOutlined";
import ToggleOffIcon from "@material-ui/icons/ToggleOffOutlined";
import ClearIcon from "@material-ui/icons/Clear";
/**
 * Check image filename validity
 *
 * @param {String}  name  The image file name.
 * @param {Number}  maxImages  Max image setting
 * @param {Array}  sizeGroups  The list of size groups
 * @returns {Boolean} The adjusted value. Returns false if valid, error string if invalid
 */
const checkImgName = (name, maxImages, sizeGroups) => {
  const regex = RegExp("[A-Z]{3,5}-\\d*\\S-[A-Z]{3}-[A-Z]{3}-[a-zA-Z_\\d]*-\\d?-?\\S");

  const product_type = name.split("-")[0].substr(-1);

  if (!regex.test(name)) {
    return "Error: invalid file name";
  } else if (Number(name.split("-")[5].charAt(0)) > maxImages) {
    return `Error: image number is greater than max allowed (${maxImages}).`;
  } else if (!sizeGroups.includes(product_type)) {
    return `Error: product type "${product_type}" is invalid`;
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
    URL.revokeObjectURL(image.preview);
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
    if (price_mappings[price].sizes.includes(size) && price_mappings[price].colors.includes(color)) {
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

  const type_code = details[0].substr(-1);

  // Remeber to add the product types
  settings.size_groups[type_code].sizes.forEach(group => {
    // RETRIEVE PRICE FOR COLOR/GENDER We assign the value as we do not want to run checkPrice too many times Retrieve price
    // by the current product's type
    const mapped_price = checkPrice(settings.price_mappings[details[0]], group.name, details[2]);
    const price = mapped_price === null ? settings.default_values.price : mapped_price;

    // prefix is same for all sizes, create it once
    const sku_prefix = [productCode, group.code, details[2]].join("-");

    // Cycle through sizes groups and create size_models object
    group.sizes.forEach((size, index) => {
      const size_name = jsUcfirst(group.name) + " " + size;
      const sku = [sku_prefix, (index + 1).toString().padStart(2, "0")].join("-");

      // If more than one node mapped, spread nodes evenly Return the array id (-1 as starts with 0) Check if node exists for
      // this groups
      let node = "";
      if (settings.amazon.node_mappings[type_code].hasOwnProperty(group.name)) {
        node =
          Math.ceil(
            (index + 1) / Math.ceil(group.sizes.length / settings.amazon.node_mappings[type_code][group.name].length)
          ) - 1;
      }

      size_models.push({
        sku: sku,
        size: size_name,
        amazon_node: settings.amazon.node_mappings[type_code][group.name][node]
          ? settings.amazon.node_mappings[type_code][group.name][node]
          : "",
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
      // Image becomes a string when it is saved
      colorRows.push({
        row_type: "color",
        product_code: productCode,
        color: color,
        color_name: colors[color].color_name,
        image1: colors[color].images[0]
          ? typeof colors[color].images[0] !== "string"
            ? colors[color].images[0].preview
            : colors[color].images[0]
          : undefined,
        image2: colors[color].images[1]
          ? typeof colors[color].images[1] !== "string"
            ? colors[color].images[1].preview
            : colors[color].images[1]
          : undefined,
        image3: colors[color].images[2]
          ? typeof colors[color].images[2] !== "string"
            ? colors[color].images[2].preview
            : colors[color].images[2]
          : undefined
      });
      // Size idex is used to refer to the product color size array index when editing in table (see rendeEditable)
      colors[color].sizes.forEach((size, sizeIndex) => {
        colorRows.push({
          size_index: sizeIndex,
          row_type: "size",
          product_code: productCode,
          sku: size.sku,
          color_name: colors[color].color_name,
          color: color,
          size: size.size,
          node: size.node,
          price: size.price,
          quantity: size.quantity,
          active: size.active
        });
      });
    }
    // Create parent row
    productRows.push({
      row_type: "product",
      product_code: productCode,
      design_type: products[productCode].design_type,
      sku: [productCode, "parent"].join("-"),
      name: products[productCode].name,
      material: products[productCode].material,
      colors: colorRows,
      keywords: products[productCode].keywords
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
  // File uploader states
  const [{ firebase }] = useSessionValue();

  const [products, setProducts] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [expandAll, setExpandAll] = useState(true);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState();
  const [snackbarProps, setSnackbarProps] = useState();
  const [{ app }] = useSessionValue();
  const { classes } = props;

  // -------------------------------------------------------------------------------------
  // File upload

  const storeProductImages = async () => {
    const imagesPath =
      "/stores/" +
      app.authUser.current_store.uid +
      "/" +
      app.authUser.current_store.category[0] +
      "/" +
      app.authUser.current_store.category[1] +
      "/images/products/";

    let files = [];
    for (const product in products) {
      for (const color in products[product].colors) {
        products[product].colors[color].images.forEach((file, index) => {
          if (typeof file === "string") {
            return;
          }
          // Add metadata, used to add image urls back to product (unless already included)

          const metadata = {
            contentType: "image/jpeg",
            customMetadata: {
              product_code: product,
              color: color,
              image_index: index
            }
          };
          file["metadata"] = metadata;

          files.push(file);
        });
      }
    }

    const ref = firebase.storage.ref(imagesPath);

    ref.constructor.prototype.putFiles = function(files) {
      var ref = this;
      return Promise.all(
        files.map(function(file) {
          return ref.child(file.name).put(file, file.metadata);
        })
      );
    };

    // use it!
    const uploadSnapshots = await ref
      .putFiles(files)
      .then(function(UploadTaskSnapshots) {
        return UploadTaskSnapshots;
      })
      .catch(function(error) {
        console.log(error);
        return null;
      });
    return uploadSnapshots;
  };

  const processArray = async snapshots => {
    let finalProducts = products;
    // map array to promises
    const promises = snapshots.map(async snapshot => {
      await snapshot.ref.getDownloadURL().then(url => {
        const customMetadata = snapshot.metadata.customMetadata;
        finalProducts[customMetadata.product_code].colors[customMetadata.color].images[
          customMetadata.image_index
        ] = url;
      });
    }); // wait until all promises are resolved
    await Promise.all(promises);

    return finalProducts;
  };

  /**
   * Start download handler, save products to db and request excel file
   */
  const saveProducts = async () => {
    setAlertDialogProps({
      action: null,
      icon: "",
      type: "progress",
      title: "Please wait..",
      message: "Uploading images..."
    });
    setAlertDialogOpen(true);

    const uploadSnapshots = await storeProductImages();
    const finalProducts = await processArray(uploadSnapshots);

    setAlertDialogProps(prevState => {
      return {
        ...prevState,
        message: "Generating template..."
      };
    });

    const create_template = firebase.functions.httpsCallable("api/create_amazon_template");
    console.log("sending info for template");
    create_template({
      products: finalProducts,
      store: {
        ...app.authUser.current_store,
        settings: app.storeSettings
      },
      template: app.categorySettings.templates.amazon
    })
      .then(function(result) {
        setAlertDialogProps(prevState => {
          return {
            ...prevState,
            message: "Retrieving link"
          };
        });
        firebase.storage
          .ref(result.data.path + result.data.name)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            // Once url is back lets update the products state since we have saved images to FB storage
            setProducts({ ...finalProducts });
            setAlertDialogProps({
              action: () => clearProducts(),
              icon: "",
              type: "continue",
              yes: "Clear Products",
              no: "Continue editing",
              title: "Please wait..",
              message: (
                <Typography variant="body1" color="textSecondary" id="alert-dialog-description">
                  Template is ready for download:
                  <br />
                  <Link href={url} download={result.data.name}>
                    {result.data.name}
                  </Link>
                </Typography>
              )
            });
          });
      })
      .catch(function(error) {
        // Getting the Error details.
        console.log(error.code, error.message, error.details);

        setAlertDialogProps({
          action: null,
          icon: "error",
          type: "confirm",
          title: error.message,
          message: error.details
        });
        setAlertDialogOpen(true);
      });
  };

  /**
   * Check for missing images, if no or continue go ahead and save
   */
  const onSaveProductsClick = () => {
    // First, check that all images have been included
    let incompleteProducts = [];
    for (const product in products) {
      for (const color in products[product].colors) {
        if (products[product].colors[color].images.length < app.storeSettings.max_images) {
          incompleteProducts.push(product + "-" + color);
        }
      }
    }
    let message = "Do you want to save the products?";

    if (incompleteProducts.length > 0) {
      message = (
        <Typography variant="body1" color="textSecondary" id="alert-dialog-description">
          The following products are missing one or more images:
          <br />
          <br /> {incompleteProducts.join(", ")}
          <br />
          <br />
          Do you want to continue?
        </Typography>
      );
    }

    setAlertDialogProps({
      action: () => saveProducts(),
      icon: "warning",
      type: "continue",
      title: `Are you sure?`,
      message: message
    });
    setAlertDialogOpen(true);
  };

  /**
   * Files onChange event handler
   * Store selected files in the state
   */
  const onFilesChangeHandler = event => {
    event.persist();
    const {
      target: { files }
    } = event;

    let newProducts = products;

    // Loop through files, check that each file name is correct then
    for (var i = 0; i < files.length; i++) {
      const file = files[i];

      // Check for image errors
      const imageError = checkImgName(
        file.name,
        app.storeSettings.max_images,
        Object.keys(app.storeSettings.size_groups, Object.keys(app.storeSettings.size_groups))
      );

      if (imageError) {
        setSnackbarProps({
          open: true,
          variant: "warning",
          message: imageError
        });
      } else {
        const details = file.name.split("-");
        const productCode = [details[0], app.authUser.current_store.category[1], details[1]].join("-");
        const type_code = details[0].substr(-1);
        const newProductName = app.storeSettings.size_groups[type_code].name + " " + details[4].replace(/_/g, " ");

        // If both product and color already exist..
        if (newProducts.hasOwnProperty(productCode) && newProducts[productCode].colors.hasOwnProperty(details[2])) {
          // No need to check if name exists since it is modifiable
          // if (newProducts[productCode].name !== newProductName) {
          //   setSnackbarProps({
          //     open: true,
          //     variant: "warning",
          //     message: `Product ${productCode} has already been added with a different name. Please check the name, or delete the existing product to upload a new name.`
          //   });
          // } else {
          // Add preview blob
          // Do not move from here or below. We only want to create a preview if required.
          Object.assign(file, { preview: URL.createObjectURL(file) });
          newProducts[productCode].colors[details[2]].images[details[5] - 1] = file;
          // }
        } else {
          // Add preview blob
          Object.assign(file, { preview: URL.createObjectURL(file) });
          // otherwise create new  or, if product exists add to existing colors
          const sizes = createSizes(details, app.storeSettings, productCode);
          if (newProducts.hasOwnProperty(productCode) && !newProducts[productCode].colors.hasOwnProperty(details[2])) {
            newProducts[productCode].colors[details[2]] = {
              color_name: app.storeSettings.colors[details[2]],
              sizes: sizes,
              images: []
            };
            // console.log("Adding color and image", details[5]);
            newProducts[productCode].colors[details[2]].images[details[5] - 1] = file;
          } else {
            // We use the expanded property to track table expansion for each product Also the design_type to match descriptions and
            // keywords Product name includes name of type

            // Combine product type and design type(if exists) keywords
            const keywords =
              app.storeSettings.descriptions.product_types[type_code].keywords +
              (app.storeSettings.descriptions.design_types.hasOwnProperty(details[3])
                ? " " + app.storeSettings.descriptions.design_types[details[3]].keywords
                : "");

            const product = {
              [productCode]: {
                type_code: type_code,
                name: newProductName,
                colors: {
                  [details[2]]: {
                    color_name: app.storeSettings.colors[details[2]],
                    sizes: sizes,
                    images: []
                  }
                },
                material: app.storeSettings.materials[0],
                design_type: details[3],
                keywords: keywords,
                expanded: true
              }
            };
            // console.log("Adding product", details[5]);
            product[productCode].colors[details[2]].images[details[5] - 1] = file;

            newProducts = {
              ...newProducts,
              ...product
            };
          }
        }
        // localStorage.setItem("products", JSON.stringify(newProducts));

        setProducts({
          ...newProducts
        });

        setExpandedRows(getExpandedRows(newProducts));
      }
    }
  };

  // -------------------------------------------------------------------------------------
  // React Table  functions

  /**
   * Clear Products
   */
  const clearProducts = () => {
    // Remove all preview files first
    for (const product in products) {
      for (const color in products[product].colors) {
        revokePreviewImages(products[product].colors[color]);
      }
    }
    setProducts({});
    // localStorage.removeItem("products");
    setAlertDialogOpen(false);
  };

  /**
   * Delete a product or color
   */
  const deleteProduct = (product, color) => {
    const newProducts = products;
    // if color is defined and more than one color is present then delete only the product color
    if (color !== undefined && Object.keys(newProducts[product].colors).length > 1) {
      revokePreviewImages(newProducts[product].colors[color]);
      delete newProducts[product].colors[color];
    } else {
      for (const color in newProducts[product].colors) {
        revokePreviewImages(products[product].colors[color]);
      }
      delete newProducts[product];
    }
    // localStorage.setItem("products", JSON.stringify(newProducts));
    setProducts({
      ...newProducts
    });
    setAlertDialogOpen(false);
  };

  /**
   * Used to render image cell thumb on color header row
   */
  const renderImageCell = (row, image) => {
    if (row.original[image] !== undefined) {
      return (
        <div>
          <img src={row.original[image]} className={classes.productImage} alt="Preview" />
        </div>
      );
    } else {
      return "";
    }
  };

  /**
   * Expand/Collapse all rows
   */
  const toggleExpandAll = () => {
    const tempExpandAll = !expandAll;
    const newProducts = products;
    for (const code in newProducts) {
      newProducts[code].expanded = tempExpandAll;
    }
    setProducts(newProducts);
    setExpandedRows(getExpandedRows(newProducts));
    setExpandAll(tempExpandAll);
  };

  /**
   * Toggle size active status
   */
  const toggleSizeActive = rowInfo => {
    const row = rowInfo.original;
    const active = !products[row.product_code].colors[row.color].sizes[row.size_index].active;

    const newProducts = products;

    newProducts[row.product_code].colors[row.color].sizes[row.size_index].active = active;

    setProducts({
      ...newProducts
    });
  };

  /**
   * Render editable fields
   */
  const renderEditable = (cellInfo, max_lenght) => {
    const cell = cellInfo.original;
    const column = cellInfo.column;
    // Only allow product (name/keywords) and size rows to be edited (not color) - Also make sure size has not been disabled
    if (
      (cell.row_type === "product" && ["name", "keywords"].includes(column.id)) ||
      (cell.row_type === "size" && cell.active === true)
    ) {
      const field =
        cell.row_type === "size"
          ? products[cell.product_code].colors[cell.color].sizes[cell.size_index][column.id]
          : products[cell.product_code][column.id];

      const setTarget = e => {
        const newProducts = products;
        if (cell.row_type === "size") {
          newProducts[cell.product_code].colors[cell.color].sizes[cell.size_index][column.id] = e.target.innerHTML;
        } else {
          newProducts[cell.product_code][column.id] = e.target.innerHTML;
        }
        setProducts({ ...newProducts });
      };

      return (
        <div
          style={{
            backgroundColor: "#fafafa"
          }}
          contentEditable="true"
          onKeyDown={e => {
            if (e.which === 13) {
              e.preventDefault();
            }
          }}
          suppressContentEditableWarning="suppressContentEditableWarning"
          onBlur={setTarget}
          dangerouslySetInnerHTML={{
            __html: field
          }}
        />
      );
    } else {
      return null;
    }
  };

  const columns = [
    {
      expander: true,
      width: 30,
      resizable: false,
      sortable: false,
      Expander: ({ isExpanded, ...rest }) => {
        if (rest.original.row_type === "product") {
          return (
            <div>
              <Icon fontSize="inherit">{isExpanded ? "expand_more" : "expand_less"}</Icon>
            </div>
          );
        } else {
          return null;
        }
      },
      style: {
        cursor: "pointer",
        fontSize: 20,
        padding: 0,
        paddingTop: 6,
        textAlign: "center",
        userSelect: "none"
      }
    },
    {
      width: 30,
      // resizable: false,
      sortable: false,
      Cell: row => {
        if (row.original.row_type !== "size") {
          return (
            <div>
              <ClearIcon fontSize="inherit" className={classes.iconHoverSecondary} />
            </div>
          );
        } else {
          return (
            <div>
              {row.original.active ? (
                <ToggleOnIcon fontSize="inherit" color="primary" className={classes.iconHoverDisabled} />
              ) : (
                <ToggleOffIcon fontSize="inherit" color="disabled" />
              )}
            </div>
          );
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
        // If row type product or color display delete button
        if (rowInfo !== undefined && rowInfo.original.row_type !== "size") {
          const row = rowInfo.original;
          const color = row.row_type === "color" ? " - color " + row.color : "";
          return {
            onClick: () => {
              setAlertDialogProps({
                action: () => deleteProduct(row.product_code, row.color),
                icon: "warning",
                type: "continue",
                title: `Are you sure?`,
                message: `Do you want to delete product ${row.product_code} ${color}?`
              });

              setAlertDialogOpen(true);
            }
          };
        } else {
          // Otherwise display deactivate button
          return {
            onClick: () => toggleSizeActive(rowInfo)
          };
        }
      }
    },
    {
      Header: "SKU",
      accessor: "sku",
      width: 200
    },
    {
      Header: "Name",
      accessor: "name",
      width: 300,
      Cell: rowInfo => renderEditable(rowInfo, 50)
    },
    {
      Header: "Type",
      accessor: "design_type"
    },
    {
      Header: "Color",
      accessor: "color_name",
      sortable: false
    },
    {
      Header: "Size",
      accessor: "size",
      sortable: false
    },
    {
      Header: "Amazon Node",
      accessor: "amazon_node",
      sortable: false,
      Cell: rowInfo => renderEditable(rowInfo, 12)
    },
    {
      Header: "Price",
      accessor: "price",
      sortable: false,
      Cell: rowInfo => renderEditable(rowInfo, 6)
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      sortable: false,
      Cell: rowInfo => renderEditable(rowInfo, 6)
    },
    {
      Header: "Keywords",
      accessor: "keywords",
      width: 300,
      sortable: false,
      Cell: rowInfo => renderEditable(rowInfo, 200)
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

  // Remove unnecessary columns for subcomponents (expander column)
  const subColumns = [...columns];
  subColumns.splice(0, 1);

  // Do not show columns in subcomponent
  const TheadComponent = props => null;

  return (
    <div>
      <div className={classes.marginBottom4}>
        <form>
          <input
            hidden="hidden"
            accept="image/*"
            name="image-uploader-multiple"
            onChange={e => {
              onFilesChangeHandler(e);
            }}
            onClick={event => {
              // Clear the input otherwise cannot select same item more than once consecutively
              event.target.value = null;
            }}
            multiple="multiple"
            id="text-button-file"
            type="file"
          />
          <label htmlFor="text-button-file">
            <Button component="span" variant="contained" color="default" className={classes.button}>
              Add Product Images
              <CloudUploadIcon className={classes.marginLeft} />
            </Button>
          </label>
        </form>
      </div>
      <div>
        <Link
          component="button"
          variant="body2"
          className={classNames(classes.marginRight4, classes.marginBottom)}
          onClick={() => toggleExpandAll(true)}
        >
          Expand all
        </Link>
        <Link
          component="button"
          variant="body2"
          className={classNames(classes.marginRight4, classes.marginBottom)}
          onClick={() => toggleExpandAll(false)}
        >
          Collapse all
        </Link>
        <ReactTable
          data={renderRows(products)}
          columns={columns}
          style={{
            fontSize: 14
          }}
          noDataText={"No products added"}
          collapseOnDataChange={false}
          getTdProps={(state, rowInfo, column, instance) => {
            if (column.Header === "Name" || column.Header === "Keywords") {
              return {
                style: {
                  whiteSpace: "normal"
                }
              };
            }
            return {};
          }}
          expanded={expandedRows}
          minRows={Object.keys(products).length > 0 ? 0 : 20}
          onExpandedChange={(newExpanded, index, event, row) => {
            const newProducts = products;
            newProducts[row.original.product_code].expanded = !newProducts[row.original.product_code].expanded;
            setProducts({
              ...newProducts
            });
            setExpandedRows(getExpandedRows(newProducts));
          }}
          SubComponent={row => {
            return (
              <div
                style={{
                  paddingLeft: "29px"
                }}
              >
                <ReactTable
                  data={row.original.colors}
                  columns={subColumns}
                  showPagination={false}
                  pageSize={10000}
                  TheadComponent={TheadComponent}
                  minRows={0}
                  getTdProps={(state, rowInfo, column, instance) => {
                    // Strike through inactive row cells (not action cells)
                    if (
                      rowInfo.original.row_type === "size" &&
                      rowInfo.original.active === false &&
                      column.Header !== undefined
                    ) {
                      return {
                        style: {
                          textDecoration: "line-through",
                          color: "rgba(0, 0, 0, 0.54)"
                        }
                      };
                    } else {
                      return {};
                    }
                  }}
                  getTrProps={(state, rowInfo, column) => {
                    // Color color rows
                    let color = rowInfo.original.row_type === "color" ? "#e0f1ff" : "transparent";
                    return {
                      style: {
                        background: color
                      }
                    };
                  }}
                />
              </div>
            );
          }}
        />
      </div>
      {Object.values(products).length !== 0 && (
        <div className={classNames(classes.textRight, classes.marginTop)}>
          <Button
            variant="contained"
            color="secondary"
            className={classNames(classes.marginRight4, classes.button)}
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
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              onSaveProductsClick();
            }}
          >
            Save/Export
          </Button>
        </div>
      )}

      <AlertDialog
        alertDialogOpen={alertDialogOpen}
        setAlertDialogOpen={setAlertDialogOpen}
        alertDialogProps={alertDialogProps}
      />
      <Snackbar snackbarProps={snackbarProps} setSnackbarProps={setSnackbarProps} />
    </div>
  );
};

AddProductsBase.propTypes = {
  classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(addProductsStyle, commonStyle);

export default withStyles(combinedStyles)(AddProductsBase);
