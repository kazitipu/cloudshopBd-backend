import {
  getAllProductRequests,
  getAllShipmentRequests,
  getAllUsers,
  updateProductRequest,
  updateShipmentRequest,
  getAllPaymentRequest,
  getAllPaymentRequestOrder,
  updatePaymentRequestStatus,
  updatePaymentRequestOrderStatus,
  makePayment,
  getCurrency,
  getAllOrders,
  getAllRooms,
  updateOrder,
  updateProduct,
  getAllProducts,
  deleteOrder,
  deleteProduct,
  readAllMessage,
  getAllBrands,
  uploadBrand,
  updateBrand,
  deleteBrand,
  getAllScreenShot,
  uploadScreenShot,
  updateScreenShot,
  deleteScreenShot,
  getAllCoupons,
  uploadCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCategories,
  getAllHomeScreenCategories,
  uploadCategory,
  updateCategory,
  deleteCategory,
  getAllBanners,
  uploadBanner,
  updateBanner,
  deleteBanner,
  getAllTags,
  uploadTag,
  updateTag,
  deleteTag,
  getAllAttributes,
  uploadAttribute,
  updateAttribute,
  deleteAttribute,
  getAllReviews,
  updateReview,
  deleteReview,
  getAllAttributeTerms,
  uploadAttributeTerm,
  updateAttributeTerm,
  deleteAttributeTerm,
  getSingleProduct,
  getAllCampaigns,
  uploadCampaign,
  updateCampaign,
  deleteCampaign,
  getAllAnnouncements,
  uploadAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getSingleOrder,
  getSingleMonthlyExpense,
  getAllMonthlyExpense,
  getAllPendingExpensesByDay,
  approveExpense,
  getAllPendingExpenses,
  deleteExpense,
  updateExpense,
  uploadExpense,
  getAllExpenses,
  getAllOffices,
  uploadOffice,
  updateOffice,
  deleteOffice,
  getSingleCashSummary,
  uploadCashIn,
  updateCashIn,
  getAllDocumentExpressRates,
  getAllEmployees,
  getAllMonthlyCashSummary,
  getAllMonthlyCashIn,
  getAllMonthly,
  getAllMonthlySalary,
  getSingleMonthlyCashSummary,
  getSingleMonthlyCashIn,
  getSingleMonthly,
  getSingleMonthlySalary,
  getSingleMonthlyLoanCashIn,
  getSingleMonthlyLoanCashOut,
  getAllPendingCashInByDay,
  getAllPendingCashIns,
  getAllLoansCashOuts,
  getAllLoansCashIns,
  getAllLoansCashOutCustomer,
  getSingleCustomerLoan,
  getAllInstallmentsCashOutCustomer,
  getAllLoansCashInCustomer,
  deleteCashIn,
  deleteEmployee,
  getAllCustomerLoans,
  getAllCustomerInstallments,
  getAllCnfs,
  uploadCnf,
  updateCnf,
  deleteCnf,
  uploadCnfBill,
  getAllMonthsCnfBill,
  getAllCnfBills,
  getAllCnfExpenses,
  getAllCnfBillsAllMonths,
  getAllCnfExpensesAllMonths,
  updateEmployee,
  updateSalary,
  uploadEmployee,
  getAllFunds,
  getAllCashIns,
  createMonth,
} from "../firebase/firebase.utils";

export const setAllOrders = (ordersArray) => ({
  type: "SET_ALL_ORDERS",
  payload: ordersArray,
});

export const appendMessagesRedux = (messages) => ({
  type: "APPEND_MESSAGES",
  payload: messages,
});

export const setAllPayments = (paymentsArray) => ({
  type: "SET_ALL_PAYMENTS",
  payload: paymentsArray,
});
export const setAllAdmins = (adminsArray) => ({
  type: "SET_ALL_ADMINS",
  payload: adminsArray,
});
export const setCurrentAdmin = (adminObj) => ({
  type: "SET_CURRENT_ADMIN",
  payload: adminObj,
});

export const setAllProducts = (productsArray) => ({
  type: "SET_ALL_PRODUCTS",
  payload: productsArray,
});

export const rechargeAdminredux = (adminIdArray, balance) => {
  return {
    type: "RECHARGE_ADMIN",
    payload: {
      adminIdArray,
      balance,
    },
  };
};

