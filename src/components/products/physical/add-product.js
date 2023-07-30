import React, { Component, Fragment } from "react";
import Breadcrumb from "../../common/breadcrumb";
import addProduct from "../../../assets/images/addProduct.png";
import { uploadImage, uploadProduct } from "../../../firebase/firebase.utils";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { connect } from "react-redux";
import {
  getAllAttributesRedux,
  uploadAttributeRedux,
  getAllCategoriesRedux,
  getAllBrandsRedux,
  getAllTagsRedux,
} from "../../../actions";
export class Add_product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      skuId: "",
      name: "",
      price: "",
      salePrice: "",
      pictures: [addProduct, addProduct, addProduct, addProduct],
      availability: "In-Stock",
      shortDetails: "",
      description: "",
      stock: "",
      new: true,
      sale: true,
      category: "Bags",
      colors: [],
      size: [],
      rating: 5,
      file: "",
      quantity: "",
      brand: "",
      productType: "simpleProduct",
      schedule: false,
      startDate: "",
      endDate: "",
      productOption: "General",
      backOrders: "Do not allow",
      lowStockAlert: "",
      soldIndividually: false,
      stockStatus: "In stock",
      manageStock: false,
      weight: "",
      length: "",
      width: "",
      height: "",
      shippingClass: "",
      enableReveiws: true,
      enableVariations: true,
      menuOrder: "",
      upSells: "",
      crossSells: "",
      attribute: "",
      selectedAttributes: [],
      variations: "",
      selectedVariations: [],
      videoUrl: "",
      checkedValues: [],
      checkedValues2: [],
      addCategory: false,
      addBrand: false,
      categoryName: "",
      parentCategory: "",
      mostUsedTags: false,
      editPublished: false,
      editVisibility: false,
      published: "Published",
      visibility: "Public",
      tag: "",
      showSuggestion: false,
      showSuggestion2: false,
      cursor: -1,
      selectedTags: [],
      newAttribute: "",
      attributes: [],
      savedAttributes: [],
      displayedVariations: [],
    };
  }

  componentDidMount = () => {
    this.props.getAllAttributesRedux();
    this.props.getAllCategoriesRedux();
    this.props.getAllBrandsRedux();
    this.props.getAllTagsRedux();
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.attributes.length !== nextProps.attributes.length) {
      this.setState({
        attributes: nextProps.attributes,
      });
      console.log("component will receive is getting called!");
    }
  };

  IncrementItem = () => {
    this.setState((prevState) => {
      if (prevState.quantity < 9) {
        return {
          quantity: prevState.quantity + 1,
        };
      } else {
        return null;
      }
    });
  };
  DecreaseItem = () => {
    this.setState((prevState) => {
      if (prevState.quantity > 0) {
        return {
          quantity: prevState.quantity - 1,
        };
      } else {
        return null;
      }
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleAttributesChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      {
        selectedAttributes: [...this.state.selectedAttributes, value],
      },
      () => {
        console.log(this.state.selectedAttributes);
        console.log(value);
      }
    );
  };
  handleProductTypeChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      if (this.state.productType === "simpleProduct") {
        this.setState({
          productOption: "General",
        });
      } else {
        this.setState({
          productOption: "Inventory",
        });
      }
    });
  };

  handleFormSubmit = async () => {
    const id = new Date().getTime().toString();
    const product = await uploadProduct({ ...this.state, id });
    if (product) {
      toast.success("New Product is uploaded");
    } else {
      toast.error("An error occurred. Try again later.");
    }
    this.setState({
      id: "",
      skuId: "",
      name: "",
      price: "",
      salePrice: "",
      pictures: [addProduct, addProduct, addProduct, addProduct],
      availability: "In-Stock",
      shortDetails: "",
      description: "",
      stock: "",
      new: true,
      sale: true,
      category: "Bags",
      colors: [],
      size: [],
      rating: 5,
      file: "",
      quantity: "",
      brand: "",
      productType: "simpleProduct",
      schedule: false,
      startDate: "",
      endDate: "",
      productOption: "General",
      backOrders: "Do not allow",
      lowStockAlert: "",
      soldIndividually: false,
      stockStatus: "In stock",
      manageStock: false,
      weight: "",
      length: "",
      width: "",
      height: "",
      shippingClass: "",
      enableReveiws: false,
      menuOrder: "",
      upSells: "",
      crossSells: "",
      attribute: "",
      selectedAttributes: [],
      variations: "",
      selectedVariations: [],
      videoUrl: "",
      checkedValues: [],
      addCategory: false,
      addBrand: false,
      categoryName: "",
      parentCategory: "",
      mostUsedTags: false,
      editPublished: false,
      editVisibility: false,
      published: "",
      visibility: "",
      tag: "",
      showSuggestion: false,
      showSuggestion2: false,
      cursor: -1,
      cursor2: -1,
      selectedTags: [],
    });
  };

  //image upload
  handleMainImgChange = async (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    console.log(file);
    reader.onloadend = () => {
      this.setState({
        file,
        mainImg: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
      const imgUrl = await uploadImage(file);
      console.log(imgUrl);
      this.setState({
        mainImg: imgUrl,
      });
    }
  };

  handleCkChange = (e, editor) => {
    let data = editor.getData();
    this.setState({
      description: data,
    });
  };
  handleCkChange2 = (e, editor) => {
    let data = editor.getData();
    this.setState({
      shortDetails: data,
    });
  };

  handleChangeTag = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, showSuggestion: true, cursor: -1 });
  };
  handleChangeTerms = (e, attr) => {
    const { name, value } = e.target;
    this.setState({
      showSuggestion2: true,
      cursor2: -1,
      attributes: this.state.attributes.map((attr1) => {
        if (attr1.id !== attr.id) {
          return attr1;
        } else {
          return { ...attr1, newTerms: value };
        }
      }),
    });
  };

  _handleImgChange = async (e, i) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    const { pictures } = this.state;

    reader.onloadend = () => {
      pictures[i] = reader.result;
      this.setState({
        file: file,
        pictures,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
      const imgUrl = await uploadImage(file);
      console.log(imgUrl);
      pictures[i] = imgUrl;
      this.setState({
        pictures,
      });
      console.log(pictures);
    }
  };

  handleKeyDown = (e) => {
    const { cursor } = this.state;
    let result = [];
    if (this.state.tag) {
      const suggestionByName = this.props.tags.filter((tagName) =>
        tagName.name.toLowerCase().includes(this.state.tag.toLowerCase())
      );

      result = [...suggestionByName].slice(0, 10);

      // arrow up/down button should select next/previous list element
      if (e.keyCode === 38 && cursor > -1) {
        this.setState((prevState) => ({
          cursor: prevState.cursor - 1,
        }));
      } else if (e.keyCode === 40 && cursor < result.length - 1) {
        this.setState((prevState) => ({
          cursor: prevState.cursor + 1,
        }));
      } else if (e.keyCode === 13 && cursor > -1) {
        this.setState({
          tag: "",
          selectedTags: [result[cursor].name, ...this.state.selectedTags],
          showSuggestion: false,
        });
      }
    } else {
      result = [];
    }
  };
  handleKeyDown2 = (e, attribute) => {
    const { cursor2 } = this.state;
    let result = [];
    if (
      this.state.attributes.find((attr) => attr.id == attribute.id).newTerms
    ) {
      const suggestionByName = attribute.terms.filter((term) =>
        term.name
          .toLowerCase()
          .includes(
            this.state.attributes
              .find((attr) => attr.id == attribute.id)
              .newTerms.toLowerCase()
          )
      );

      result = [...suggestionByName].slice(0, 10);

      // arrow up/down button should select next/previous list element
      if (e.keyCode === 38 && cursor2 > -1) {
        this.setState((prevState) => ({
          cursor2: prevState.cursor2 - 1,
        }));
      } else if (e.keyCode === 40 && cursor2 < result.length - 1) {
        this.setState((prevState) => ({
          cursor2: prevState.cursor2 + 1,
        }));
      } else if (e.keyCode === 13 && cursor2 > -1) {
        console.log(result[cursor2]);
        this.setState({
          attributes: this.state.attributes.map((attr) => {
            if (attr.id === attribute.id) {
              return {
                ...attr,
                newTerms: "",
                selectedTerms: attr.selectedTerms
                  ? [...attr.selectedTerms, result[cursor2]]
                  : [result[cursor2]],
              };
            } else {
              return attr;
            }
          }),
          showSuggestion2: false,
        });
      }
    } else {
      result = [];
    }
  };

  clickActive = (event) => {
    document.querySelector(".nav-link").classList.remove("show");
    event.target.classList.add("show");
  };

  clickActive2 = (event) => {
    document.querySelector(".nav-link2").classList.remove("show");
    event.target.classList.add("show");
  };

  selectRow = (e, i) => {
    if (!e.target.checked) {
      this.setState({
        checkedValues: this.state.checkedValues.filter((item, j) => i !== item),
      });
    } else {
      this.state.checkedValues.push(i);
      this.setState({
        checkedValues: this.state.checkedValues,
      });
    }
  };

  selectRow2 = (e, i) => {
    if (!e.target.checked) {
      this.setState({
        checkedValues2: this.state.checkedValues2.filter(
          (item, j) => i !== item
        ),
      });
    } else {
      this.state.checkedValues2.push(i);
      this.setState({
        checkedValues2: this.state.checkedValues2,
      });
    }
  };

  renderShowSuggestion = () => {
    let suggestionArray = [];
    console.log(this.state.tag);
    if (this.state.tag) {
      console.log(this.state.tag);
      const suggestionByName = this.props.tags.filter((tagName) =>
        tagName.name.toLowerCase().includes(this.state.tag.toLowerCase())
      );

      suggestionArray = [...suggestionByName];
      const uniqueTags = [...new Set(suggestionArray)];
      console.log(suggestionArray);
      return uniqueTags.slice(0, 10).map((tagName, index) => (
        <li
          key={tagName.id}
          style={{
            minWidth: "195px",
            backgroundColor: this.state.cursor == index ? "gainsboro" : "white",
          }}
          onClick={() =>
            this.setState({
              tag: "",
              selectedTags: [tagName.name, ...this.state.selectedTags],
              showSuggestion: false,
            })
          }
        >
          {tagName.name}
        </li>
      ));
    }
  };

  renderShowSuggestion2 = (attribute) => {
    let suggestionArray = [];
    console.log(this.state.tag);
    if (
      this.state.attributes.find((attr) => attr.id === attribute.id).newTerms
    ) {
      const suggestionByName = attribute.terms.filter((term) =>
        term.name
          .toLowerCase()
          .includes(
            this.state.attributes
              .find((attr) => attr.id == attribute.id)
              .newTerms.toLowerCase()
          )
      );

      suggestionArray = [...suggestionByName];
      const uniqueTerms = [...new Set(suggestionArray)];
      console.log(suggestionArray);
      return uniqueTerms.slice(0, 10).map((term, index) => (
        <li
          key={term.id}
          style={{
            minWidth: "195px",
            backgroundColor:
              this.state.cursor2 == index ? "gainsboro" : "white",
          }}
          onClick={() =>
            this.setState({
              attributes: this.state.attributes.map((attr) => {
                if (attr.id == attribute.id) {
                  return {
                    ...attr,
                    newTerms: "",
                    selectedTerms: attr.selectedTerms
                      ? [...attr.selectedTerms, term]
                      : [term],
                  };
                } else {
                  return attr;
                }
              }),
              showSuggestion2: false,
            })
          }
        >
          {term.name}
        </li>
      ));
    }
  };

  getParentCategory = (category, count) => {
    const { productObj } = this.state;
    if (productObj && productObj.id == category.id) {
      return null;
    }
    return (
      <>
        <div>
          {count}
          <input
            type="checkbox"
            name={category.id}
            checked={this.state.checkedValues.includes(category.id)}
            onChange={(e) => this.selectRow(e, category.id)}
          />
          <span style={{ color: "#3C434A" }}>&nbsp; {category.name}</span>
        </div>

        {category.children &&
          category.children.length > 0 &&
          category.children.map((cat2) =>
            this.getParentCategory(cat2, count + "\u00A0 \u00A0")
          )}
      </>
    );
  };

  getParentCategory2 = (category, count) => {
    const { productObj } = this.state;
    if (productObj && productObj.id == category.id) {
      return null;
    }
    return (
      <>
        <option value={category.id}>{count + category.name}</option>

        {category.children &&
          category.children.length > 0 &&
          category.children.map((cat2) =>
            this.getParentCategory2(cat2, count + "\u00A0 \u00A0")
          )}
      </>
    );
  };
  getParentBrand2 = (brand, count) => {
    const { productObj } = this.state;
    if (productObj && productObj.id == brand.id) {
      return null;
    }
    return (
      <>
        <option value={brand.id}>{count + brand.name}</option>

        {brand.children &&
          brand.children.length > 0 &&
          brand.children.map((cat2) =>
            this.getParentBrand2(cat2, count + "\u00A0 \u00A0")
          )}
      </>
    );
  };

  getParentBrand = (brand, count) => {
    const { productObj } = this.state;
    if (productObj && productObj.id == brand.id) {
      return null;
    }
    return (
      <>
        <div>
          {count}
          <input
            type="checkbox"
            name={brand.id}
            checked={this.state.checkedValues2.includes(brand.id)}
            onChange={(e) => this.selectRow2(e, brand.id)}
          />
          <span style={{ color: "#3C434A" }}>&nbsp; {brand.name}</span>
        </div>

        {brand.children &&
          brand.children.length > 0 &&
          brand.children.map((brand2) =>
            this.getParentBrand(brand2, count + "\u00A0 \u00A0")
          )}
      </>
    );
  };

  getCategories = (categories) => {
    const tree = categories.reduce((t, o) => {
      Object.assign((t[o.id] = t[o.id] || {}), o);
      ((t[o.parentCategory] ??= {}).children ??= []).push(t[o.id]);
      return t;
    }, {})[""].children;
    return tree;
  };

  getBrands = (categories) => {
    const tree = categories.reduce((t, o) => {
      Object.assign((t[o.id] = t[o.id] || {}), o);
      ((t[o.parentBrand] ??= {}).children ??= []).push(t[o.id]);
      return t;
    }, {})[""].children;
    return tree;
  };

  cartesian = (args) => {
    var r = [],
      max = args.length - 1;
    let helper = (arr, i) => {
      for (var j = 0, l = args[i].length; j < l; j++) {
        var a = arr.slice(0); // clone arr
        a.push(args[i][j]);
        if (i == max) r.push(a);
        else helper(a, i + 1);
      }
    };
    helper([], 0);
    return r;
  };

  render() {
    const { categories, brands, tags } = this.props;
    const attributes2 = this.props.attributes;
    const { attributes } = this.state;

    let allCategories = [];
    if (categories.length > 0) {
      allCategories = this.getCategories(categories);
      console.log(allCategories);
    }

    let allBrands = [];
    if (brands.length > 0) {
      allBrands = this.getBrands(brands);
    }
    const displayedAttributes = attributes2.filter((attr) =>
      this.state.selectedAttributes.includes(attr.id)
    );
    console.log(this.state.selectedAttributes);
    return (
      <Fragment>
        <Breadcrumb title="Add Product" parent="Physical" />

        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="row product-adding">
                    <div
                      className="col-9"
                      style={{ backgroundColor: "#f8f8f8" }}
                    >
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          className="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            className="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <span>Product Name </span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseOne"
                            className="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div className="input-container-box">
                              <input
                                className="form-control"
                                name="name"
                                value={this.state.name}
                                type="text"
                                onChange={this.handleChange}
                                required
                                placeholder="Enter Product Name"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          className="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            className="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseTwo"
                            aria-expanded="true"
                            aria-controls="collapseTwo"
                          >
                            <span>Product Description</span>
                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseTwo"
                            className="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div className="input-container-box">
                              <CKEditor
                                editor={ClassicEditor}
                                data={this.state.description}
                                onChange={this.handleCkChange}
                                config={{
                                  simpleUpload: {
                                    uploadUrl:
                                      "https://cloudshopbd.com/image-upload",
                                  },
                                  toolbar: [
                                    "heading",
                                    "|",
                                    "bold",
                                    "italic",
                                    "blockQuote",
                                    "link",
                                    "numberedList",
                                    "bulletedList",
                                    "imageUpload",
                                    "insertTable",
                                    "tableColumn",
                                    "tableRow",
                                    "mergeTableCells",
                                    "mediaEmbed",
                                    "|",
                                    "undo",
                                    "redo",
                                  ],
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseThree"
                            aria-expanded="true"
                            aria-controls="collapseThree"
                          >
                            <span>Product Short Description</span>
                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseThree"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div className="input-container-box">
                              <CKEditor
                                editor={ClassicEditor}
                                data={this.state.shortDetails}
                                onChange={this.handleCkChange2}
                                config={{
                                  simpleUpload: {
                                    uploadUrl:
                                      "https://cloudshopbd.com/image-upload",
                                  },
                                  toolbar: [
                                    "heading",
                                    "|",
                                    "bold",
                                    "italic",
                                    "blockQuote",
                                    "link",
                                    "numberedList",
                                    "bulletedList",
                                    "imageUpload",
                                    "insertTable",
                                    "tableColumn",
                                    "tableRow",
                                    "mergeTableCells",
                                    "mediaEmbed",
                                    "|",
                                    "undo",
                                    "redo",
                                  ],
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button class="btn accordion-header-text">
                            <div>
                              Product data —{" "}
                              <span>
                                <select
                                  className="custom-select form-control"
                                  id="exampleFormControlSelect1"
                                  name="productType"
                                  value={this.state.productType}
                                  onChange={this.handleProductTypeChange}
                                  style={{ fontWeight: "bold" }}
                                >
                                  <option value={""} disabled>
                                    Product Type
                                  </option>
                                  <option value={"simpleProduct"}>
                                    Simple Product
                                  </option>
                                  <option value={"variableProduct"}>
                                    Variable Product
                                  </option>
                                </select>
                              </span>
                            </div>
                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseFour"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div className="input-container-box2">
                              <div className="row">
                                <div className="col-3 left-side">
                                  {this.state.productType ===
                                    "simpleProduct" && (
                                    <div
                                      className={`product-data-option ${
                                        this.state.productOption == "General"
                                          ? "selected-option"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        this.setState({
                                          productOption: "General",
                                        });
                                      }}
                                    >
                                      <i class="icofont-ui-settings"></i>{" "}
                                      General
                                    </div>
                                  )}
                                  <div
                                    className={`product-data-option ${
                                      this.state.productOption == "Inventory"
                                        ? "selected-option"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      this.setState({
                                        productOption: "Inventory",
                                      });
                                    }}
                                  >
                                    <i class="icofont-list"></i> Inventory
                                  </div>
                                  <div
                                    className={`product-data-option ${
                                      this.state.productOption == "Shipping"
                                        ? "selected-option"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      this.setState({
                                        productOption: "Shipping",
                                      });
                                    }}
                                  >
                                    <i class="icofont-vehicle-delivery-van"></i>{" "}
                                    Shipping
                                  </div>
                                  <div
                                    className={`product-data-option ${
                                      this.state.productOption == "Attributes"
                                        ? "selected-option"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      this.setState({
                                        productOption: "Attributes",
                                      });
                                    }}
                                  >
                                    <i class="icofont-library"></i> Attributes
                                  </div>
                                  {this.state.productType ===
                                    "variableProduct" && (
                                    <div
                                      className={`product-data-option ${
                                        this.state.productOption == "Variations"
                                          ? "selected-option"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        this.setState({
                                          productOption: "Variations",
                                        });
                                      }}
                                    >
                                      <i class="icofont-layout"></i> Variations
                                    </div>
                                  )}
                                  <div
                                    className={`product-data-option ${
                                      this.state.productOption == "Advanced"
                                        ? "selected-option"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      this.setState({
                                        productOption: "Advanced",
                                      });
                                    }}
                                  >
                                    <i class="icofont-settings"></i> Advanced
                                  </div>
                                  <div
                                    className={`product-data-option ${
                                      this.state.productOption ==
                                      "Linked Products"
                                        ? "selected-option"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      this.setState({
                                        productOption: "Linked Products",
                                      });
                                    }}
                                  >
                                    <i class="icofont-link"></i> Linked Products
                                  </div>
                                </div>
                                {this.state.productOption == "General" && (
                                  <div className="col-9 right-side">
                                    <div
                                      className="form"
                                      style={{ marginTop: 25 }}
                                    >
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Regular Price (৳ )
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            className="form-control mb-0"
                                            name="price"
                                            value={this.state.price}
                                            type="number"
                                            onChange={this.handleChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Sale Price (৳ )
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            className="form-control mb-0"
                                            name="salePrice"
                                            value={this.state.salePrice}
                                            type="number"
                                            onChange={this.handleChange}
                                            required
                                          />
                                          <div
                                            style={{
                                              marginTop: 5,
                                              color: "#2271b1",
                                              textDecoration: "underline",
                                              textDecorationColor: "#2271b1",
                                              fontSize: 13,
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              this.setState({
                                                schedule: !this.state.schedule,
                                              });
                                            }}
                                          >
                                            {this.state.schedule
                                              ? "Cancel"
                                              : "Schedule"}
                                          </div>
                                        </div>
                                      </div>
                                      {this.state.schedule && (
                                        <>
                                          <div className="form-group mb-3 row">
                                            <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                              Sale Price Dates
                                            </label>
                                            <div className="col-xl-6 col-sm-7">
                                              <div className="row">
                                                <div>Form</div>
                                                <input
                                                  className="form-control mb-0"
                                                  name="startDate"
                                                  value={this.state.startDate}
                                                  type="date"
                                                  onChange={this.handleChange}
                                                  required
                                                  placeholder="form Date"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="form-group mb-3 row">
                                            <label className="col-xl-3 col-sm-4 mb-0 label-font"></label>
                                            <div className="col-xl-6 col-sm-7">
                                              <div
                                                className="row"
                                                style={{ marginTop: "-10px" }}
                                              >
                                                <div>To</div>
                                                <input
                                                  className="form-control mb-0"
                                                  name="endDate"
                                                  value={this.state.endDate}
                                                  type="date"
                                                  onChange={this.handleChange}
                                                  required
                                                  placeholder="to Date"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {this.state.productOption == "Inventory" && (
                                  <div className="col-9 right-side">
                                    <div
                                      className="form"
                                      style={{ marginTop: 25 }}
                                    >
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          SKU
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            className="form-control mb-0"
                                            name="skuId"
                                            value={this.state.skuId}
                                            type="text"
                                            onChange={this.handleChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Manage stock?
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            type="checkbox"
                                            name="manageStock"
                                            checked={this.state.manageStock}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                this.setState({
                                                  manageStock: true,
                                                });
                                              } else {
                                                this.setState({
                                                  manageStock: false,
                                                });
                                              }
                                            }}
                                          />{" "}
                                          <span style={{ color: "gray" }}>
                                            Manage stock level quantity
                                          </span>
                                        </div>
                                      </div>
                                      {!this.state.manageStock && (
                                        <div className="form-group mb-3 row">
                                          <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                            Stock status
                                          </label>
                                          <div className="col-xl-6 col-sm-7">
                                            <select
                                              className="custom-select form-control"
                                              id="exampleFormControlSelect1"
                                              name="stockStatus"
                                              value={this.state.stockStatus}
                                              onChange={this.handleChange}
                                            >
                                              <option value={"In stock"}>
                                                In stock
                                              </option>
                                              <option value={"Out of stock"}>
                                                Out of stock
                                              </option>
                                              <option value={"On backorder"}>
                                                On backorder
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                      )}
                                      {this.state.manageStock && (
                                        <>
                                          <div className="form-group mb-3 row">
                                            <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                              Stock Quantity
                                            </label>
                                            <div className="col-xl-6 col-sm-7">
                                              <input
                                                className="form-control mb-0"
                                                name="stockQuantity"
                                                value={this.state.stockQuantity}
                                                type="number"
                                                onChange={this.handleChange}
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="form-group mb-3 row">
                                            <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                              Allow backorders?
                                            </label>
                                            <div className="col-xl-6 col-sm-7">
                                              <select
                                                className="custom-select form-control"
                                                id="exampleFormControlSelect1"
                                                name="backOrders"
                                                value={this.state.backOrders}
                                                onChange={this.handleChange}
                                              >
                                                <option value={"Do not allow"}>
                                                  Do not allow
                                                </option>
                                                <option
                                                  value={
                                                    "Allow, but notify customer"
                                                  }
                                                >
                                                  Allow, but notify customer
                                                </option>
                                                <option value={"Allow"}>
                                                  Allow
                                                </option>
                                              </select>
                                            </div>
                                          </div>
                                          <div className="form-group mb-3 row">
                                            <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                              Low stock Alert
                                            </label>
                                            <div className="col-xl-6 col-sm-7">
                                              <input
                                                className="form-control mb-0"
                                                name="lowStockAlert"
                                                value={this.state.lowStockAlert}
                                                type="number"
                                                onChange={this.handleChange}
                                                required
                                              />
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      <div
                                        className="form-group mb-3 row"
                                        style={{
                                          borderTop: "1px solid gainsboro",
                                          paddingTop: 20,
                                        }}
                                      >
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Sold Individually
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            type="checkbox"
                                            name="soldIndividually"
                                            checked={
                                              this.state.soldIndividually
                                            }
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                this.setState({
                                                  soldIndividually: true,
                                                });
                                              } else {
                                                this.setState({
                                                  soldIndividually: false,
                                                });
                                              }
                                            }}
                                          />{" "}
                                          <span style={{ color: "gray" }}>
                                            Limit purchases to 1 item per order
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {this.state.productOption == "Shipping" && (
                                  <div className="col-9 right-side">
                                    <div
                                      className="form"
                                      style={{ marginTop: 25 }}
                                    >
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Weight (kg)
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            className="form-control mb-0"
                                            name="weight"
                                            value={this.state.weight}
                                            type="text"
                                            onChange={this.handleChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Dimensions (in)
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <div className="row">
                                            <div className="col">
                                              <input
                                                className="form-control mb-0"
                                                name="length"
                                                value={this.state.length}
                                                type="text"
                                                onChange={this.handleChange}
                                                required
                                                placeholder="Length"
                                              />
                                            </div>
                                            <div className="col">
                                              <input
                                                className="form-control mb-0"
                                                name="width"
                                                value={this.state.width}
                                                type="text"
                                                onChange={this.handleChange}
                                                required
                                                placeholder="Width"
                                              />
                                            </div>
                                            <div className="col">
                                              <input
                                                className="form-control mb-0"
                                                name="height"
                                                value={this.state.height}
                                                type="text"
                                                onChange={this.handleChange}
                                                required
                                                placeholder="Height"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className="form-group mb-3 row"
                                        style={{
                                          borderTop: "1px solid gainsboro",
                                          paddingTop: 20,
                                        }}
                                      >
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Shipping class
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <select
                                            className="custom-select form-control"
                                            id="exampleFormControlSelect1"
                                            name="shippingClass"
                                            value={this.state.shippingClass}
                                            onChange={this.handleChange}
                                          >
                                            <option value={""}>
                                              No shipping class
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {this.state.productOption ==
                                  "Linked Products" && (
                                  <div className="col-9 right-side">
                                    <div
                                      className="form"
                                      style={{ marginTop: 25 }}
                                    >
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Upsells
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            className="form-control mb-0"
                                            name="upSells"
                                            value={this.state.upSells}
                                            type="text"
                                            onChange={this.handleChange}
                                            required
                                            placeholder="search for a product"
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Cross-sells
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            className="form-control mb-0"
                                            name="crossSells"
                                            value={this.state.crossSells}
                                            type="text"
                                            onChange={this.handleChange}
                                            required
                                            placeholder="search for a product"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {this.state.productOption == "Advanced" && (
                                  <div className="col-9 right-side">
                                    <div
                                      className="form"
                                      style={{ marginTop: 25 }}
                                    >
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Purchase note
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <textarea
                                            className="form-control mb-0"
                                            name="purchaseNote"
                                            value={this.state.purchaseNote}
                                            type="text"
                                            onChange={this.handleChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group mb-3 row">
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Menu Order
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            className="form-control mb-0"
                                            name="menuOrder"
                                            value={this.state.menuOrder}
                                            type="text"
                                            onChange={this.handleChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div
                                        className="form-group mb-3 row"
                                        style={{
                                          borderTop: "1px solid gainsboro",
                                          paddingTop: 20,
                                        }}
                                      >
                                        <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                          Enable reviews
                                        </label>
                                        <div className="col-xl-6 col-sm-7">
                                          <input
                                            type="checkbox"
                                            name="enableReveiws"
                                            checked={this.state.enableReveiws}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                this.setState({
                                                  enableReveiws: true,
                                                });
                                              } else {
                                                this.setState({
                                                  enableReveiws: false,
                                                });
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {this.state.productOption == "Attributes" && (
                                  <div className="col-9 right-side">
                                    <div
                                      className="row"
                                      style={{
                                        marginTop: 10,
                                        paddingBottom: 10,
                                        borderBottom: "1px solid gainsboro",
                                      }}
                                    >
                                      <div className="col-xl-4 col-sm-4 mb-0">
                                        <select
                                          className="custom-select form-control"
                                          id="exampleFormControlSelect1"
                                          name="attribute"
                                          value={this.state.attribute}
                                          onChange={this.handleAttributesChange}
                                          style={{
                                            maxHeight: 35,
                                            margin: "auto 0px",
                                          }}
                                        >
                                          <option value={""}>
                                            Add existing
                                          </option>
                                          {attributes.length > 0 &&
                                            attributes
                                              .filter((attr1) => attr1.name)
                                              .map((attr) => (
                                                <option
                                                  value={attr.id}
                                                  disabled={
                                                    this.state.selectedAttributes.includes(
                                                      attr.id
                                                    )
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  {attr.name}
                                                </option>
                                              ))}
                                        </select>
                                      </div>
                                      <button
                                        className="white-bg-blue"
                                        onClick={async () => {
                                          let id = new Date()
                                            .getTime()
                                            .toString();
                                          this.setState({
                                            selectedAttributes: [
                                              ...this.state.selectedAttributes,
                                              id,
                                            ],
                                          });
                                          this.props.uploadAttributeRedux({
                                            id: id,
                                            name: "",
                                            slug: "",
                                            terms: [],
                                            count: 0,
                                          });
                                        }}
                                      >
                                        Add New
                                      </button>
                                    </div>
                                    {displayedAttributes.map((attr1) => (
                                      <div
                                        id="accordion"
                                        className="accordion theme-accordion"
                                      >
                                        <div
                                          class="card accordion-container"
                                          style={{
                                            marginTop: "20px",
                                            marginRight: 10,
                                            marginBottom: "15px",
                                          }}
                                        >
                                          <button
                                            class="btn accordion-header-text"
                                            data-toggle="collapse"
                                            data-target="#collapseSix"
                                            aria-expanded="true"
                                            aria-controls="collapseSix"
                                          >
                                            <span>
                                              {attr1.name || "New attribute"}
                                            </span>

                                            <span>
                                              <i className="icofont-rounded-up"></i>
                                              <i className="icofont-rounded-down"></i>
                                              <span
                                                style={{
                                                  color: "red",
                                                  fontSize: 12,
                                                  fontWeight: "lighter",
                                                  marginLeft: 5,
                                                }}
                                                onClick={() => {
                                                  this.setState({
                                                    selectedAttributes:
                                                      this.state.selectedAttributes.filter(
                                                        (attr) =>
                                                          attr != attr1.id
                                                      ),
                                                  });
                                                }}
                                              >
                                                Remove
                                              </span>
                                            </span>
                                          </button>
                                          <div
                                            id="collapseSix"
                                            class="collapse show"
                                            aria-labelledby="headingOne"
                                            data-parent="#accordion"
                                          >
                                            <div className="form-group mt-2 ml-1 row">
                                              <label className="col-xl-3 col-sm-4 mb-0 label-font">
                                                Name:
                                                {attr1.name ? (
                                                  <div
                                                    style={{
                                                      fontWeight: "bold",
                                                      color: "gray",
                                                    }}
                                                  >
                                                    {attr1.name}
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <input
                                                      className="form-control mb-0"
                                                      name="newAttribute"
                                                      value={
                                                        this.state.attributes.find(
                                                          (attr) =>
                                                            attr.id == attr1.id
                                                        ).name
                                                      }
                                                      type="text"
                                                      onChange={(e) => {
                                                        const { name, value } =
                                                          e.target;
                                                        this.setState({
                                                          attributes:
                                                            this.state.attributes.map(
                                                              (attr) => {
                                                                if (
                                                                  attr.id !==
                                                                  attr1.id
                                                                ) {
                                                                  return attr;
                                                                } else {
                                                                  return {
                                                                    ...attr,
                                                                    name: value,
                                                                  };
                                                                }
                                                              }
                                                            ),
                                                        });
                                                      }}
                                                      required
                                                      placeholder="f.e. size or color"
                                                    />
                                                  </div>
                                                )}
                                                <div
                                                  style={{
                                                    marginTop: 20,
                                                    color: "#5f5f5f",
                                                  }}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    name="enableVisibility"
                                                    checked={
                                                      this.state.attributes.find(
                                                        (attr) =>
                                                          attr.id == attr1.id
                                                      ).enableVisibility
                                                    }
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        this.setState({
                                                          attributes:
                                                            this.state.attributes.map(
                                                              (attr) => {
                                                                if (
                                                                  attr.id !==
                                                                  attr1.id
                                                                ) {
                                                                  return attr;
                                                                } else {
                                                                  return {
                                                                    ...attr,
                                                                    enableVisibility: true,
                                                                  };
                                                                }
                                                              }
                                                            ),
                                                        });
                                                      } else {
                                                        this.setState({
                                                          attributes:
                                                            this.state.attributes.map(
                                                              (attr) => {
                                                                if (
                                                                  attr.id !==
                                                                  attr1.id
                                                                ) {
                                                                  return attr;
                                                                } else {
                                                                  return {
                                                                    ...attr,
                                                                    enableVisibility: false,
                                                                  };
                                                                }
                                                              }
                                                            ),
                                                        });
                                                      }
                                                    }}
                                                  />{" "}
                                                  Visible on the product page
                                                </div>
                                                <div
                                                  style={{
                                                    marginTop: 20,
                                                    color: "#5f5f5f",
                                                  }}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    name="enableVariations"
                                                    checked={
                                                      this.state.attributes.find(
                                                        (attr) =>
                                                          attr.id == attr1.id
                                                      ).enableVariations
                                                    }
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        this.setState({
                                                          attributes:
                                                            this.state.attributes.map(
                                                              (attr) => {
                                                                if (
                                                                  attr.id !==
                                                                  attr1.id
                                                                ) {
                                                                  return attr;
                                                                } else {
                                                                  return {
                                                                    ...attr,
                                                                    enableVariations: true,
                                                                  };
                                                                }
                                                              }
                                                            ),
                                                        });
                                                      } else {
                                                        this.setState({
                                                          attributes:
                                                            this.state.attributes.map(
                                                              (attr) => {
                                                                if (
                                                                  attr.id !==
                                                                  attr1.id
                                                                ) {
                                                                  return attr;
                                                                } else {
                                                                  return {
                                                                    ...attr,
                                                                    enableVariations: false,
                                                                  };
                                                                }
                                                              }
                                                            ),
                                                        });
                                                      }
                                                    }}
                                                  />{" "}
                                                  Used for variations
                                                </div>
                                              </label>
                                              <div className="col-xl-8 col-sm-7">
                                                <div style={{ fontSize: 13 }}>
                                                  Value(s):
                                                </div>
                                                {attr1.name ? (
                                                  <>
                                                    <input
                                                      className="form-control mb-0"
                                                      name="menuOrder"
                                                      value={
                                                        this.state.attributes.find(
                                                          (attr) =>
                                                            attr.id == attr1.id
                                                        ).newTerms
                                                      }
                                                      type="text"
                                                      onChange={(e) => {
                                                        this.handleChangeTerms(
                                                          e,
                                                          attr1
                                                        );
                                                      }}
                                                      onKeyDown={(e) => {
                                                        this.handleKeyDown2(
                                                          e,
                                                          attr1
                                                        );
                                                      }}
                                                      required
                                                      placeholder="Select Terms"
                                                    />
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        flexWrap: "wrap",
                                                      }}
                                                    >
                                                      {this.state.attributes.find(
                                                        (attr) =>
                                                          attr.id === attr1.id
                                                      ).selectedTerms &&
                                                        this.state.attributes.find(
                                                          (attr) =>
                                                            attr.id === attr1.id
                                                        ).selectedTerms.length >
                                                          0 &&
                                                        this.state.attributes
                                                          .find(
                                                            (attr) =>
                                                              attr.id ===
                                                              attr1.id
                                                          )
                                                          .selectedTerms.map(
                                                            (term) => (
                                                              <div
                                                                style={{
                                                                  marginTop: 5,
                                                                  marginLeft: 4,
                                                                  padding:
                                                                    "3px 5px",
                                                                  border:
                                                                    "1px solid gainsboro",
                                                                  borderRadius: 5,
                                                                  background:
                                                                    "rgb(238 249 255)",
                                                                  fontSize: 12,
                                                                }}
                                                              >
                                                                <span
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    fontWeight:
                                                                      "bold",
                                                                    marginLeft:
                                                                      -4,
                                                                  }}
                                                                  onClick={() => {
                                                                    this.setState(
                                                                      {
                                                                        attributes:
                                                                          this.state.attributes.map(
                                                                            (
                                                                              attr
                                                                            ) => {
                                                                              if (
                                                                                attr.id ===
                                                                                attr1.id
                                                                              ) {
                                                                                return {
                                                                                  ...attr,
                                                                                  selectedTerms:
                                                                                    this.state.attributes
                                                                                      .find(
                                                                                        (
                                                                                          attr2
                                                                                        ) =>
                                                                                          attr2.id ===
                                                                                          attr1.id
                                                                                      )
                                                                                      .selectedTerms.filter(
                                                                                        (
                                                                                          term1
                                                                                        ) =>
                                                                                          term1.id !==
                                                                                          term.id
                                                                                      ),
                                                                                };
                                                                              } else {
                                                                                return attr;
                                                                              }
                                                                            }
                                                                          ),
                                                                      }
                                                                    );
                                                                  }}
                                                                >
                                                                  <i className="icofont-close-line"></i>
                                                                </span>
                                                                {term.name}
                                                              </div>
                                                            )
                                                          )}
                                                    </div>
                                                    {this.state.attributes.find(
                                                      (attr) =>
                                                        attr.id == attr1.id
                                                    ).newTerms && (
                                                      <ul
                                                        className="below-searchbar-recommendation2"
                                                        style={{
                                                          display: this.state
                                                            .showSuggestion2
                                                            ? "flex"
                                                            : "none",
                                                        }}
                                                      >
                                                        {this.renderShowSuggestion2(
                                                          attr1
                                                        )}
                                                      </ul>
                                                    )}
                                                  </>
                                                ) : (
                                                  <textarea
                                                    className="form-control mb-0"
                                                    name="menuOrder"
                                                    value={
                                                      this.state.attributes.find(
                                                        (attr) =>
                                                          attr.id == attr1.id
                                                      ).newTerms
                                                    }
                                                    type="text"
                                                    onChange={(e) => {
                                                      const { name, value } =
                                                        e.target;
                                                      this.setState({
                                                        attributes:
                                                          this.state.attributes.map(
                                                            (attr) => {
                                                              if (
                                                                attr.id !==
                                                                attr1.id
                                                              ) {
                                                                return attr;
                                                              } else {
                                                                return {
                                                                  ...attr,
                                                                  newTerms:
                                                                    value,
                                                                };
                                                              }
                                                            }
                                                          ),
                                                      });
                                                    }}
                                                    required
                                                    placeholder={`Enter options for customers to choose from, f.e. "Blue" or "Large". Use "|" to separate different options.`}
                                                  />
                                                )}
                                                {attr1.name && (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "row",
                                                      marginTop: 5,
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <div>
                                                      <button
                                                        className="white-bg-blue"
                                                        onClick={() => {}}
                                                      >
                                                        Select all
                                                      </button>
                                                      <button
                                                        className="white-bg-blue"
                                                        onClick={() => {}}
                                                        style={{
                                                          marginLeft: 5,
                                                        }}
                                                      >
                                                        Select none
                                                      </button>
                                                    </div>
                                                    <div>
                                                      <button
                                                        className="white-bg-blue"
                                                        onClick={() => {}}
                                                      >
                                                        Add new
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="row">
                                      <button
                                        className="blue-bg-white"
                                        style={{
                                          marginLeft: 10,
                                          marginBottom: 15,
                                          marginTop: 10,
                                        }}
                                        onClick={() => {
                                          console.log(displayedAttributes);
                                          const savedAttributes =
                                            this.state.attributes.filter(
                                              (attr) =>
                                                attr.selectedTerms &&
                                                attr.selectedTerms.length > 0
                                            );
                                          if (
                                            displayedAttributes.length ==
                                            savedAttributes.length
                                          ) {
                                            console.log(savedAttributes);
                                            this.setState({
                                              savedAttributes,
                                            });
                                            toast.success("Attributes saved");
                                          } else {
                                            alert(
                                              "Please select at least one term for each attribute."
                                            );
                                          }
                                        }}
                                      >
                                        Save attributes
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {this.state.productOption == "Variations" && (
                                  <>
                                    {this.state.savedAttributes.length > 0 ? (
                                      <>
                                        {this.state.displayedVariations.length >
                                        0 ? (
                                          <div className="col-9 right-side">
                                            <>
                                              <div
                                                className="row"
                                                style={{
                                                  marginTop: 10,
                                                  paddingBottom: 10,
                                                  borderBottom:
                                                    "1px solid gainsboro",
                                                }}
                                              >
                                                <div className="col-xl-4 col-sm-4 mb-0">
                                                  <select
                                                    className="custom-select form-control"
                                                    id="exampleFormControlSelect1"
                                                    name="variations"
                                                    value={
                                                      this.state.variations
                                                    }
                                                    onChange={this.handleChange}
                                                    style={{
                                                      maxHeight: 35,
                                                      margin: "auto 0px",
                                                    }}
                                                  >
                                                    <option value={"add"}>
                                                      Add variations
                                                    </option>
                                                    <option value={"create"}>
                                                      Create variations from all
                                                      attributes
                                                    </option>
                                                    <option value={"delete"}>
                                                      Delete all variations
                                                    </option>
                                                  </select>
                                                </div>
                                                <button
                                                  className="white-bg-blue"
                                                  onClick={() => {
                                                    if (this.state.variations) {
                                                      this.setState({
                                                        selectedVariations:
                                                          this.state.selectedVariations.push(
                                                            this.state
                                                              .variations
                                                          ),
                                                      });
                                                    } else {
                                                      alert(
                                                        "Select a variation first to Add it."
                                                      );
                                                    }
                                                  }}
                                                >
                                                  Go
                                                </button>
                                              </div>

                                              <div
                                                id="accordion"
                                                className="accordion theme-accordion"
                                              >
                                                <div
                                                  class="card accordion-container"
                                                  style={{
                                                    marginTop: "20px",
                                                    marginRight: 10,
                                                    marginBottom: "15px",
                                                  }}
                                                >
                                                  <button
                                                    class="btn accordion-header-text"
                                                    data-toggle="collapse"
                                                    data-target="#collapseEight"
                                                    aria-expanded="true"
                                                    aria-controls="collapseEight"
                                                  >
                                                    <span>
                                                      #45256{" "}
                                                      <select
                                                        className="custom-select form-control"
                                                        id="exampleFormControlSelect1"
                                                        name="variations"
                                                        value={
                                                          this.state.variations
                                                        }
                                                        onChange={
                                                          this.handleChange
                                                        }
                                                        style={{
                                                          maxHeight: 35,
                                                          margin: "auto 0px",
                                                        }}
                                                      >
                                                        <option
                                                          value={
                                                            " @02 Vintage Cherry"
                                                          }
                                                        >
                                                          @02 Vintage Cherry
                                                        </option>
                                                        <option
                                                          value={
                                                            "#01 Berry & Cream"
                                                          }
                                                        >
                                                          #01 Berry & Cream
                                                        </option>
                                                        <option
                                                          value={"delete"}
                                                        >
                                                          #02 (Natural skin)
                                                        </option>
                                                      </select>
                                                    </span>

                                                    <span>
                                                      <i className="icofont-rounded-up"></i>
                                                      <i className="icofont-rounded-down"></i>
                                                      <span
                                                        style={{
                                                          color: "red",
                                                          fontSize: 12,
                                                          fontWeight: "lighter",
                                                          marginLeft: 5,
                                                        }}
                                                      >
                                                        Remove
                                                      </span>
                                                      <span
                                                        style={{
                                                          color: "#2271B1",
                                                          fontSize: 12,
                                                          fontWeight: "lighter",
                                                          marginLeft: 10,
                                                        }}
                                                      >
                                                        Edit
                                                      </span>
                                                    </span>
                                                  </button>

                                                  <div
                                                    id="collapseEight"
                                                    class="collapse show"
                                                    aria-labelledby="headingOne"
                                                    data-parent="#accordion"
                                                  >
                                                    <div
                                                      className="row"
                                                      style={{ margin: 10 }}
                                                    >
                                                      <div className="col">
                                                        <ul className="file-upload-product">
                                                          <li>
                                                            <div className="box-input-file">
                                                              <input
                                                                id="img-upload2"
                                                                className="upload"
                                                                type="file"
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                  display:
                                                                    "none",
                                                                }}
                                                                onChange={(e) =>
                                                                  this._handleImgChange(
                                                                    e,
                                                                    1
                                                                  )
                                                                }
                                                              />
                                                              <img
                                                                src={
                                                                  this.state
                                                                    .pictures[1]
                                                                }
                                                                style={{
                                                                  width: 50,
                                                                  height: 50,
                                                                  border:
                                                                    "1px solid gainsboro",
                                                                  borderRadius: 5,
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={() => {
                                                                  document
                                                                    .getElementById(
                                                                      "img-upload2"
                                                                    )
                                                                    .click();
                                                                }}
                                                              />
                                                            </div>
                                                          </li>
                                                        </ul>
                                                      </div>

                                                      <div className="col">
                                                        <label
                                                          style={{
                                                            marginBottom: 0,
                                                          }}
                                                        >
                                                          SKU
                                                        </label>

                                                        <input
                                                          className="form-control mb-0"
                                                          name="skuId"
                                                          value={
                                                            this.state.skuId
                                                          }
                                                          type="text"
                                                          onChange={
                                                            this.handleChange
                                                          }
                                                          required
                                                        />
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="row"
                                                      style={{
                                                        margin: 20,
                                                        padding: "5px",
                                                        borderTop:
                                                          "1px solid gainsboro",
                                                        borderBottom:
                                                          "1px solid gainsboro",
                                                      }}
                                                    >
                                                      <div>
                                                        <input
                                                          type="checkbox"
                                                          name="enabled"
                                                          checked={
                                                            this.state.enabled
                                                          }
                                                          onChange={(e) => {
                                                            if (
                                                              e.target.checked
                                                            ) {
                                                              this.setState({
                                                                enabled: true,
                                                              });
                                                            } else {
                                                              this.setState({
                                                                enabled: false,
                                                              });
                                                            }
                                                          }}
                                                        />{" "}
                                                        <span
                                                          style={{
                                                            color: "gray",
                                                          }}
                                                        >
                                                          Enabled
                                                        </span>
                                                      </div>
                                                      <div
                                                        style={{
                                                          marginLeft: 10,
                                                        }}
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          name="downloadable"
                                                          checked={
                                                            this.state
                                                              .downloadable
                                                          }
                                                          onChange={(e) => {
                                                            if (
                                                              e.target.checked
                                                            ) {
                                                              this.setState({
                                                                downloadable: true,
                                                              });
                                                            } else {
                                                              this.setState({
                                                                downloadable: false,
                                                              });
                                                            }
                                                          }}
                                                        />{" "}
                                                        <span
                                                          style={{
                                                            color: "gray",
                                                          }}
                                                        >
                                                          Downloadable
                                                        </span>
                                                      </div>
                                                      <div
                                                        style={{
                                                          marginLeft: 10,
                                                        }}
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          name="virtual"
                                                          checked={
                                                            this.state.virtual
                                                          }
                                                          onChange={(e) => {
                                                            if (
                                                              e.target.checked
                                                            ) {
                                                              this.setState({
                                                                virtual: true,
                                                              });
                                                            } else {
                                                              this.setState({
                                                                virtual: false,
                                                              });
                                                            }
                                                          }}
                                                        />{" "}
                                                        <span
                                                          style={{
                                                            color: "gray",
                                                          }}
                                                        >
                                                          Virtual
                                                        </span>
                                                      </div>
                                                      <div
                                                        style={{
                                                          marginLeft: 10,
                                                        }}
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          name="manageStock"
                                                          checked={
                                                            this.state
                                                              .manageStock
                                                          }
                                                          onChange={(e) => {
                                                            if (
                                                              e.target.checked
                                                            ) {
                                                              this.setState({
                                                                manageStock: true,
                                                              });
                                                            } else {
                                                              this.setState({
                                                                manageStock: false,
                                                              });
                                                            }
                                                          }}
                                                        />{" "}
                                                        <span
                                                          style={{
                                                            color: "gray",
                                                          }}
                                                        >
                                                          Manage stock?
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="row"
                                                      style={{
                                                        margin: 10,
                                                        marginTop: 20,
                                                      }}
                                                    >
                                                      <div className="col">
                                                        <div>
                                                          <label
                                                            style={{
                                                              marginBottom:
                                                                "0px",
                                                            }}
                                                          >
                                                            Regular Price (৳ )
                                                          </label>
                                                          <input
                                                            className="form-control mb-0"
                                                            name="price"
                                                            value={
                                                              this.state.price
                                                            }
                                                            type="number"
                                                            onChange={
                                                              this.handleChange
                                                            }
                                                            required
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col">
                                                        <div>
                                                          <label
                                                            style={{
                                                              marginBottom:
                                                                "0px",
                                                            }}
                                                          >
                                                            Sale Price (৳ )
                                                          </label>
                                                          <input
                                                            className="form-control mb-0"
                                                            name="salePrice"
                                                            value={
                                                              this.state
                                                                .salePrice
                                                            }
                                                            type="number"
                                                            onChange={
                                                              this.handleChange
                                                            }
                                                            required
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="row"
                                                      style={{
                                                        margin: 10,
                                                        marginTop: 20,
                                                      }}
                                                    >
                                                      <div className="col">
                                                        <label
                                                          style={{
                                                            marginBottom: "0px",
                                                          }}
                                                        >
                                                          Stock status
                                                        </label>
                                                        <div>
                                                          <select
                                                            className="custom-select form-control"
                                                            id="exampleFormControlSelect1"
                                                            name="stockStatus"
                                                            value={
                                                              this.state
                                                                .stockStatus
                                                            }
                                                            onChange={
                                                              this.handleChange
                                                            }
                                                          >
                                                            <option
                                                              value={"In stock"}
                                                            >
                                                              In stock
                                                            </option>
                                                            <option
                                                              value={
                                                                "Out of stock"
                                                              }
                                                            >
                                                              Out of stock
                                                            </option>
                                                            <option
                                                              value={
                                                                "On backorder"
                                                              }
                                                            >
                                                              On backorder
                                                            </option>
                                                          </select>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="row"
                                                      style={{
                                                        margin: 10,
                                                        marginTop: 20,
                                                      }}
                                                    >
                                                      <div className="col">
                                                        <label
                                                          style={{
                                                            marginBottom: "0px",
                                                          }}
                                                        >
                                                          Weight (kg)
                                                        </label>

                                                        <input
                                                          className="form-control mb-0"
                                                          name="weight"
                                                          value={
                                                            this.state.weight
                                                          }
                                                          type="text"
                                                          onChange={
                                                            this.handleChange
                                                          }
                                                          required
                                                        />
                                                      </div>
                                                      <div className="col">
                                                        <label
                                                          style={{
                                                            marginBottom: "0px",
                                                          }}
                                                        >
                                                          Dimensions (L×W×H)
                                                          (in)
                                                        </label>

                                                        <div className="row">
                                                          <div className="col">
                                                            <input
                                                              className="form-control mb-0"
                                                              name="length"
                                                              value={
                                                                this.state
                                                                  .length
                                                              }
                                                              type="text"
                                                              onChange={
                                                                this
                                                                  .handleChange
                                                              }
                                                              required
                                                              placeholder="Length"
                                                            />
                                                          </div>
                                                          <div className="col">
                                                            <input
                                                              className="form-control mb-0"
                                                              name="width"
                                                              value={
                                                                this.state.width
                                                              }
                                                              type="text"
                                                              onChange={
                                                                this
                                                                  .handleChange
                                                              }
                                                              required
                                                              placeholder="Width"
                                                            />
                                                          </div>
                                                          <div className="col">
                                                            <input
                                                              className="form-control mb-0"
                                                              name="height"
                                                              value={
                                                                this.state
                                                                  .height
                                                              }
                                                              type="text"
                                                              onChange={
                                                                this
                                                                  .handleChange
                                                              }
                                                              required
                                                              placeholder="Height"
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="row"
                                                      style={{
                                                        margin: 10,
                                                        marginTop: 20,
                                                      }}
                                                    >
                                                      <div className="col">
                                                        <label
                                                          style={{
                                                            marginBottom: 0,
                                                          }}
                                                        >
                                                          Shipping class
                                                        </label>

                                                        <select
                                                          className="custom-select form-control"
                                                          id="exampleFormControlSelect1"
                                                          name="shippingClass"
                                                          value={
                                                            this.state
                                                              .shippingClass
                                                          }
                                                          onChange={
                                                            this.handleChange
                                                          }
                                                        >
                                                          <option value={""}>
                                                            No shipping class
                                                          </option>
                                                        </select>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="row"
                                                      style={{
                                                        margin: 10,
                                                        marginTop: 20,
                                                        marginBottom: 20,
                                                      }}
                                                    >
                                                      <div className="col">
                                                        <label
                                                          style={{
                                                            marginBottom: 0,
                                                          }}
                                                        >
                                                          Description
                                                        </label>
                                                        <textarea
                                                          className="form-control mb-0"
                                                          name="description"
                                                          value={
                                                            this.state
                                                              .description
                                                          }
                                                          type="text"
                                                          onChange={
                                                            this.handleChange
                                                          }
                                                          required
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="row">
                                                <button
                                                  className="blue-bg-white"
                                                  style={{
                                                    marginLeft: 10,
                                                    marginBottom: 15,
                                                  }}
                                                >
                                                  Save Changes
                                                </button>
                                                <button
                                                  className="white-bg-blue"
                                                  style={{
                                                    marginLeft: 10,
                                                    marginBottom: 15,
                                                  }}
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </>
                                          </div>
                                        ) : (
                                          <div className="col-9 right-side">
                                            <div
                                              className="row"
                                              style={{
                                                marginTop: 10,
                                                paddingBottom: 10,
                                                borderBottom:
                                                  "1px solid gainsboro",
                                              }}
                                            >
                                              <button
                                                className="white-bg-blue"
                                                style={{ marginLeft: 10 }}
                                                onClick={() => {
                                                  console.log(
                                                    this.state.savedAttributes
                                                  );
                                                  const allTerms = [];
                                                  const variationCombination =
                                                    this.state.savedAttributes.map(
                                                      (attr) => {
                                                        allTerms.push(
                                                          attr.selectedTerms
                                                        );
                                                      }
                                                    );
                                                  console.log(allTerms);
                                                  let combination =
                                                    this.cartesian(allTerms);
                                                  console.log(combination);

                                                  this.setState({
                                                    displayedVariations:
                                                      variationCombination,
                                                  });
                                                }}
                                              >
                                                Generate variations
                                              </button>

                                              <button
                                                className="white-bg-blue"
                                                style={{ marginLeft: 10 }}
                                                onClick={() => {
                                                  if (this.state.variations) {
                                                    this.setState({
                                                      selectedVariations:
                                                        this.state.selectedVariations.push(
                                                          this.state.variations
                                                        ),
                                                    });
                                                  } else {
                                                    alert(
                                                      "Select a variation first to Add it."
                                                    );
                                                  }
                                                }}
                                              >
                                                Add manually
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div
                                        className="col-9 right-side"
                                        style={{
                                          textAlign: "center",
                                          margin: "auto",
                                          color: "gray",
                                        }}
                                      >
                                        Add some attributes in the{" "}
                                        <span
                                          style={{
                                            color: "#2271B1",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            this.setState({
                                              productOption: "Attributes",
                                            });
                                          }}
                                        >
                                          Attributes&nbsp;
                                        </span>
                                        tab to generate variations. Make sure to
                                        check the Used for variations box.
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-3"
                      style={{ backgroundColor: "#f8f8f8" }}
                    >
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseNine"
                            aria-expanded="true"
                            aria-controls="collapseNine"
                          >
                            <span>Product Video </span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseNine"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div className="input-container-box">
                              <input
                                className="form-control"
                                name="videoUrl"
                                value={this.state.videoUrl}
                                type="text"
                                onChange={this.handleChange}
                                required
                                placeholder="Enter video url"
                              />
                            </div>
                            <div style={{ padding: 10, color: "gray" }}>
                              Enter your embed video url
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseSixteen"
                            aria-expanded="true"
                            aria-controls="collapseSixteen"
                          >
                            <span>Publish </span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseSixteen"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div style={{ padding: "5px 10px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <span>
                                  <i
                                    className="icofont-pencil"
                                    style={{ fontWeight: "bold" }}
                                  ></i>
                                </span>
                                &nbsp;Status:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  &nbsp; {this.state.published}
                                </span>{" "}
                                {!this.state.editPublished && (
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      color: "#ff8084",
                                      marginLeft: 5,
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        editPublished:
                                          !this.state.editPublished,
                                      });
                                    }}
                                  >
                                    Edit
                                  </span>
                                )}
                              </div>
                              {this.state.editPublished && (
                                <div>
                                  <div style={{ margin: "10px 0px" }}>
                                    <select
                                      title="Please choose a package"
                                      required
                                      name="published"
                                      className="custom-select"
                                      aria-required="true"
                                      aria-invalid="false"
                                      onChange={this.handleChange}
                                      value={this.state.published}
                                      style={{
                                        color: "#495057",
                                        fontWeight: "lighter",
                                      }}
                                    >
                                      <option value="Published">
                                        Published
                                      </option>
                                      <option value="Pending Review">
                                        Pending Review
                                      </option>
                                      <option value="Draft">Draft</option>
                                    </select>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <button
                                      className="white-bg-red"
                                      onClick={() => {
                                        this.setState({
                                          editPublished: false,
                                        });
                                      }}
                                    >
                                      OK
                                    </button>
                                    <button
                                      className="blue-bg-white"
                                      style={{ marginLeft: 5 }}
                                      onClick={() => {
                                        this.setState({
                                          editPublished: false,
                                        });
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div style={{ padding: "5px 10px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <span>
                                  <i className="icofont-eye-open"></i>
                                </span>
                                &nbsp;Visibility:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  &nbsp; {this.state.visibility}
                                </span>{" "}
                                {!this.state.editVisibility && (
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      color: "#ff8084",
                                      marginLeft: 5,
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        editVisibility:
                                          !this.state.editVisibility,
                                      });
                                    }}
                                  >
                                    Edit
                                  </span>
                                )}
                              </div>
                              {this.state.editVisibility && (
                                <div>
                                  <div style={{ margin: "10px 0px" }}>
                                    <select
                                      title="Please choose a package"
                                      required
                                      name="visibility"
                                      className="custom-select"
                                      aria-required="true"
                                      aria-invalid="false"
                                      onChange={this.handleChange}
                                      value={this.state.visibility}
                                      style={{
                                        color: "#495057",
                                        fontWeight: "lighter",
                                      }}
                                    >
                                      <option value="Public">Public</option>
                                      <option value="Password protected">
                                        Password protected
                                      </option>
                                      <option value="Private">Private</option>
                                    </select>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <button
                                      className="white-bg-red"
                                      onClick={() => {
                                        this.setState({
                                          editVisibility: false,
                                        });
                                      }}
                                    >
                                      OK
                                    </button>
                                    <button
                                      className="blue-bg-white"
                                      style={{ marginLeft: 5 }}
                                      onClick={() => {
                                        this.setState({
                                          editVisibility: false,
                                        });
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div style={{ padding: "5px 10px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <span>
                                  <i className="icofont-calendar"></i>
                                </span>
                                &nbsp;Published on:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  &nbsp; immediately
                                </span>{" "}
                              </div>
                            </div>
                            <div style={{ borderTop: "1px solid gainsboro" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                  padding: "7px 10px",
                                  backgroundColor: "#f7f7f7",
                                }}
                              >
                                <button
                                  className="blue-bg-white"
                                  style={{ marginLeft: 5, padding: "7px" }}
                                  onClick={() => this.handleFormSubmit()}
                                >
                                  Publish
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseTen"
                            aria-expanded="true"
                            aria-controls="collapseTen"
                          >
                            <span>Assign product is New </span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseTen"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div style={{ padding: 10 }}>
                              <input
                                type="checkbox"
                                name="new"
                                checked={this.state.new}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    this.setState({
                                      new: true,
                                    });
                                  } else {
                                    this.setState({
                                      new: false,
                                    });
                                  }
                                }}
                              />{" "}
                              <span style={{ color: "gray" }}>
                                Is New Product.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseEleven"
                            aria-expanded="true"
                            aria-controls="collapseEleven"
                          >
                            <span>Product Image</span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseEleven"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div style={{ padding: 20 }}>
                              <div
                                className="box-input-file"
                                style={{ cursor: "pointer" }}
                              >
                                <input
                                  className="upload"
                                  id="img-upload"
                                  type="file"
                                  onChange={(e) => this._handleImgChange(e, 0)}
                                  style={{
                                    position: "absolute",
                                    display: "none",
                                  }}
                                />
                                <img
                                  src={this.state.pictures[0]}
                                  alt="product"
                                  className="img-fluid image_zoom_1 blur-up lazyloaded"
                                  style={{
                                    border: "1px solid gainsboro",
                                    borderRadius: 5,
                                  }}
                                  onClick={() => {
                                    window.document
                                      .getElementById("img-upload")
                                      .click();
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseTwelve"
                            aria-expanded="true"
                            aria-controls="collapseTwelve"
                          >
                            <span>Product gallery</span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseTwelve"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div style={{ padding: 20 }}>
                              <ul className="file-upload-product">
                                {this.state.pictures
                                  .filter((res, i) => i !== 0)
                                  .map((res, i) => {
                                    return (
                                      <li key={i}>
                                        <div className="box-input-file">
                                          <input
                                            className="upload"
                                            type="file"
                                            onChange={(e) =>
                                              this._handleImgChange(e, i + 1)
                                            }
                                          />
                                          <img
                                            src={res}
                                            style={{
                                              width: 50,
                                              height: 50,
                                              border: "1px solid gainsboro",
                                              borderRadius: 5,
                                            }}
                                          />
                                        </div>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseThirteen"
                            aria-expanded="true"
                            aria-controls="collapseThirteen"
                          >
                            <span>Product categories</span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseThirteen"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div style={{ padding: 10 }}>
                              <Tabs>
                                <TabList
                                  className="nav nav-tabs tab-coupon"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Tab
                                    className="nav-link"
                                    onClick={(e) => this.clickActive(e)}
                                    style={{ fontSize: 12 }}
                                  >
                                    All categories
                                  </Tab>

                                  <Tab
                                    className="nav-link"
                                    onClick={(e) => this.clickActive(e)}
                                    style={{ fontSize: 12 }}
                                  >
                                    Most used
                                  </Tab>
                                </TabList>
                                <TabPanel>
                                  <div
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "scroll",
                                    }}
                                  >
                                    {allCategories.map((category) =>
                                      this.getParentCategory(category, "")
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                      color: "#ff8084",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        addCategory: !this.state.addCategory,
                                      });
                                    }}
                                  >
                                    + Add new category
                                  </div>
                                  {this.state.addCategory && (
                                    <div>
                                      <div>
                                        <input
                                          className="form-control"
                                          name="categoryName"
                                          value={this.state.categoryName}
                                          type="text"
                                          onChange={this.handleChange}
                                          required
                                          placeholder="Enter category Name"
                                        />
                                      </div>
                                      <div style={{ margin: "10px 0px" }}>
                                        <select
                                          title="Please choose a package"
                                          required
                                          name="parentCategory"
                                          className="custom-select"
                                          aria-required="true"
                                          aria-invalid="false"
                                          onChange={this.handleChange}
                                          value={this.state.parentCategory}
                                          style={{
                                            color: "#495057",
                                            fontWeight: "lighter",
                                          }}
                                        >
                                          <option value="">
                                            {" "}
                                            — parent category —{" "}
                                          </option>
                                          {allCategories.map((category) =>
                                            this.getParentCategory2(
                                              category,
                                              ""
                                            )
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <button className="white-bg-red">
                                          Add new category
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </TabPanel>
                                <TabPanel>
                                  <div
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "scroll",
                                    }}
                                  >
                                    {allCategories.map((category) =>
                                      this.getParentCategory(category, "")
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                      color: "#ff8084",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        addCategory: !this.state.addCategory,
                                      });
                                    }}
                                  >
                                    + Add new category
                                  </div>
                                  {this.state.addCategory && (
                                    <div>
                                      <div>
                                        <input
                                          className="form-control"
                                          name="categoryName"
                                          value={this.state.categoryName}
                                          type="text"
                                          onChange={this.handleChange}
                                          required
                                          placeholder="Enter category Name"
                                        />
                                      </div>
                                      <div style={{ margin: "10px 0px" }}>
                                        <select
                                          title="Please choose a package"
                                          required
                                          name="parentCategory"
                                          className="custom-select"
                                          aria-required="true"
                                          aria-invalid="false"
                                          onChange={this.handleChange}
                                          value={this.state.parentCategory}
                                          style={{
                                            color: "#495057",
                                            fontWeight: "lighter",
                                          }}
                                        >
                                          <option value="">
                                            {" "}
                                            — parent category —{" "}
                                          </option>
                                          {allCategories.map((category) =>
                                            this.getParentCategory2(
                                              category,
                                              ""
                                            )
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <button className="white-bg-red">
                                          Add new category
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </TabPanel>
                              </Tabs>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseFourteen"
                            aria-expanded="true"
                            aria-controls="collapseFourteen"
                          >
                            <span>Product Tags </span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseFourteen"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                            style={{ padding: 10 }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <input
                                className="form-control"
                                name="tag"
                                value={this.state.tag}
                                type="text"
                                onChange={this.handleChangeTag}
                                required
                                placeholder="Product tags"
                                onKeyDown={this.handleKeyDown}
                              />
                              <button
                                className="white-bg-red"
                                style={{ marginLeft: 5 }}
                              >
                                Add
                              </button>
                            </div>
                            {this.state.tag && (
                              <ul
                                className="below-searchbar-recommendation"
                                style={{
                                  display: this.state.showSuggestion
                                    ? "flex"
                                    : "none",
                                }}
                              >
                                {this.renderShowSuggestion()}
                              </ul>
                            )}
                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                              {this.state.selectedTags.map((tag) => {
                                return (
                                  <div style={{ padding: "3px 0px" }}>
                                    <i
                                      class="icofont-close-circled"
                                      style={{
                                        color: "#ff8084",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        this.setState({
                                          selectedTags:
                                            this.state.selectedTags.filter(
                                              (tagName) => tagName != tag
                                            ),
                                        });
                                      }}
                                    ></i>
                                    &nbsp;
                                    {tag}
                                  </div>
                                );
                              })}
                            </div>
                            <div
                              style={{
                                color: "#ff8084",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                this.setState({
                                  mostUsedTags: !this.state.mostUsedTags,
                                });
                              }}
                            >
                              choose from the most used tags
                            </div>
                            {this.state.mostUsedTags && (
                              <div
                                style={{
                                  padding: 10,
                                  border: "1px solid gainsboro",
                                  marginTop: 5,
                                }}
                              >
                                {this.props.tags.map((tag) => {
                                  return (
                                    <span
                                      style={{
                                        color: "#ff8084",
                                        textDecoration: "underline",
                                        marginLeft: 10,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        this.setState({
                                          selectedTags: [
                                            tag.name,
                                            ...this.state.selectedTags,
                                          ],
                                        });
                                      }}
                                    >
                                      {tag.name}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div id="accordion" className="accordion theme-accordion">
                        <div
                          class="card accordion-container"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            class="btn accordion-header-text"
                            data-toggle="collapse"
                            data-target="#collapseFifteen"
                            aria-expanded="true"
                            aria-controls="collapseFifteen"
                          >
                            <span>Brands</span>

                            <span>
                              <i className="icofont-rounded-up"></i>
                              <i className="icofont-rounded-down"></i>
                            </span>
                          </button>

                          <div
                            id="collapseFifteen"
                            class="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div style={{ padding: 10 }}>
                              <Tabs>
                                <TabList
                                  className="nav nav-tabs tab-coupon"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Tab
                                    className="nav-link nav-link2"
                                    onClick={(e) => this.clickActive2(e)}
                                    style={{ fontSize: 12 }}
                                  >
                                    All Brands
                                  </Tab>

                                  <Tab
                                    className="nav-link nav-link2"
                                    onClick={(e) => this.clickActive2(e)}
                                    style={{ fontSize: 12 }}
                                  >
                                    Most used
                                  </Tab>
                                </TabList>
                                <TabPanel>
                                  <div
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "scroll",
                                    }}
                                  >
                                    {allBrands.map((brand) =>
                                      this.getParentBrand(brand, "")
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                      color: "#ff8084",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        addBrand: !this.state.addBrand,
                                      });
                                    }}
                                  >
                                    + Add new Brand
                                  </div>
                                  {this.state.addBrand && (
                                    <div>
                                      <div>
                                        <input
                                          className="form-control"
                                          name="brandName"
                                          value={this.state.brandName}
                                          type="text"
                                          onChange={this.handleChange}
                                          required
                                          placeholder="Enter brand Name"
                                        />
                                      </div>
                                      <div style={{ margin: "10px 0px" }}>
                                        <select
                                          title="Please choose a package"
                                          required
                                          name="parentBrand"
                                          className="custom-select"
                                          aria-required="true"
                                          aria-invalid="false"
                                          onChange={this.handleChange}
                                          value={this.state.parentBrand}
                                          style={{
                                            color: "#495057",
                                            fontWeight: "lighter",
                                          }}
                                        >
                                          <option value="">
                                            {" "}
                                            — parent brand —{" "}
                                          </option>
                                          {allBrands.map((brand) =>
                                            this.getParentBrand2(brand, "")
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <button className="white-bg-red">
                                          Add new Brand
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </TabPanel>
                                <TabPanel>
                                  <div
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "scroll",
                                    }}
                                  >
                                    {allBrands.map((brand) =>
                                      this.getParentBrand(brand, "")
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                      color: "#ff8084",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        addBrand: !this.state.addBrand,
                                      });
                                    }}
                                  >
                                    + Add new Brand
                                  </div>
                                  {this.state.addBrand && (
                                    <div>
                                      <div>
                                        <input
                                          className="form-control"
                                          name="brandName"
                                          value={this.state.brandName}
                                          type="text"
                                          onChange={this.handleChange}
                                          required
                                          placeholder="Enter brand Name"
                                        />
                                      </div>
                                      <div style={{ margin: "10px 0px" }}>
                                        <select
                                          title="Please choose a package"
                                          required
                                          name="parentBrand"
                                          className="custom-select"
                                          aria-required="true"
                                          aria-invalid="false"
                                          onChange={this.handleChange}
                                          value={this.state.parentBrand}
                                          style={{
                                            color: "#495057",
                                            fontWeight: "lighter",
                                          }}
                                        >
                                          <option value="">
                                            {" "}
                                            — parent brand —{" "}
                                          </option>
                                          {allBrands.map((brand) =>
                                            this.getParentBrand2(brand, "")
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <button className="white-bg-red">
                                          Add new Brand
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </TabPanel>
                              </Tabs>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    attributes: state.attributes.attributes,
    categories: state.categories.categories,
    brands: state.brands.brands,
    tags: state.tags.tags,
  };
};
export default connect(mapStateToProps, {
  getAllAttributesRedux,
  uploadAttributeRedux,
  getAllCategoriesRedux,
  getAllBrandsRedux,
  getAllTagsRedux,
})(Add_product);