export const updateProfileImageRedux = (imgUrl) => {
  return {
    type: "UPDATE_PROFILE_IMAGE",
    payload: imgUrl,
  };
};

export const getAllUsersRedux = () => async (dispatch) => {
  const allUsers = await getAllUsers();
  dispatch({ type: "GET_ALL_USERS", payload: allUsers });
};
export const selectRoomRedux = (roomId) => async (dispatch) => {
  await readAllMessage(roomId);
  dispatch({
    type: "SELECT_ROOM",
    payload: roomId,
  });
};

export const getAllProductRequestsRedux = (status) => async (dispatch) => {
  const requestsArray = await getAllProductRequests(status);
  dispatch({ type: "GET_ALL_PRODUCT_REQUESTS", payload: requestsArray });
};

export const getAllShipmentRequestsRedux = (status) => async (dispatch) => {
  const requestsArray = await getAllShipmentRequests(status);
  dispatch({ type: "GET_ALL_SHIPMENT_REQUESTS", payload: requestsArray });
};

export const updateProductRequestRedux = (requestObj) => async (dispatch) => {
  const updatedRequest = await updateProductRequest(requestObj);
  dispatch({ type: "UPDATE_PRODUCT_REQUEST", payload: updatedRequest });
};
export const updateProductRedux = (productObj) => async (dispatch) => {
  const updatedProduct = await updateProduct(productObj);
  dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct });
};
export const deleteProductRedux = (id) => async (dispatch) => {
  await deleteProduct(id);
  dispatch({ type: "DELETE_PRODUCT", payload: id });
};
export const getAllProductsRedux = () => async (dispatch) => {
  const allProducts = await getAllProducts();
  dispatch({ type: "GET_ALL_PRODUCTS", payload: allProducts });
};
export const getSingleProductRedux = (id) => async (dispatch) => {
  const product = await getSingleProduct(id);
  dispatch({ type: "GET_SINGLE_PRODUCT", payload: product });
};
export const updateShipmentRequestRedux = (requestObj) => async (dispatch) => {
  const updatedRequest = await updateShipmentRequest(requestObj);
  dispatch({ type: "UPDATE_SHIPMENT_REQUEST", payload: updatedRequest });
};

export const getAllPaymentRequestRedux = () => async (dispatch) => {
  const paymentRequestArray = await getAllPaymentRequest();
  dispatch({ type: "GET_ALL_PAYMENT_REQUEST", payload: paymentRequestArray });
};
export const getAllPaymentRequestOrderRedux = () => async (dispatch) => {
  const paymentRequestOrderArray = await getAllPaymentRequestOrder();
  dispatch({
    type: "GET_ALL_PAYMENT_REQUEST_ORDER",
    payload: paymentRequestOrderArray,
  });
};

export const updatePaymentRequestStatusRedux =
  (paymentRequestObj) => async (dispatch) => {
    const updatedPaymentRequestObj = await updatePaymentRequestStatus(
      paymentRequestObj
    );
    dispatch({
      type: "UPDATE_PAYMENT_REQUEST_STATUS",
      payload: updatedPaymentRequestObj,
    });
  };
export const updatePaymentRequestOrderStatusRedux =
  (paymentRequestObj) => async (dispatch) => {
    const updatedPaymentRequestObj = await updatePaymentRequestOrderStatus(
      paymentRequestObj
    );
    dispatch({
      type: "UPDATE_PAYMENT_REQUEST_ORDER_STATUS",
      payload: updatedPaymentRequestObj,
    });
  };

export const makePaymentRedux =
  (total, invoicesToPay, currentUser, admin, parcelsArray, paymentMethod) =>
  async (dispatch) => {
    const updatedOrdersArray = await makePayment(
      total,
      invoicesToPay,
      currentUser,
      admin,
      parcelsArray,
      paymentMethod
    );
    dispatch({
      type: "UPDATE_MULTIPLE_ORDERS",
      payload: updatedOrdersArray,
    });
  };

export const getCurrencyRedux = () => async (dispatch) => {
  const currency = await getCurrency();
  dispatch({ type: "GET_CURRENCY_REDUX", payload: currency });
};

export const getAllOrdersRedux = (orderStatus) => async (dispatch) => {
  const ordersArray = await getAllOrders(orderStatus);
  dispatch({
    type: "GET_ALL_ORDERS",
    payload: ordersArray,
  });
};
export const getAllRoomsRedux = (rooms) => async (dispatch) => {
  // const rooms = await getAllRooms();
  dispatch({
    type: "GET_ALL_ROOMS",
    payload: rooms,
  });
};

export const updateOrderRedux = (order) => async (dispatch) => {
  const orderObj = await updateOrder(order);
  dispatch({
    type: "UPDATE_ORDER",
    payload: orderObj,
  });
};

export const getAllBrandsRedux = () => async (dispatch) => {
  const allBrands = await getAllBrands();
  dispatch({
    type: "GET_ALL_BRANDS",
    payload: allBrands,
  });
};

export const uploadBrandRedux = (brandObj) => async (dispatch) => {
  const uploadedBrandObj = await uploadBrand(brandObj);
  dispatch({
    type: "UPLOAD_BRAND",
    payload: uploadedBrandObj,
  });
};

export const updateBrandRedux = (brandObj) => async (dispatch) => {
  const updatedBrandObj = await updateBrand(brandObj);
  dispatch({
    type: "UPDATE_BRAND",
    payload: updatedBrandObj,
  });
};

export const deleteBrandRedux = (brandId, parentId) => async (dispatch) => {
  await deleteBrand(brandId, parentId);
  dispatch({
    type: "DELETE_BRAND",
    payload: { id: brandId, parentId: parentId },
  });
};
export const getAllScreenShotRedux = () => async (dispatch) => {
  const allBrands = await getAllScreenShot();
  dispatch({
    type: "GET_ALL_SCREENSHOT",
    payload: allBrands,
  });
};

export const uploadScreenShotRedux = (brandObj) => async (dispatch) => {
  const uploadedBrandObj = await uploadScreenShot(brandObj);
  dispatch({
    type: "UPLOAD_SCREENSHOT",
    payload: uploadedBrandObj,
  });
};

export const updateScreenShotRedux = (brandObj) => async (dispatch) => {
  const updatedBrandObj = await updateScreenShot(brandObj);
  dispatch({
    type: "UPDATE_SCREENSHOT",
    payload: updatedBrandObj,
  });
};

export const deleteScreenShotRedux = (brandId) => async (dispatch) => {
  await deleteScreenShot(brandId);
  dispatch({
    type: "DELETE_SCREENSHOT",
    payload: brandId,
  });
};
export const getAllCouponsRedux = () => async (dispatch) => {
  const allCoupons = await getAllCoupons();
  dispatch({
    type: "GET_ALL_COUPONS",
    payload: allCoupons,
  });
};

export const uploadCouponRedux = (couponObj) => async (dispatch) => {
  const uploadedCouponObj = await uploadCoupon(couponObj);
  dispatch({
    type: "UPLOAD_COUPON",
    payload: uploadedCouponObj,
  });
};

export const updateCouponRedux = (couponObj) => async (dispatch) => {
  const updatedCouponObj = await updateCoupon(couponObj);
  dispatch({
    type: "UPDATE_COUPON",
    payload: updatedCouponObj,
  });
};

export const deleteCouponRedux = (id) => async (dispatch) => {
  await deleteCoupon(id);
  dispatch({
    type: "DELETE_COUPON",
    payload: id,
  });
};
export const getAllCategoriesRedux = () => async (dispatch) => {
  const allCats = await getAllCategories();
  dispatch({
    type: "GET_ALL_CATEGORIES",
    payload: allCats,
  });
};
export const getAllHomeScreenCategoriesRedux = () => async (dispatch) => {
  const allCats = await getAllHomeScreenCategories();
  dispatch({
    type: "GET_ALL_HOMESCREEN_CATEGORIES",
    payload: allCats,
  });
};

export const uploadCategoryRedux =
  (categoryObj, homeCategoriesLength) => async (dispatch) => {
    const uploadedCategoryObj = await uploadCategory(
      categoryObj,
      homeCategoriesLength
    );
    dispatch({
      type: "UPLOAD_CATEGORY",
      payload: uploadedCategoryObj,
    });
  };

export const updateCategoryRedux =
  (categoryObj, homeCategoriesLength) => async (dispatch) => {
    const updatedCategoryObj = await updateCategory(
      categoryObj,
      homeCategoriesLength
    );
    dispatch({
      type: "UPDATE_CATEGORY",
      payload: updatedCategoryObj,
    });
  };

export const deleteCategoryRedux =
  (categoryObj, parentId) => async (dispatch) => {
    await deleteCategory(categoryObj, parentId);
    dispatch({
      type: "DELETE_CATEGORY",
      payload: { id: categoryObj.id, parentId: parentId },
    });
  };
export const getAllBannersRedux = () => async (dispatch) => {
  const allCats = await getAllBanners();
  dispatch({
    type: "GET_ALL_BANNERS",
    payload: allCats,
  });
};

export const uploadBannerRedux = (bannerObj) => async (dispatch) => {
  const uploadedBannerObj = await uploadBanner(bannerObj);
  dispatch({
    type: "UPLOAD_BANNER",
    payload: uploadedBannerObj,
  });
};

export const updateBannerRedux = (bannerObj) => async (dispatch) => {
  const updatedBannerObj = await updateBanner(bannerObj);
  dispatch({
    type: "UPDATE_BANNER",
    payload: updatedBannerObj,
  });
};

export const deleteBannerRedux = (bannerId) => async (dispatch) => {
  await deleteBanner(bannerId);
  dispatch({
    type: "DELETE_BANNER",
    payload: { id: bannerId },
  });
};

export const getAllTagsRedux = () => async (dispatch) => {
  const allTags = await getAllTags();
  dispatch({
    type: "GET_ALL_TAGS",
    payload: allTags,
  });
};

export const uploadTagRedux = (tagObj) => async (dispatch) => {
  const uploadedTagObj = await uploadTag(tagObj);
  dispatch({
    type: "UPLOAD_TAG",
    payload: uploadedTagObj,
  });
};

export const updateTagRedux = (tagObj) => async (dispatch) => {
  const updatedTagObj = await updateTag(tagObj);
  dispatch({
    type: "UPDATE_TAG",
    payload: updatedTagObj,
  });
};

export const deleteTagRedux = (tagId) => async (dispatch) => {
  await deleteTag(tagId);
  dispatch({
    type: "DELETE_TAG",
    payload: { id: tagId },
  });
};
export const getAllAttributesRedux = () => async (dispatch) => {
  const allAttributes = await getAllAttributes();
  dispatch({
    type: "GET_ALL_ATTRIBUTES",
    payload: allAttributes,
  });
};

export const uploadAttributeRedux = (attrObj) => async (dispatch) => {
  const uploadedAttributeObj = await uploadAttribute(attrObj);
  dispatch({
    type: "UPLOAD_ATTRIBUTE",
    payload: uploadedAttributeObj,
  });
};

export const updateAttributeRedux = (attrObj) => async (dispatch) => {
  const updatedAttrObj = await updateAttribute(attrObj);
  dispatch({
    type: "UPDATE_ATTRIBUTE",
    payload: updatedAttrObj,
  });
};

export const deleteAttributeRedux = (attrId) => async (dispatch) => {
  await deleteAttribute(attrId);
  dispatch({
    type: "DELETE_ATTRIBUTE",
    payload: { id: attrId },
  });
};
export const getAllReviewsRedux = () => async (dispatch) => {
  const allReviews = await getAllReviews();
  dispatch({
    type: "GET_ALL_REVIEWS",
    payload: allReviews,
  });
};

export const updateReviewRedux = (reviewObj) => async (dispatch) => {
  const updatedProductObj = await updateReview(reviewObj);
  dispatch({
    type: "UPDATE_REVIEW",
    payload: updatedProductObj,
  });
};

export const deleteReviewRedux = (productId, reviewId) => async (dispatch) => {
  const updatedProductObj = await deleteReview(productId, reviewId);
  dispatch({
    type: "UPDATE_REVIEW",
    payload: updatedProductObj,
  });
};
export const getAllAttributeTermsRedux = (id) => async (dispatch) => {
  const allAttributes = await getAllAttributeTerms(id);
  dispatch({
    type: "GET_ALL_ATTRIBUTE_TERMS",
    payload: allAttributes,
  });
};

export const uploadAttributeTermRedux = (attrObj) => async (dispatch) => {
  const uploadedAttributeObj = await uploadAttributeTerm(attrObj);
  dispatch({
    type: "UPLOAD_ATTRIBUTE_TERM",
    payload: uploadedAttributeObj,
  });
};

export const updateAttributeTermRedux = (attrObj) => async (dispatch) => {
  const updatedAttrObj = await updateAttributeTerm(attrObj);
  dispatch({
    type: "UPDATE_ATTRIBUTE_TERM",
    payload: updatedAttrObj,
  });
};

export const deleteAttributeTermRedux =
  (termId, parentId) => async (dispatch) => {
    await deleteAttributeTerm(termId, parentId);
    dispatch({
      type: "DELETE_ATTRIBUTE_TERM",
      payload: { id: termId, parentId },
    });
  };

export const getAllCampaignsRedux = () => async (dispatch) => {
  const allCampaigns = await getAllCampaigns();
  dispatch({
    type: "GET_ALL_CAMPAIGNS",
    payload: allCampaigns,
  });
};

export const uploadCampaignRedux = (campaignObj) => async (dispatch) => {
  const uploadedCampaignObj = await uploadCampaign(campaignObj);
  dispatch({
    type: "UPLOAD_CAMPAIGN",
    payload: uploadedCampaignObj,
  });
};

export const updateCampaignRedux = (campaignObj) => async (dispatch) => {
  const updatedCampaignObj = await updateCampaign(campaignObj);
  dispatch({
    type: "UPDATE_CAMPAIGN",
    payload: updatedCampaignObj,
  });
};

export const deleteCampaignRedux = (id) => async (dispatch) => {
  await deleteCampaign(id);
  dispatch({
    type: "DELETE_CAMPAIGN",
    payload: id,
  });
};
export const getAllAnnouncementsRedux = () => async (dispatch) => {
  const allCampaigns = await getAllAnnouncements();
  dispatch({
    type: "GET_ALL_ANNOUNCEMENTS",
    payload: allCampaigns,
  });
};

export const uploadAnnouncementRedux = (campaignObj) => async (dispatch) => {
  const uploadedCampaignObj = await uploadAnnouncement(campaignObj);
  dispatch({
    type: "UPLOAD_ANNOUNCEMENT",
    payload: uploadedCampaignObj,
  });
};

export const updateAnnouncementRedux = (campaignObj) => async (dispatch) => {
  const updatedCampaignObj = await updateAnnouncement(campaignObj);
  dispatch({
    type: "UPDATE_ANNOUNCEMENT",
    payload: updatedCampaignObj,
  });
};

export const deleteAnnouncementRedux = (id) => async (dispatch) => {
  await deleteAnnouncement(id);
  dispatch({
    type: "DELETE_ANNOUNCEMENT",
    payload: id,
  });
};

export const getSingleOrderRedux = (id) => async (dispatch) => {
  const product = await getSingleOrder(id);
  dispatch({ type: "GET_SINGLE_ORDER", payload: product });
};
export const getAllCnfExpenseAllMonthsRedux = (name) => async (dispatch) => {
  const cnfs = await getAllCnfExpensesAllMonths(name);
  dispatch({
    type: "GET_ALL_CNF_EXPENSES_ALL_MONTHS",
    payload: cnfs,
  });
};
export const getAllCnfExpenseRedux = (month, name) => async (dispatch) => {
  const cnfs = await getAllCnfExpenses(month, name);
  dispatch({
    type: "GET_ALL_CNF_EXPENSES",
    payload: cnfs,
  });
};

export const getAllExpenseRedux = (day) => async (dispatch) => {
  const expenses = await getAllExpenses(day);
  dispatch({
    type: "GET_ALL_EXPENSES",
    payload: expenses,
  });
};

export const getAllMonthlyExpenseRedux = () => async (dispatch) => {
  const expenses = await getAllMonthlyExpense();
  dispatch({
    type: "GET_ALL_MONTHLY_EXPENSES",
    payload: expenses,
  });
};

export const getAllMonthlyCashSummaryRedux = () => async (dispatch) => {
  const months = await getAllMonthlyCashSummary();
  dispatch({
    type: "GET_ALL_MONTHLY_CASH_SUMMARY",
    payload: months,
  });
};

export const getAllMonthlyCashInRedux = () => async (dispatch) => {
  const expenses = await getAllMonthlyCashIn();
  dispatch({
    type: "GET_ALL_MONTHLY_CASH_INS",
    payload: expenses,
  });
};
export const getAllMonthlyRedux =
  (category, subCategory) => async (dispatch) => {
    const expenses = await getAllMonthly(category, subCategory);
    dispatch({
      type: "GET_ALL_MONTHLY",
      payload: expenses,
    });
  };

export const getAllMonthlySalaryRedux = () => async (dispatch) => {
  const expenses = await getAllMonthlySalary();
  dispatch({
    type: "GET_ALL_MONTHLY",
    payload: expenses,
  });
};

export const getSingleMonthlyExpenseRedux = (month) => async (dispatch) => {
  const expenses = await getSingleMonthlyExpense(month);
  dispatch({
    type: "GET_SINGLE_MONTHLY_EXPENSES",
    payload: expenses,
  });
};
export const getSingleMonthlyCashSummaryRedux = (month) => async (dispatch) => {
  const expenses = await getSingleMonthlyCashSummary(month);
  dispatch({
    type: "GET_SINGLE_MONTHLY_CASH_SUMMARY",
    payload: expenses,
  });
};

export const getSingleMonthlyCashInRedux = (month) => async (dispatch) => {
  const expenses = await getSingleMonthlyCashIn(month);
  dispatch({
    type: "GET_SINGLE_MONTHLY_CASH_INS",
    payload: expenses,
  });
};

export const getSingleMonthlyRedux =
  (month, category, subCategory) => async (dispatch) => {
    const expenses = await getSingleMonthly(month, category, subCategory);
    dispatch({
      type: "GET_SINGLE_MONTHLY",
      payload: expenses,
    });
  };
export const getSingleMonthlySalaryRedux =
  (month, category) => async (dispatch) => {
    const expenses = await getSingleMonthlySalary(month, category);
    dispatch({
      type: "GET_SINGLE_MONTHLY",
      payload: expenses,
    });
  };

export const getSingleMonthlyLoanCashInRedux =
  (month, category) => async (dispatch) => {
    const cashIns = await getSingleMonthlyLoanCashIn(month, category);
    dispatch({
      type: "GET_SINGLE_MONTHLY_LOANS_CASHIN",
      payload: cashIns,
    });
  };
export const getSingleMonthlyLoanCashOutRedux =
  (month, category) => async (dispatch) => {
    const expenses = await getSingleMonthlyLoanCashOut(month, category);
    dispatch({
      type: "GET_SINGLE_MONTHLY_LOANS_CASHOUT",
      payload: expenses,
    });
  };
export const clearSingleMonthRedux = () => async (dispatch) => {
  dispatch({
    type: "CLEAR_SINGLE_MONTHLY",
  });
};

export const getAllPendingExpenseByDayRedux = (day) => async (dispatch) => {
  const expenses = await getAllPendingExpensesByDay(day);
  dispatch({
    type: "GET_ALL_EXPENSES",
    payload: expenses,
  });
};
export const getAllPendingCashInByDayRedux = (day) => async (dispatch) => {
  const cashIns = await getAllPendingCashInByDay(day);
  dispatch({
    type: "GET_ALL_CASH_INS",
    payload: cashIns,
  });
};
export const getAllPendingExpensesRedux = () => async (dispatch) => {
  const expenses = await getAllPendingExpenses();
  dispatch({
    type: "GET_ALL_PENDING_EXPENSES",
    payload: expenses,
  });
};
export const getAllPendingCashInsRedux = () => async (dispatch) => {
  const cashIns = await getAllPendingCashIns();
  dispatch({
    type: "GET_ALL_PENDING_CASH_INS",
    payload: cashIns,
  });
};
export const getAllLoansCashOutsRedux = () => async (dispatch) => {
  const expenses = await getAllLoansCashOuts();
  dispatch({
    type: "GET_ALL_LOANS_CASH_OUTS",
    payload: expenses,
  });
};
export const getAllLoansCashInsRedux = () => async (dispatch) => {
  const cashIns = await getAllLoansCashIns();
  dispatch({
    type: "GET_ALL_LOANS_CASH_INS",
    payload: cashIns,
  });
};
export const getAllLoansCashOutCustomerRedux =
  (customer) => async (dispatch) => {
    const expenses = await getAllLoansCashOutCustomer(customer);
    dispatch({
      type: "GET_ALL_LOANS_CASH_OUTS_CUSTOMER",
      payload: expenses,
    });
  };
export const getSingleCustomerLoanRedux = (customer) => async (dispatch) => {
  const loan = await getSingleCustomerLoan(customer);
  dispatch({
    type: "GET_SINGLE_CUSTOMER_LOAN",
    payload: loan,
  });
};
export const getAllInstallmentsCashOutCustomerRedux =
  (customer) => async (dispatch) => {
    const expenses = await getAllInstallmentsCashOutCustomer(customer);
    dispatch({
      type: "GET_ALL_INSTALLMENTS_CASH_OUTS_CUSTOMER",
      payload: expenses,
    });
  };
export const getAllLoansCashInCustomerRedux =
  (customer) => async (dispatch) => {
    const cashIns = await getAllLoansCashInCustomer(customer);
    dispatch({
      type: "GET_ALL_LOANS_CASH_INS_CUSTOMER",
      payload: cashIns,
    });
  };

export const uploadExpenseRedux = (expenseObj) => async (dispatch) => {
  const uploadedExpenseObj = await uploadExpense(expenseObj);
  dispatch({
    type: "UPLOAD_EXPENSE",
    payload: uploadedExpenseObj,
  });
};

export const updateExpenseRedux = (expenseObj) => async (dispatch) => {
  const updatedExpenseObj = await updateExpense(expenseObj);
  dispatch({
    type: "UPDATE_EXPENSE",
    payload: updatedExpenseObj,
  });
};

export const deleteExpenseRedux = (expenseId) => async (dispatch) => {
  await deleteExpense(expenseId);
  dispatch({
    type: "DELETE_EXPENSE",
    payload: expenseId,
  });
};

export const approveExpenseRedux = (date) => async (dispatch) => {
  await approveExpense(date);

  dispatch({
    type: "APPROVE_EXPENSE",
    payload: date,
  });
};
export const deleteCashInRedux = (cashInId) => async (dispatch) => {
  await deleteCashIn(cashInId);
  dispatch({
    type: "DELETE_CASH_IN",
    payload: cashInId,
  });
};

export const updateEmployeeRedux = (employeeObj) => async (dispatch) => {
  const updatedEmployeeObj = await updateEmployee(employeeObj);
  dispatch({
    type: "UPDATE_EMPLOYEE",
    payload: updatedEmployeeObj,
  });
};

export const getAllCnfRedux = () => async (dispatch) => {
  const cnfs = await getAllCnfs();
  dispatch({
    type: "GET_ALL_CNFS",
    payload: cnfs,
  });
};

// OFFICE CRUD
export const getAllOfficeRedux = () => async (dispatch) => {
  const offices = await getAllOffices();
  dispatch({
    type: "GET_ALL_OFFICES",
    payload: offices,
  });
};

export const uploadOfficeRedux = (officeObj) => async (dispatch) => {
  const uploadedOfficeObj = await uploadOffice(officeObj);
  dispatch({
    type: "UPLOAD_OFFICE",
    payload: uploadedOfficeObj,
  });
};

export const updateOfficeRedux = (officeObj) => async (dispatch) => {
  const updatedOfficeObj = await updateOffice(officeObj);
  dispatch({
    type: "UPDATE_OFFICE",
    payload: updatedOfficeObj,
  });
};
export const deleteOfficeRedux = (officeId) => async (dispatch) => {
  await deleteOffice(officeId);
  dispatch({
    type: "DELETE_OFFICE",
    payload: officeId,
  });
};

export const getSingleCashSummaryRedux = () => async (dispatch) => {
  const cashObj = await getSingleCashSummary();
  dispatch({
    type: "GET_SINGLE_CASH_SUMMARY",
    payload: cashObj,
  });
};

export const deleteCnfRedux = (cnfId) => async (dispatch) => {
  await deleteCnf(cnfId);
  dispatch({
    type: "DELETE_CNF",
    payload: cnfId,
  });
};
export const uploadCnfRedux = (cnfObj) => async (dispatch) => {
  const uploadedCnfObj = await uploadCnf(cnfObj);
  dispatch({
    type: "UPLOAD_CNF",
    payload: uploadedCnfObj,
  });
};

export const updateCnfRedux = (cnfObj) => async (dispatch) => {
  const updatedCnfObj = await updateCnf(cnfObj);
  dispatch({
    type: "UPDATE_CNF",
    payload: updatedCnfObj,
  });
};

export const deleteEmployeeRedux = (employeeId) => async (dispatch) => {
  await deleteEmployee(employeeId);
  dispatch({
    type: "DELETE_EMPLOYEE",
    payload: employeeId,
  });
};

export const getAllCustomerLoansRedux = () => async (dispatch) => {
  const allCustomers = await getAllCustomerLoans();
  dispatch({
    type: "GET_ALL_CUSTOMERS",
    payload: allCustomers,
  });
};

export const getAllCustomerInstallmentRedux = () => async (dispatch) => {
  const allCustomers = await getAllCustomerInstallments();
  dispatch({
    type: "GET_ALL_CUSTOMERS_INSTALLMENT",
    payload: allCustomers,
  });
};

export const uploadCnfBillRedux = (billObj) => async (dispatch) => {
  await uploadCnfBill(billObj);
  dispatch({
    type: "UPLOAD_CNF_BILL",
    payload: billObj,
  });
};

export const getAllCnfBillMonthsRedux = (month) => async (dispatch) => {
  const allMonths = await getAllMonthsCnfBill(month);
  dispatch({
    type: "ALL_MONTHS_CNF_BILL",
    payload: allMonths,
  });
};

export const getAllCnfBillRedux = (month, name) => async (dispatch) => {
  const cnfs = await getAllCnfBills(month, name);
  dispatch({
    type: "GET_ALL_CNF_BILLS",
    payload: cnfs,
  });
};

export const getAllCnfBillAllMonthsRedux = (name) => async (dispatch) => {
  const cnfs = await getAllCnfBillsAllMonths(name);
  dispatch({
    type: "GET_ALL_CNF_BILLS_ALL_MONTHS",
    payload: cnfs,
  });
};

export const updateSalaryRedux = (employeeObj) => async (dispatch) => {
  const updatedEmployeeObj = await updateSalary(employeeObj);
  dispatch({
    type: "UPDATE_SALARY",
    payload: updatedEmployeeObj,
  });
};

export const uploadEmployeeRedux = (employeeObj) => async (dispatch) => {
  const uploadedEmployeeObj = await uploadEmployee(employeeObj);
  dispatch({
    type: "UPLOAD_EMPLOYEE",
    payload: uploadedEmployeeObj,
  });
};

export const getAllFundsRedux = () => async (dispatch) => {
  const funds = await getAllFunds();
  dispatch({
    type: "GET_ALL_FUNDS",
    payload: funds,
  });
};

export const getAllCashInsRedux = (day) => async (dispatch) => {
  const cashIns = await getAllCashIns(day);
  dispatch({
    type: "GET_ALL_CASH_INS",
    payload: cashIns,
  });
};

export const createMonthRedux = () => async (dispatch) => {
  const months = await createMonth();
  dispatch({
    type: "GET_ALL_MONTHS",
    payload: months,
  });
};

export const uploadCashInRedux = (cashInObj) => async (dispatch) => {
  const uploadedCashInObj = await uploadCashIn(cashInObj);
  dispatch({
    type: "UPLOAD_CASH_IN",
    payload: uploadedCashInObj,
  });
};

export const updateCashInRedux = (cashInObj) => async (dispatch) => {
  const updatedCashInObj = await updateCashIn(cashInObj);
  dispatch({
    type: "UPDATE_CASH_IN",
    payload: updatedCashInObj,
  });
};

export const getAllDocumentExpressRatesRedux = () => async (dispatch) => {
  const documentExpressRatesArray = await getAllDocumentExpressRates();
  dispatch({
    type: "GET_ALL_DOCUMENT_EXPRESS_RATES",
    payload: documentExpressRatesArray,
  });
};

export const getAllEmployeeRedux = () => async (dispatch) => {
  const employees = await getAllEmployees();
  dispatch({
    type: "GET_ALL_EMPLOYEES",
    payload: employees,
  });
};
