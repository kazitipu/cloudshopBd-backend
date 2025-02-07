import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAtfJVVFBS0GcYztN-bDzNJJtsxiKRuOm8",
  authDomain: "cloudshopbd-1aaae.firebaseapp.com",
  projectId: "cloudshopbd-1aaae",
  storageBucket: "cloudshopbd-1aaae.appspot.com",
  messagingSenderId: "65158771737",
  appId: "1:65158771737:web:c0cb0da3c178f1c6066688",
  measurementId: "G-10GPD8GP9X",
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const createAdminProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const adminRef = firestore.doc(`admins/${userAuth.uid}`);

  const snapShot = await adminRef.get();
  if (!snapShot.exists) {
    const { name, email } = userAuth;
    const createdAt = new Date();
    try {
      await adminRef.set({
        name,
        email,
        createdAt,
        pending_orders: [],
        balance: 0,
        used_balance: 0,
        successfully_delivered_orders: [],
        remaining_balance: 0,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating admin", error.message);
    }
  }
  return adminRef;
};
export const updateAllUser = async () => {
  const usersRef = firestore.collection("users");
  const users = await usersRef.get();

  users.forEach(async (doc) => {
    const userRef = firestore.doc(`users/${doc.id}`);
    const user = await userRef.get();
    // do any updates here
  });
};
export const uploadImage = async (file) => {
  const imageRef = storage.ref(`products/${file.name}`);

  await imageRef.put(file);
  var imgUrl = [];
  await imageRef.getDownloadURL().then((url) => {
    console.log(url);
    imgUrl.push(url);
  });
  // var uploadTask = imageRef.put(file)
  // uploadTask.on('state_changed',
  // (snapShot)=>{
  //   var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
  //   // alert(`upload is ${progress}% done`)
  // },
  // (error)=>{
  //   alert(error)
  // },
  // ()=>{
  //   // alert('successfully uploaded the file')
  //   imageRef.getDownloadURL().then((url)=>{
  //     imgUrl.push(url)
  //     console.log(imgUrl[0])
  //   }).catch((error)=>alert(error))
  // })

  return imgUrl[0];
};

export const getAllDeviceTokens = async () => {
  const tokensCollectionRef = firestore.collection("deviceTokens");
  try {
    const tokens = await tokensCollectionRef.get();
    const tokensArray = [];
    tokens.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      tokensArray.push(doc.data().deviceToken[0]);
    });
    return tokensArray;
  } catch (error) {
    alert(error);
    return [];
  }
};

export const uploadProduct = async (productObj) => {
  const productRef = firestore.doc(`products/${productObj.id}`);
  const snapShot = await productRef.get();
  delete productObj.file;
  const newProductObj = {
    ...productObj,
  };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    if (productObj.edited) {
      await productRef.update({
        ...newProductObj,
      });
    } else {
      alert(
        "there is already a product with this given prodcut Id, please change the product Id and upload again"
      );
    }
  }
  const updatedSnapShot = await productRef.get();
  return updatedSnapShot.data();
};
export const uploadDisplayedVariation = async (variationObj) => {
  const productRef = firestore.doc(`variations/${variationObj.id}`);
  const snapShot = await productRef.get();

  const newVariationObj = {
    ...variationObj,
  };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newVariationObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    await productRef.update({
      ...newVariationObj,
    });
  }
  const updatedSnapShot = await productRef.get();
  return updatedSnapShot.data();
};
export const uploadProductTax = async (productObj) => {
  const productRef = firestore.doc(`taxes/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj };
  if (!snapShot.exists) {
    try {
      productRef.set({
        ...newProductObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "there is already a product with this given prodcut Id, please change the product Id and upload again"
    );
  }
};
export const uploadImageRechargeRequest = async (file) => {
  const imageRef = storage.ref(`rechargeRequests/${file.name}`);

  try {
    await imageRef.put(file);
    var imgUrl = [];
    await imageRef.getDownloadURL().then((url) => {
      console.log(url);
      imgUrl.push(url);
    });
    return imgUrl[0];
  } catch (error) {
    return null;
  }
};
export const uploadAliProduct = async (productObj) => {
  const productRef = firestore.doc(`aliproducts/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj };
  if (!snapShot.exists) {
    try {
      productRef.set({
        ...newProductObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "this product is already added to your website. try adding different product"
    );
  }
};

let lastVisible = null; // This will hold the last document snapshot from the previous query
const cache = {}; // Store results in the cache for efficiency

export const getAllProducts = async (pageNo) => {
  console.log(`Fetching page: ${pageNo}`);
  const productsPerPage = 100;
  let productsArray = [];

  // Check if the data for this page is already in the cache
  if (cache[pageNo]) {
    console.log("Returning from cache");
    return cache[pageNo];
  }

  try {
    // Initial query, ordered by 'name', limited to productsPerPage
    let query = firestore
      .collection("products")
      .orderBy("name")
      .limit(productsPerPage);

    // If we're beyond the first page, use the last document from the previous page as the cursor
    if (pageNo > 1 && lastVisible) {
      query = query.startAfter(lastVisible); // Start after the last document of the previous page
    }

    // Fetch the products snapshot
    const productsSnapshot = await query.get();

    // Check if there are any products
    if (!productsSnapshot.empty) {
      // Update the lastVisible document to the last document in the current snapshot
      lastVisible = productsSnapshot.docs[productsSnapshot.docs.length - 1];

      // Push the fetched products to the array
      productsSnapshot.forEach((doc) => {
        productsArray.push(doc.data());
      });

      // Cache the result for the current page
      cache[pageNo] = productsArray;

      console.log(
        `Fetched ${productsArray.length} products for page ${pageNo}`
      );
      return productsArray;
    } else {
      console.log("No products found");
      return []; // Return an empty array if no products are found
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Failed to fetch products. Please try again.");
  }
};

export const getAllReviews = async () => {
  const productsCollectionRef = firestore
    .collection("products")
    .orderBy("reviews");
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllProductsTax = async () => {
  const productsCollectionRef = firestore.collection("taxes");
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllAliProducts = async () => {
  const aliProductsCollectionRef = firestore.collection("aliproducts");
  try {
    const products = await aliProductsCollectionRef.get();
    const aliProductsArray = [];
    products.forEach((doc) => {
      aliProductsArray.push(doc.data());
    });
    return aliProductsArray;
  } catch (error) {
    alert(error);
  }
};

export const deleteProduct = async (id) => {
  const productRef = firestore.doc(`products/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const deleteReview = async (productId, reviewId) => {
  const productRef = firestore.doc(`products/${productId}`);
  const product = await productRef.get();
  let updatedReviews = [];
  product.data().reviews.map((review) => {
    if (review.id != reviewId) {
      updatedReviews.push(review);
    }
  });
  try {
    await productRef.update({ ...product.data(), reviews: updatedReviews });
    const updatedProduct = await productRef.get();
    return updatedProduct.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteProductTax = async (id) => {
  const productRef = firestore.doc(`taxes/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const updateProductTax = async (productObj) => {
  const productRef = firestore.doc(`taxes/${productObj.id}`);
  try {
    await productRef.update({ ...productObj });
  } catch (error) {
    alert(error);
  }
};

export const getSingleProductTax = async (id) => {
  const productRef = firestore.doc(`taxes/${id}`);
  try {
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};
export const getFreeShipping = async () => {
  const productRef = firestore.doc(`freeShipping/freeShipping`);
  try {
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};
export const getSingleProduct = async (id) => {
  const productRef = firestore.doc(`products/${id}`);
  try {
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};
export const getDisplayedVariation = async (id) => {
  const productRef = firestore.doc(`variations/${id}`);
  try {
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};

// get all users

export const getAllUsers = async () => {
  const usersCollectionRef = firestore.collection("users");
  try {
    const users = await usersCollectionRef.get();
    const usersArray = [];
    users.forEach((doc) => {
      usersArray.push({ uid: doc.id, ...doc.data() });
    });
    return usersArray;
  } catch (error) {
    alert(error);
  }
};

export const deleteUser = async (id) => {
  const productRef = firestore.doc(`users/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

// Orders management (get all orders)

export const getAllOrders = async (orderStatus) => {
  const ordersCollectionRef = firestore
    .collection("orders")
    .where("orderStatus", "==", orderStatus);
  try {
    const orders = await ordersCollectionRef.get();
    const ordersArray = [];
    orders.forEach((doc) => {
      ordersArray.push(doc.data());
    });
    return ordersArray;
  } catch (error) {
    alert(error);
  }
};

export const updateAllUsers = async () => {
  const collection = await firestore.collection("users").get();
  collection.forEach((doc) => {
    doc.ref.update({
      ...doc.data(),
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/globalbuybd-auth.appspot.com/o/users%2Fprofile.png?alt=media&token=810e25f1-8cd9-43b0-b49d-41f2236588cb",
    });
  });
};

export const deleteOrder = async (id) => {
  const orderRef = firestore.doc(`orders/${id}`);
  try {
    await orderRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getSingleOrder = async (id) => {
  const orderRef = firestore.doc(`orders/${id}`);
  try {
    const order = await orderRef.get();
    return order.data();
  } catch (error) {
    alert(error);
  }
};

export const getSingleAttribute = async (id) => {
  const orderRef = firestore.doc(`attributes/${id}`);
  try {
    const order = await orderRef.get();
    return order.data();
  } catch (error) {
    alert(error);
  }
};

export const updateOrder = async (orderObj) => {
  const orderRef = firestore.doc(`orders/${orderObj.id}`);
  const order = await orderRef.get();

  await orderRef.update(orderObj);
  const updatedSnapShot = await orderRef.get();
  return updatedSnapShot.data();
};

export const updateMultipleOrder = async (orderIdArray, status) => {
  orderIdArray.forEach(async (orderId) => {
    const orderRef = firestore.doc(`orders/${orderId}`);
    const order = await orderRef.get();
    const userId = await order.data().userId;
    const userRef = firestore.doc(`users/${userId}`);
    const user = await userRef.get();
    var exactOrder = user
      .data()
      .ordersArray.find((order) => order.orderId == orderId);
    exactOrder.status = status;
    var otherOrders = user
      .data()
      .ordersArray.filter((order) => order.orderId !== orderId);
    console.log(status);
    if (status == "delivered") {
      console.log(status);
      const adminsCollectionRef = firestore.collection("admins");
      const admins = await adminsCollectionRef.get();
      admins.forEach(async (doc) => {
        console.log(doc.data().pending_orders.includes(orderId));
        if (doc.data().pending_orders.includes(orderId)) {
          console.log(status);
          var adminRef = firestore.doc(`admins/${doc.id}`);
          var updatedPendingOrders = doc
            .data()
            .pending_orders.filter((order) => order !== orderId);
          var newly_used_balance = order.data().sum;
          var total_used_balance = doc.data().used_balance
            ? doc.data().used_balance + newly_used_balance
            : newly_used_balance;
          await adminRef.update({
            ...doc.data(),
            pending_orders: [...updatedPendingOrders],
            successfully_delivered_orders: doc.data()
              .successfully_delivered_orders
              ? [...doc.data().successfully_delivered_orders, orderId]
              : [orderId],
            used_balance: total_used_balance,
            remaining_balance:
              doc.data().balance - parseInt(total_used_balance),
          });
        }
      });
    }
    try {
      await userRef.update({ ordersArray: [exactOrder, ...otherOrders] });
      return await orderRef.update({ ...order.data(), status: status });
    } catch (error) {
      alert(error);
    }
  });
};

export const updateMultipleOrderwithOrderTo = async (
  orderIdArray,
  status,
  orderTo
) => {
  orderIdArray.forEach(async (orderId) => {
    const orderRef = firestore.doc(`orders/${orderId}`);
    const order = await orderRef.get();
    const userId = await order.data().userId;
    const userRef = firestore.doc(`users/${userId}`);
    const user = await userRef.get();
    var exactOrder = user
      .data()
      .ordersArray.find((order) => order.orderId == orderId);
    exactOrder.status = status;
    if (!exactOrder.orderTo) {
      exactOrder.orderTo = orderTo;
    }
    var otherOrders = user
      .data()
      .ordersArray.filter((order) => order.orderId !== orderId);
    try {
      if (!order.data().orderTo) {
        await orderRef.update({ ...order.data(), status, orderTo });
      } else {
        await orderRef.update({
          ...order.data(),
          orderTo: order.data().orderTo,
          status,
        });
        alert(
          `this ${orderId} order is already ordered to another supplier. check ordered products`
        );
      }
      await userRef.update({ ordersArray: [exactOrder, ...otherOrders] });
    } catch (error) {
      alert(error);
    }
  });
};

// paymet management
export const getAllPayments = async () => {
  const paymentsCollectionRef = firestore.collection("payments");
  try {
    const payments = await paymentsCollectionRef.get();
    const paymentsArray = [];
    payments.forEach((doc) => {
      paymentsArray.push({ uid: doc.id, ...doc.data() });
    });
    return paymentsArray;
  } catch (error) {
    alert(error);
  }
};

export const deletePayment = async (orderId) => {
  const paymentRef = firestore.doc(`payments/${orderId}`);
  try {
    await paymentRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const updatePaymentStatus = async (paymentObj) => {
  const paymentRef = firestore.doc(`payments/${paymentObj.orderId}`);
  const payment = await paymentRef.get();
  var actualPayment = payment
    .data()
    .payments.find((payment) => payment.paymentId == paymentObj.paymentId);
  const orderId = actualPayment.orderId;
  const orderRef = firestore.doc(`orders/${orderId}`);
  const order = await orderRef.get();
  const userId = await order.data().userId;
  const userRef = firestore.doc(`users/${userId}`);
  const user = await userRef.get();
  var exactPayment = user
    .data()
    .paymentsArray.find((payment) => payment.paymentId == paymentObj.paymentId);
  exactPayment.paymentStatus = paymentObj.paymentStatus;
  var otherPayments = user
    .data()
    .paymentsArray.filter(
      (payment) => payment.paymentId !== paymentObj.paymentId
    );

  await userRef.update({ paymentsArray: [exactPayment, ...otherPayments] });
  const updatedPaymentObj = payment
    .data()
    .payments.find((payment) => payment.paymentId == paymentObj.paymentId);
  updatedPaymentObj.paymentStatus = paymentObj.paymentStatus;
  const newPaymentsArray = payment
    .data()
    .payments.filter((payment) => payment.paymentId !== paymentObj.paymentId);
  try {
    await paymentRef.update({
      ...payment.data(),
      payments: [...newPaymentsArray, updatedPaymentObj],
    });
  } catch (error) {
    alert(error);
  }
};

export const updateOrderAmount = async (paymentObj) => {
  const orderRef = firestore.doc(`orders/${paymentObj.orderId}`);
  const order = await orderRef.get();
  const userId = await order.data().userId;
  const userRef = firestore.doc(`users/${userId}`);
  const user = await userRef.get();
  var exactOrder = user
    .data()
    .ordersArray.find((order) => order.orderId == paymentObj.orderId);
  exactOrder.status === "order_pending"
    ? (exactOrder.status = "payment_approved")
    : (exactOrder.status = exactOrder.status);
  exactOrder.paymentStatus.paid =
    parseInt(exactOrder.paymentStatus.paid) + parseInt(paymentObj.amount);
  exactOrder.paymentStatus.due =
    parseInt(exactOrder.paymentStatus.total) -
    parseInt(exactOrder.paymentStatus.paid);
  var otherOrders = user
    .data()
    .ordersArray.filter((order) => order.orderId !== paymentObj.orderId);
  await userRef.update({ ordersArray: [exactOrder, ...otherOrders] });
  try {
    const order = await orderRef.get();
    console.log(order.data());
    await orderRef.update({
      ...order.data(),
      status:
        order.data().status === "order_pending"
          ? "payment_approved"
          : order.data().status,
      paymentStatus: {
        ...order.data().paymentStatus,
        due:
          parseInt(order.data().paymentStatus.total) -
          (parseInt(order.data().paymentStatus.paid) +
            parseInt(paymentObj.amount)),
        paid:
          parseInt(order.data().paymentStatus.paid) +
          parseInt(paymentObj.amount),
      },
    });
  } catch (error) {
    alert(error);
  }
};

// distribute order to managers
export const orderProductsFromChina = async (orderIdArray, orderTo) => {
  const adminsCollectionRef = firestore.collection("admins");
  orderIdArray.forEach(async (orderId) => {
    const orderRef = firestore.doc(`orders/${orderId}`);
    try {
      const order = await orderRef.get();
      if (!order.data().orderTo) {
        try {
          const admins = await adminsCollectionRef.get();
          admins.forEach((doc) => {
            var adminRef = firestore.doc(`admins/${doc.id}`);
            if (doc.data().name == orderTo) {
              adminRef.update({
                ...doc.data(),
                pending_orders: [...doc.data().pending_orders, orderId],
              });
              return;
            }
          });
        } catch (error) {
          alert(error);
        }
      } else {
        console.log(
          `${orderId} is already ordered to another supplier.check ordered item`
        );
      }
    } catch (error) {
      console.log(error);
    }
  });
};

export const productToOrder = async (productsArray) => {
  productsArray.forEach((product) => {
    const productToOrderRef = firestore.doc(`productToOrder/${product.id}`);
    try {
      productToOrderRef.set(product);
    } catch (error) {
      alert(error);
    }
  });
};

// admins
export const getAllAdmins = async () => {
  const adminsCollectionRef = firestore.collection("admins");
  try {
    const admins = await adminsCollectionRef.get();
    const adminsArray = [];
    admins.forEach((doc) => {
      adminsArray.push({ adminId: doc.id, ...doc.data() });
    });
    return adminsArray;
  } catch (error) {
    alert(error);
  }
};

export const rechargeAdmin = async (adminIdArray, balance) => {
  adminIdArray.forEach(async (adminId) => {
    const adminRef = firestore.doc(`admins/${adminId}`);
    try {
      const admin = await adminRef.get();
      var total_balance = parseInt(admin.data().balance) + parseInt(balance);
      await adminRef.update({
        ...admin.data(),
        balance: admin.data().balance
          ? parseInt(admin.data().balance) + parseInt(balance)
          : parseInt(balance),
        remaining_balance: total_balance - parseInt(admin.data().used_balance),
      });
    } catch (error) {
      alert(error);
    }
  });
};

export const updateProfileImage = async (imgUrl, id) => {
  const adminRef = firestore.doc(`admins/${id}`);
  try {
    const admin = await adminRef.get();
    await adminRef.update({ ...admin.data(), image: imgUrl });
  } catch (error) {
    alert(error);
  }
};
export const setRmbPrice = async (taka) => {
  const currencyRef = firestore.doc(`Currency/taka`);
  let rmbRate;
  if (taka) {
    try {
      const currency = await currencyRef.get();
      if (currency.data()) {
        await currencyRef.update({ ...currency.data(), taka });
        rmbRate = taka;
        return rmbRate;
      } else {
        await currencyRef.set({ taka: taka });
        rmbRate = taka;
        return rmbRate;
      }
    } catch (error) {
      alert(error);
    }
  } else {
    try {
      const currency = await currencyRef.get();
      rmbRate = currency.data().taka;
      return rmbRate;
    } catch (error) {
      alert(error);
    }
  }
};

export const getAllProductRequests = async (status) => {
  const reqeustsCollectionRef = firestore
    .collection("bookingRequest")
    .where("status", "==", status);

  try {
    const requests = await reqeustsCollectionRef.get();
    const requestsArray = [];
    requests.forEach((doc) => {
      requestsArray.push(doc.data());
    });
    return requestsArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const getAllShipmentRequests = async (status) => {
  const reqeustsCollectionRef = firestore
    .collection("shipForMe")
    .where("status", "==", status);

  try {
    const requests = await reqeustsCollectionRef.get();
    const requestsArray = [];
    requests.forEach((doc) => {
      requestsArray.push(doc.data());
    });
    return requestsArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const updateProductRequest = async (requestObj) => {
  const reqeustRef = firestore.doc(`bookingRequest/${requestObj.bookingId}`);

  try {
    await reqeustRef.update({
      ...requestObj,
    });
    const request = await reqeustRef.get();
    return request.data();
  } catch (error) {
    alert(error);
  }
};
export const updateProduct = async (productObj) => {
  const productRef = firestore.doc(`aliproducts/${productObj.id}`);

  try {
    await productRef.update({
      ...productObj,
    });
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};
export const updateReview = async (reviewObj) => {
  const productRef = firestore.doc(`products/${reviewObj.productId}`);
  const product = await productRef.get();

  try {
    await productRef.update({
      ...product.data(),
      reviews: product.data().reviews.map((review) => {
        if (review.id == reviewObj.id) {
          return reviewObj;
        } else {
          return review;
        }
      }),
    });
    const updatedProduct = await productRef.get();
    return updatedProduct.data();
  } catch (error) {
    alert(error);
  }
};
export const updateShipmentRequest = async (requestObj) => {
  const reqeustRef = firestore.doc(`shipForMe/${requestObj.bookingId}`);

  try {
    await reqeustRef.update({
      ...requestObj,
    });
    const request = await reqeustRef.get();
    return request.data();
  } catch (error) {
    alert(error);
  }
};

export const getAllPaymentRequest = async () => {
  const paymentRequestCollectionRef = firestore
    .collection("paymentRequest")
    .where("status", "==", "pending");

  try {
    const paymentRequest = await paymentRequestCollectionRef.get();
    const paymentRequestArray = [];
    paymentRequest.forEach((doc) => {
      paymentRequestArray.push(doc.data());
    });
    console.log(paymentRequestArray);
    return paymentRequestArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const getAllPaymentRequestOrder = async () => {
  const paymentRequestCollectionRef = firestore
    .collection("paymentRequestApi")
    .where("status", "==", "pending");

  try {
    const paymentRequest = await paymentRequestCollectionRef.get();
    const paymentRequestArray = [];
    paymentRequest.forEach((doc) => {
      paymentRequestArray.push(doc.data());
    });
    console.log(paymentRequestArray);
    return paymentRequestArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};

export const updatePaymentRequestStatus = async (paymentRequestObj) => {
  console.log(paymentRequestObj);
  const paymentRequestRef = firestore.doc(
    `paymentRequest/${paymentRequestObj.paymentId}`
  );
  const snapshot = await paymentRequestRef.get();
  if (snapshot.exists) {
    try {
      paymentRequestObj.productRequestArray.forEach(async (productRequest) => {
        if (productRequest.shipFrom) {
          const bookingRequestRef = firestore.doc(
            `shipForMe/${productRequest.bookingId}`
          );
          const bookingRequest = await bookingRequestRef.get();
          await bookingRequestRef.update({
            paymentStatus: paymentRequestObj.status,
            status:
              paymentRequestObj.status === "paid"
                ? "Paid"
                : bookingRequest.data().status,
          });
        } else {
          const bookingRequestRef = firestore.doc(
            `bookingRequest/${productRequest.bookingId}`
          );
          const bookingRequest = await bookingRequestRef.get();
          await bookingRequestRef.update({
            paymentStatus: paymentRequestObj.status,
            status:
              paymentRequestObj.status === "paid"
                ? "Paid"
                : bookingRequest.data().status,
          });
        }
      });
      await paymentRequestRef.update({
        status: paymentRequestObj.status,
      });
      const updatedPaymentRequestObj = await paymentRequestRef.get();
      return updatedPaymentRequestObj.data();
    } catch (error) {
      alert(error);
    }
  } else {
    return null;
  }
};
export const updatePaymentRequestOrderStatus = async (paymentRequestObj) => {
  console.log(paymentRequestObj);
  const paymentRequestRef = firestore.doc(
    `paymentRequestApi/${paymentRequestObj.paymentId}`
  );
  const snapshot = await paymentRequestRef.get();
  if (snapshot.exists) {
    try {
      for (let i = 0; i < paymentRequestObj.pendingOrders.length; i++) {
        const element = paymentRequestObj.pendingOrders[i];
        const orderRef = firestore.doc(`ordersApi/${element.orderId}`);

        const order = await orderRef.get();
        await orderRef.update({
          orderStatus: paymentRequestObj.status,
          paymentStatus:
            paymentRequestObj.status == "approved"
              ? "paid"
              : paymentRequestObj.status,
        });
      }
      await paymentRequestRef.update({
        status: paymentRequestObj.status,
      });
      const updatedPaymentRequestObj = await paymentRequestRef.get();
      return updatedPaymentRequestObj.data();
    } catch (error) {
      alert(error);
      return null;
    }
  } else {
    return null;
  }
};

export const getAllOrdersApi = async (orderStatus) => {
  const ordersCollectionRef = firestore
    .collection("ordersApi")
    .where("orderStatus", "==", orderStatus);
  try {
    const orders = await ordersCollectionRef.get();
    const ordersArray = [];
    orders.forEach((doc) => {
      ordersArray.push(doc.data());
    });
    return ordersArray;
  } catch (error) {
    alert(error);
  }
};
export const getAllRooms = async () => {
  const roomsCollectionRef = firestore.collection("rooms");

  try {
    const rooms = await roomsCollectionRef.get();
    const roomsArray = [];
    rooms.forEach((doc) => {
      roomsArray.push(doc.data());
    });
    return roomsArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const readAllMessage = async (roomId) => {
  const roomRef = firestore.doc(`rooms/${roomId}`);
  const room = await roomRef.get();
  roomRef.update({
    messages: room.data().messages.map((message) => {
      if (message.user._id == roomId) {
        return { ...message, sent: true, received: true };
      } else {
        return message;
      }
    }),
    lastMessage: { ...room.data().lastMessage, sent: true, received: true },
  });
};

export const updateOrderApi = async (order) => {
  const orderRef = firestore.doc(`ordersApi/${order.orderId}`);
  const snapShot = await orderRef.get();
  if (snapShot.exists) {
    try {
      await orderRef.update({ ...order });
      const updatedOrder = await orderRef.get();
      return updatedOrder.data();
    } catch (error) {
      console.log("error creating orders", error.message);
      return;
    }
  } else {
    alert("No order was found to be updated");
  }
};

export const getCurrency = async () => {
  const currencyRef = firestore.doc("Currency/taka");
  try {
    const currency = await currencyRef.get();
    return currency.data();
  } catch (error) {
    alert(error);
  }
};

export const makePayment = async (
  total,
  invoicesToPay,
  currentUser,
  admin,
  parcelsArray,
  paymentMethod
) => {
  try {
    const res = await firestore.runTransaction(async (t) => {
      //first create a payment object
      const paymentObj = {
        paymentId: Math.floor(Math.random() * Date.now()),
        paidAt: new Date().toLocaleDateString("en-US").replaceAll("/", "-"),
        amount: total,
        paymentMethod,
        paidInvoice: [...invoicesToPay],
        approvedBy: admin.name,
      };

      // for transaction all reads should be done before all writes
      const paymentDayRef = firestore.doc(`paymentDays/${paymentObj.paidAt}`);
      const paymentDay = await t.get(paymentDayRef);
      const paymentHistoryRef = firestore.doc(
        `paymentHistory/${paymentObj.paymentId}`
      );
      const paymentHistory = await t.get(paymentHistoryRef);
      // updatating the status invoiceStatus=Paid in parcelArray in admin
      parcelsArray.forEach(async (parcel) => {
        const orderRef = firestore.doc(`orders/${parcel.parcelId}`);
        await t.update(orderRef, {
          ...parcel,
          invoiceStatus: "Paid",
        });
      });

      // make all writes
      // make a payment in paymentdays
      console.log(paymentDay.data());
      const day = getDay();
      if (!paymentDay.exists) {
        t.set(paymentDayRef, {
          date: paymentObj.paidAt,
          total: total,
          day,
        });
      } else {
        t.update(paymentDayRef, {
          total: paymentDay.data().total + total,
        });
      }
      console.log(paymentDay.data());

      // make a payment in paymentHistory

      console.log(paymentHistory.data());
      if (!paymentHistory.exists) {
        t.set(paymentHistoryRef, {
          Email: currentUser
            ? currentUser.email && currentUser.email
            : admin.email,
          Name: currentUser
            ? currentUser.displayName && currentUser.displayName
            : admin.name,
          Id: currentUser ? currentUser.userId : "admin",
          uid: currentUser ? currentUser.uid : admin.adminId,
          Mobile: currentUser
            ? currentUser.mobileNo
              ? currentUser.mobileNo
              : ""
            : admin.mobileNo,
          ...paymentObj,
          day,
        });
      } else {
        alert("Your paymentId already exist. please try again later.");
      }
      console.log(paymentHistory.data());

      const newArray = parcelsArray.map((parcel) => {
        return { ...parcel, invoiceStatus: "Paid" };
      });

      console.log(parcelsArray[0]);
      console.log(newArray[0]);
      return newArray;
    });
    return res;
  } catch (e) {
    console.log("Transaction failure:", e);
    alert("Transaction failure");
    return [];
  }
};

const getDay = () => {
  const t = new Date();
  const dayInDigit = t.getDay();
  let day;
  if (dayInDigit == 0) {
    day = "Sunday";
  }
  if (dayInDigit == 1) {
    day = "Monday";
  }
  if (dayInDigit == 2) {
    day = "Tuesday";
  }
  if (dayInDigit == 3) {
    day = "Wednesday";
  }
  if (dayInDigit == 4) {
    day = "Thursday";
  }
  if (dayInDigit == 5) {
    day = "Friday";
  }
  if (dayInDigit == 6) {
    day = "Saturday";
  }
  return day;
};

export const getMultipleOrders = async (parcelIdArray) => {
  const ordersArray = [];
  for (let i = 0; i < parcelIdArray.length; i++) {
    const orderRef = firestore.doc(`orders/${parcelIdArray[i]}`);
    const snapShot = await orderRef.get();
    ordersArray.push(snapShot.data());
  }
  return ordersArray;
};

export const getAllBrands = async () => {
  const productsCollectionRef = firestore.collection("brands");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadBrand = async (productObj) => {
  const productRef = firestore.doc(`brands/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a brand with similar id");
  }
};
export const uploadfreeShipping = async (value) => {
  const productRef = firestore.doc(`freeShipping/freeShipping`);
  const snapShot = await productRef.get();

  if (!snapShot.exists) {
    try {
      await productRef.set({
        value: value,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    try {
      await productRef.update({
        value: value,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  }
};

export const updateBrand = async (productObj) => {
  const productRef = firestore.doc(`brands/${productObj.id}`);
  const product = await productRef.get();
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteBrand = async (id, parentId) => {
  const productRef = firestore.doc(`brands/${id}`);
  const childBrandsRef = firestore
    .collection(`brands`)
    .where("parentBrand", "==", id);
  const childBrands = await childBrandsRef.get();
  try {
    childBrands.forEach(async (doc) => {
      const productRef = firestore.doc(`brands/${doc.data().id}`);
      await productRef.update({
        parentBrand: parentId,
      });
    });
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};
export const getAllCoupons = async () => {
  const productsCollectionRef = firestore.collection("coupons");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadCoupon = async (productObj) => {
  const productRef = firestore.doc(`coupons/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a coupon with similar id");
  }
};

export const updateCoupon = async (productObj) => {
  const productRef = firestore.doc(`coupons/${productObj.id}`);
  const product = await productRef.get();
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteCoupon = async (id) => {
  const productRef = firestore.doc(`coupons/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getAllCategories = async () => {
  const productsCollectionRef = firestore.collection("categories");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};
export const getAllHomeScreenCategories = async () => {
  const productsCollectionRef = firestore
    .collection("categories")
    .where("homePage", "==", true);

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadCategory = async (productObj, homeCategoriesLength) => {
  const productRef = firestore.doc(`categories/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const singlCategoryProductsCollectionRef = firestore
        .collection("products")
        .where("checkedValues", "array-contains", productObj.id)
        .orderBy("id", "desc")
        .limit(10);
      const products = await singlCategoryProductsCollectionRef.get();
      console.log(products);
      if (productObj.homePage && productObj.homePosition) {
        // jodi homepage er hoy shekhetre dekhbo etar product gula already available ache kina. na thakle add korbo r thakle bad dibo
        products.forEach(async (doc) => {
          const productRef = firestore.doc(`homeProducts/${doc.data().id}`);
          const product = await productRef.get();
          if (product.exists) {
            // jodi product agei thake in that case product r add korbo na
          } else {
            // product jodi homeproducts te na thake tokhon add korbo
            productRef.set({
              ...doc.data(),
              categoryId: productObj.id,
            });
          }
        });
        const productsCollectionRef = firestore
          .collection("categories")
          .where("homePage", "==", true);
        const products = await productsCollectionRef.get();

        products.forEach(async (doc) => {
          const productRef2 = firestore.doc(`categories/${doc.data().id}`);
          const product2 = await productRef2.get();
          if (
            product2.data().homePosition >= productObj.homePosition &&
            product2.data().id != productObj.id
          ) {
            await productRef2.update({
              homePosition: Number(product2.data().homePosition) + 1,
            });
          }
        });
      } else {
        // jodi product homscreen te na hoy tokhon jodi homeproducts te product thake remove kore dibo
        products.forEach(async (doc) => {
          const productRef = firestore.doc(`homeProducts/${doc.data().id}`);
          const product = await productRef.get();
          if (product.exists) {
            // jodi product agei thake in that case product delete kore dibo. jehetu eta r homescreen te nai
            await productRef.delete();
          } else {
            // product jodi homeproducts te na thake tokhon kichu korar dorkar nai
          }
        });
      }
      const updatedSnapShot = await productRef.get();

      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a category with similar id");
  }
};

export const updateCategory = async (productObj, homeCategoriesLength) => {
  const productRef = firestore.doc(`categories/${productObj.id}`);
  const product = await productRef.get();
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const singlCategoryProductsCollectionRef = firestore
      .collection("products")
      .where("checkedValues", "array-contains", productObj.id)
      .orderBy("id", "desc")
      .limit(10);
    const products = await singlCategoryProductsCollectionRef.get();
    console.log(products);
    if (productObj.homePage && productObj.homePosition) {
      // jodi homepage er hoy shekhetre dekhbo etar product gula already available ache kina. na thakle add korbo r thakle bad dibo
      products.forEach(async (doc) => {
        const productRef = firestore.doc(`homeProducts/${doc.data().id}`);
        const product = await productRef.get();
        if (product.exists) {
          // jodi product agei thake in that case product r add korbo na
        } else {
          // product jodi homeproducts te na thake tokhon add korbo
          productRef.set({
            ...doc.data(),
            categoryId: productObj.id,
          });
        }
      });
      const productsCollectionRef = firestore
        .collection("categories")
        .where("homePage", "==", true);
      const products2 = await productsCollectionRef.get();
      products2.forEach(async (doc) => {
        const productRef2 = firestore.doc(`categories/${doc.data().id}`);
        const product2 = await productRef2.get();
        console.log(doc.data());
        // ekane proti ta category er product nibo 10 ta kore and save korbo homeProducts collection te

        if (product.data().homePosition) {
          // homePostion age thakle shekhetre only swap hobe oi duitar moddhe or
          if (
            product2.data().homePosition == productObj.homePosition &&
            product2.data().id != productObj.id
          ) {
            await productRef2.update({
              homePosition: product.data().homePosition,
            });
          }
        } else {
          if (
            product2.data().homePosition >= productObj.homePosition &&
            product2.data().id != productObj.id
          ) {
            await productRef2.update({
              homePosition: Number(product2.data().homePosition) + 1,
            });
          }
        }
      });
    } else {
      // jodi product homscreen te na hoy tokhon jodi homeproducts te product thake remove kore dibo
      products.forEach(async (doc) => {
        const productRef = firestore.doc(`homeProducts/${doc.data().id}`);
        const product = await productRef.get();
        if (product.exists) {
          // jodi product agei thake in that case product delete kore dibo. jehetu eta r homescreen te nai
          await productRef.delete();
        } else {
          // product jodi homeproducts te na thake tokhon kichu korar dorkar nai
        }
      });
    }
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteCategory = async (productObj, parentId) => {
  const productRef = firestore.doc(`categories/${productObj.id}`);
  const childCategoriesRef = firestore
    .collection(`categories`)
    .where("parentCategory", "==", productObj.id);
  const childCategories = await childCategoriesRef.get();
  try {
    childCategories.forEach(async (doc) => {
      const productRef = firestore.doc(`categories/${doc.data().id}`);
      await productRef.update({
        parentCategory: parentId,
      });
    });
    await productRef.delete();
    if (productObj.homePosition) {
      const productsCollectionRef = firestore
        .collection("categories")
        .where("homePage", "==", true);
      const products = await productsCollectionRef.get();

      products.forEach(async (doc) => {
        const productRef2 = firestore.doc(`categories/${doc.data().id}`);
        const product2 = await productRef2.get();
        if (
          product2.data().homePosition >= productObj.homePosition &&
          product2.data().id != productObj.id
        ) {
          await productRef2.update({
            homePosition: Number(product2.data().homePosition) - 1,
          });
        }
      });
    }
  } catch (error) {
    alert(error);
  }
};
export const getAllBanners = async () => {
  const productsCollectionRef = firestore.collection("banners");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadBanner = async (productObj) => {
  const productRef = firestore.doc(`banners/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (productObj.secondBanner) {
    const collectionRef = firestore
      .collection(`banners`)
      .where("secondBanner", "==", true);
    const collection = await collectionRef.get();
    collection.forEach(async (doc) => {
      const bannerRef = firestore.doc(`banners/${doc.data().id}`);
      await bannerRef.update({
        secondBanner: false,
      });
    });
  }
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a category with similar id");
  }
};

export const updateBanner = async (productObj) => {
  const productRef = firestore.doc(`banners/${productObj.id}`);
  const product = await productRef.get();
  if (productObj.secondBanner) {
    const collectionRef = firestore
      .collection(`banners`)
      .where("secondBanner", "==", true);
    const collection = await collectionRef.get();
    collection.forEach(async (doc) => {
      const bannerRef = firestore.doc(`banners/${doc.data().id}`);
      await bannerRef.update({
        secondBanner: false,
      });
    });
  }
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteBanner = async (id) => {
  const productRef = firestore.doc(`banners/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getAllTags = async () => {
  const productsCollectionRef = firestore.collection("tags");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadTag = async (productObj) => {
  const productRef = firestore.doc(`tags/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a tag with similar id");
  }
};

export const updateTag = async (productObj) => {
  const productRef = firestore.doc(`tags/${productObj.id}`);

  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteTag = async (id) => {
  const productRef = firestore.doc(`tags/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};
export const getAllAttributes = async () => {
  const productsCollectionRef = firestore.collection("attributes");
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadAttribute = async (productObj) => {
  const productRef = firestore.doc(`attributes/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
        enableVisibility: true,
        enableVariations: true,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a attribute with similar id");
  }
};

export const updateAttribute = async (productObj) => {
  const productRef = firestore.doc(`attributes/${productObj.id}`);
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteAttribute = async (id) => {
  const attrRef = firestore.doc(`attributes/${id}`);
  const termsRef = firestore
    .collection(`attributeTerms`)
    .where("parentId", "==", id);
  const terms = await termsRef.get();
  try {
    await attrRef.delete();
    terms.forEach(async (doc) => {
      const termRef = firestore.doc(`attributes/${doc.data().id}`);
      await termRef.delete();
    });
  } catch (error) {
    alert(error);
  }
};

export const getAllAttributeTerms = async (id) => {
  const productsCollectionRef = firestore
    .collection("attributeTerms")
    .where("parentId", "==", id);
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadAttributeTerm = async (productObj) => {
  const termRef = firestore.doc(`attributeTerms/${productObj.id}`);
  const attrRef = firestore.doc(`attributes/${productObj.parentId}`);
  const snapShot = await termRef.get();
  const attr = await attrRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await termRef.set({
        ...newProductObj,
      });
      await attrRef.update({
        terms: [...attr.data().terms, newProductObj],
      });
      const updatedSnapShot = await termRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a terms with similar id");
  }
};

export const fetchAllProducts = async (chunks) => {
  const promises = chunks.map((chunk) => {
    // Create a query for each chunk using the "in" operator
    const q = firestore.collection("products").where("id", "in", chunk);

    // Fetch documents for the query
    return q
      .get()
      .then((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
  });

  // Wait for all queries to resolve
  const results = await Promise.all(promises);

  // Flatten the array of arrays into a single array of documents
  return results.flat();
};

export const updateAttributeTerm = async (productObj) => {
  const termRef = firestore.doc(`attributeTerms/${productObj.id}`);
  const attrRef = firestore.doc(`attributes/${productObj.parentId}`);
  const attr = await attrRef.get();
  const newTerms = attr.data().terms.map((term) => {
    if (term.id == productObj.id) {
      return productObj;
    } else {
      return term;
    }
  });
  try {
    delete productObj.file;
    await termRef.update({ ...productObj });
    await attrRef.update({
      terms: newTerms,
    });
    const updatedSnapShot = await termRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteAttributeTerm = async (id, parentId) => {
  const termRef = firestore.doc(`attributeTerms/${id}`);
  const attrRef = firestore.doc(`attributes/${parentId}`);
  const attr = await attrRef.get();
  const newTerms = attr.data().terms.filter((term) => term.id !== id);
  try {
    await termRef.delete();
    await attrRef.update({
      terms: newTerms,
    });
  } catch (error) {
    alert(error);
  }
};

export const getAllCampaigns = async () => {
  const productsCollectionRef = firestore.collection("campaigns");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadCampaign = async (productObj) => {
  const productRef = firestore.doc(`campaigns/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (productObj.secondBanner) {
    const collectionRef = firestore
      .collection(`campaigns`)
      .where("secondBanner", "==", true);
    const collection = await collectionRef.get();
    collection.forEach(async (doc) => {
      const bannerRef = firestore.doc(`campaigns/${doc.data().id}`);
      await bannerRef.update({
        secondBanner: false,
      });
    });
  }
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a category with similar id");
  }
};

export const updateCampaign = async (productObj) => {
  const productRef = firestore.doc(`campaigns/${productObj.id}`);
  const product = await productRef.get();
  if (productObj.secondBanner) {
    const collectionRef = firestore
      .collection(`campaigns`)
      .where("secondBanner", "==", true);
    const collection = await collectionRef.get();
    collection.forEach(async (doc) => {
      const bannerRef = firestore.doc(`campaigns/${doc.data().id}`);
      await bannerRef.update({
        secondBanner: false,
      });
    });
  }
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteCampaign = async (id) => {
  const productRef = firestore.doc(`campaigns/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};
export const getAllAnnouncements = async () => {
  const productsCollectionRef = firestore.collection("announcements");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadAnnouncement = async (productObj) => {
  const productRef = firestore.doc(`announcements/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (productObj.secondBanner) {
    const collectionRef = firestore
      .collection(`announcements`)
      .where("secondBanner", "==", true);
    const collection = await collectionRef.get();
    collection.forEach(async (doc) => {
      const bannerRef = firestore.doc(`announcements/${doc.data().id}`);
      await bannerRef.update({
        secondBanner: false,
      });
    });
  }
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a category with similar id");
  }
};

export const updateAnnouncement = async (productObj) => {
  const productRef = firestore.doc(`announcements/${productObj.id}`);
  const product = await productRef.get();
  if (productObj.visible) {
    const productsCollectionRef = firestore.collection("announcements");
    const products = await productsCollectionRef.get();
    products.forEach(async (doc) => {
      const annoucementRef = firestore.doc(`announcements/${doc.data().id}`);
      await annoucementRef.update({
        ...doc.data(),
        visible: false,
      });
    });
  }
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteAnnouncement = async (id) => {
  const productRef = firestore.doc(`announcements/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getSingleMonthlyExpense = async (month) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("month", "==", month);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllMonthlyExpense = async () => {
  const expensesCollectionRef = firestore.collection("monthlyExpense");
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllPendingExpensesByDay = async (day) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("date", "==", day)
    .where("status", "==", "pending");
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const approveExpense = async (expense) => {
  const batch = firestore.batch();
  const expenseRef = firestore.doc(`dailyExpenses/${expense.id}`);

  // Get the expense document snapshot
  const expenseSnapShot = await expenseRef.get();
  console.log(expenseSnapShot.data());

  // Get references to related documents
  const categoryMonthlyExpenseRef = firestore.doc(
    `categoryMonthlyExpense/${expenseSnapShot.data().month}-${
      expenseSnapShot.data().category
    }-${expenseSnapShot.data().subCategory.replaceAll("/", "_")}`
  );
  const monthlyExpenseRef = firestore.doc(
    `monthlyExpense/${expenseSnapShot.data().month}`
  );

  // Get document snapshots
  const categoryMonthlyExpenseSnapShot = await categoryMonthlyExpenseRef.get();
  const monthlyExpenseSnapShot = await monthlyExpenseRef.get();

  // Update expense status
  batch.update(expenseRef, { status: "approved" });

  // Update related documents based on expense category
  if (expenseSnapShot.data().category === "SALARY") {
    const monthlySalaryRef = firestore.doc(
      `monthlySalary/${expenseSnapShot.data().month}`
    );
    const monthlySalarySnapShot = await monthlySalaryRef.get();
    if (monthlySalarySnapShot.exists) {
      batch.update(monthlySalaryRef, {
        amount:
          parseInt(monthlySalarySnapShot.data().amount) +
          parseInt(expenseSnapShot.data().amount),
      });
    } else {
      batch.set(monthlySalaryRef, {
        month: expenseSnapShot.data().month,
        amount: parseInt(expenseSnapShot.data().amount),
      });
    }
  } else if (
    expenseSnapShot.data().category === "LOAN" ||
    expenseSnapShot.data().category === "MONTHLY INSTALLMENT"
  ) {
    const customerRef = firestore.doc(
      `${
        expenseSnapShot.data().category === "LOAN"
          ? "customerLoans"
          : "customerInstallments"
      }/${expenseSnapShot.data().uid}`
    );
    const customerSnapShot = await customerRef.get();
    if (customerSnapShot.exists) {
      batch.update(customerRef, {
        amount:
          parseInt(customerSnapShot.data().amount) +
          parseInt(expenseSnapShot.data().amount),
        customer: expenseSnapShot.data().subCategory,
      });
    } else {
      batch.set(customerRef, {
        customer: expenseSnapShot.data().subCategory,
        amount: parseInt(expenseSnapShot.data().amount),
        uid: expenseSnapShot.data().uid,
      });
    }
  }

  // Update categorywise monthly expense
  if (categoryMonthlyExpenseSnapShot.exists) {
    if (expenseSnapShot.data().category == "SALARY") {
      batch.update(categoryMonthlyExpenseRef, {
        amount:
          parseInt(categoryMonthlyExpenseSnapShot.data().amount) +
          parseInt(expenseSnapShot.data().amount),
        paid:
          categoryMonthlyExpenseSnapShot.data().salary ==
          parseInt(categoryMonthlyExpenseSnapShot.data().amount) +
            parseInt(expenseSnapShot.data().amount)
            ? true
            : false,
      });
    } else {
      batch.update(categoryMonthlyExpenseRef, {
        amount:
          parseInt(categoryMonthlyExpenseSnapShot.data().amount) +
          parseInt(expenseSnapShot.data().amount),
      });
    }
  } else {
    batch.set(categoryMonthlyExpenseRef, {
      id: `${expenseSnapShot.data().month}-${expenseSnapShot.data().category}-${
        expenseSnapShot.data().subCategory
      }`,
      amount: parseInt(expenseSnapShot.data().amount),
      category: expenseSnapShot.data().category,
      subCategory: expenseSnapShot.data().subCategory,
      month: expenseSnapShot.data().month,
      paid: false,
      salary: 0,
    });
  }

  // Update monthly expense
  if (monthlyExpenseSnapShot.exists) {
    batch.update(monthlyExpenseRef, {
      amount:
        parseInt(monthlyExpenseSnapShot.data().amount) +
        parseInt(expenseSnapShot.data().amount),
    });
  } else {
    batch.set(monthlyExpenseRef, {
      id: `${expenseSnapShot.data().month}`,
      amount: parseInt(expenseSnapShot.data().amount),
    });
  }

  // Commit the batch
  try {
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error approving expense:", error);
    return false;
  }
};

export const getAllPendingExpenses = async () => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("status", "==", "pending");
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const deleteExpense = async (expenseId) => {
  const expenseRef = firestore.doc(`dailyExpenses/${expenseId}`);
  const snapShot = await expenseRef.get();
  console.log(snapShot.data());
  try {
    await expenseRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const updateExpense = async (expenseObj) => {
  const expenseRef = firestore.doc(`dailyExpenses/${expenseObj.id}`);
  try {
    await expenseRef.update({ ...expenseObj });
    const snapShot = await expenseRef.get();
    return snapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const uploadExpense = async (expenseObj) => {
  const expenseRef = firestore.doc(`dailyExpenses/${expenseObj.id}`);
  const snapShot = await expenseRef.get();
  if (!snapShot.exists) {
    try {
      await expenseRef.set({
        ...expenseObj,
      });
      console.log(snapShot.data());
      const uploadedSnapShot = await expenseRef.get();
      return uploadedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a expense with similar id,try again later");
  }
};

export const getAllExpenses = async (day) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("date", "==", day);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllOffices = async () => {
  const officesCollectionRef = firestore.collection("offices");
  try {
    const offices = await officesCollectionRef.get();
    const officesArray = [];
    offices.forEach((doc) => {
      officesArray.push(doc.data());
    });
    return officesArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadOffice = async (officeObj) => {
  const officeRef = firestore.doc(`offices/${officeObj.officeId}`);
  const snapShot = await officeRef.get();
  if (!snapShot.exists) {
    try {
      await officeRef.set({
        ...officeObj,
      });
      console.log(snapShot.data());
      const uploadedSnapShot = await officeRef.get();
      return uploadedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "there is already a office with similar name, please change the country name and try again"
    );
  }
};

export const updateOffice = async (officeObj) => {
  const officeRef = firestore.doc(`offices/${officeObj.officeId}`);
  try {
    await officeRef.update({ ...officeObj });
    const snapShot = await officeRef.get();
    return snapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteOffice = async (officeId) => {
  const officeRef = firestore.doc(`offices/${officeId}`);
  const snapShot = await officeRef.get();
  console.log(snapShot.data());
  try {
    await officeRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getSingleCashSummary = async () => {
  const date = new Date();
  const cashSummaryRef = firestore.doc(
    `cashSummary/${date.toLocaleDateString("en-GB").replaceAll("/", "-")}`
  );
  const cashSummary = await cashSummaryRef.get();
  if (cashSummary.exists) {
    return cashSummary.data();
  } else {
    let lastDay;
    for (let i = 0; i < 365; i++) {
      let [day, month, year] = date.toLocaleDateString("en-GB").split("/");
      let dateObj = new Date(year, parseInt(month - 1), day - i);
      let previousDate = new Date(dateObj.getTime().toString() - 86400000);
      const previousDayRef = firestore.doc(
        `cashSummary/${previousDate
          .toLocaleDateString("en-GB")
          .replaceAll("/", "-")}`
      );
      const previouseDay = await previousDayRef.get();
      if (previouseDay.exists) {
        lastDay = previouseDay.data();
        break;
      }
    }
    console.log(lastDay);
    await cashSummaryRef.set({
      month: getMonthName(),
      date: date.toLocaleDateString("en-GB"),
      previousCash:
        lastDay && lastDay.remainingBalance
          ? parseInt(lastDay.remainingBalance)
          : 0,
      totalCashIns: 0,
      totalCashOuts: 0,
      remainingBalance:
        lastDay && lastDay.remainingBalance
          ? parseInt(lastDay.remainingBalance)
          : 0,
    });
    const updatedSnapShot = await cashSummaryRef.get();
    return updatedSnapShot.data();
  }
};

export const uploadCashIn = async (cashInObj) => {
  const cashInRef = firestore.doc(`dailyCashIn/${cashInObj.id}`);
  const snapShot = await cashInRef.get();
  if (!snapShot.exists) {
    try {
      await cashInRef.set({
        ...cashInObj,
      });
      console.log(snapShot.data());
      const uploadedSnapShot = await cashInRef.get();
      return uploadedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a cash in with similar id,try again later");
  }
};

export const updateCashIn = async (cashInObj) => {
  const cashInRef = firestore.doc(`dailyCashIn/${cashInObj.id}`);
  try {
    await cashInRef.update({ ...cashInObj });
    const snapShot = await cashInRef.get();
    return snapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const getAllDocumentExpressRates = async () => {
  const expressRatesDocumentsCollectionRef = firestore.collection(
    "expressRatesDocuments"
  );
  try {
    const expressRatesDocuments =
      await expressRatesDocumentsCollectionRef.get();
    const expressRatesDocumentsArray = [];
    expressRatesDocuments.forEach((doc) => {
      expressRatesDocumentsArray.push(doc.data());
    });
    return expressRatesDocumentsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllEmployees = async () => {
  const employeesCollectionRef = firestore.collection("employees");
  try {
    const employees = await employeesCollectionRef.get();
    const employeesArray = [];
    employees.forEach((doc) => {
      employeesArray.push(doc.data());
    });
    return employeesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllMonthlyCashSummary = async () => {
  const expensesCollectionRef = firestore.collection("cashSummary");
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllMonthlyCashIn = async () => {
  const expensesCollectionRef = firestore.collection("monthlyCashIn");
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllMonthlySalary = async () => {
  const expensesCollectionRef = firestore.collection(`monthlySalary`);

  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getSingleCategoryProducts = async (categories, startAfter) => {
  let productsCollectionRef;
  console.log(startAfter);
  if (startAfter) {
    productsCollectionRef = firestore
      .collection("products")
      .where("checkedValues", "array-contains-any", categories)
      .orderBy("name")
      .startAfter(startAfter);
  } else {
    productsCollectionRef = firestore
      .collection("products")
      .where("checkedValues", "array-contains-any", categories)
      .orderBy("name");
  }
  const products = await productsCollectionRef.get();
  const lastProduct = products.docs[products.docs.length - 1];

  try {
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return { productsArray, lastProduct };
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

export const getSingleBrandProducts = async (brandId, startAfter) => {
  let productsCollectionRef;
  console.log(startAfter);
  if (startAfter) {
    productsCollectionRef = firestore
      .collection("products")
      .where("checkedValues2", "array-contains", brandId)
      .orderBy("id", "desc")
      .startAfter(startAfter);
  } else {
    productsCollectionRef = firestore
      .collection("products")
      .where("checkedValues2", "array-contains", brandId)
      .orderBy("id", "desc");
  }
  const products = await productsCollectionRef.get();
  const lastProduct = products.docs[products.docs.length - 1];
  try {
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return { productsArray, lastProduct };
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

export const getAllMonthly = async (category, subCategory) => {
  if (category == "REFUND") {
    const expensesCollectionRef = firestore
      .collection(`categoryMonthlyExpense`)
      .where("category", "==", category);

    try {
      const expenses = await expensesCollectionRef.get();
      const expensesArray = [];
      expenses.forEach((doc) => {
        expensesArray.push(doc.data());
      });
      return expensesArray;
    } catch (error) {
      alert(error);
    }
  } else {
    const expensesCollectionRef = firestore
      .collection(`categoryMonthlyExpense`)
      .where("category", "==", category)
      .where("subCategory", "==", subCategory);
    try {
      const expenses = await expensesCollectionRef.get();
      const expensesArray = [];
      expenses.forEach((doc) => {
        expensesArray.push(doc.data());
      });
      return expensesArray;
    } catch (error) {
      alert(error);
    }
  }
};

export const getSingleMonthlyCashSummary = async (month) => {
  const expensesCollectionRef = firestore
    .collection("cashSummary")
    .where("month", "==", month);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getSingleMonthlyCashIn = async (month) => {
  const expensesCollectionRef = firestore
    .collection("dailyCashIn")
    .where("month", "==", month);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getSingleMonthly = async (month, category, subCategory) => {
  if (category === "INVEST") {
    const expensesCollectionRef = firestore
      .collection("dailyExpenses")
      .where("month", "==", month)
      .where("category", "==", category)
      .where("subCategory", "==", subCategory);
    const cashInCollectionRef = firestore
      .collection("dailyCashIn")
      .where("month", "==", month)
      .where("category", "==", category)
      .where("subCategory", "==", subCategory);
    try {
      const expenses = await expensesCollectionRef.get();
      const cashIns = await cashInCollectionRef.get();
      const expensesArray = [];
      expenses.forEach((doc) => {
        expensesArray.push(doc.data());
      });

      cashIns.forEach((doc) => {
        expensesArray.push(doc.data());
      });
      return expensesArray.sort((a, b) => a.id - b.id);
    } catch (error) {
      alert(error);
    }
  } else if (category == "REFUND") {
    const expensesCollectionRef = firestore
      .collection("dailyExpenses")
      .where("month", "==", month)
      .where("category", "==", category);

    try {
      const expenses = await expensesCollectionRef.get();
      const expensesArray = [];
      expenses.forEach((doc) => {
        expensesArray.push(doc.data());
      });
      return expensesArray;
    } catch (error) {
      alert(error);
    }
  } else {
    const expensesCollectionRef = firestore
      .collection("dailyExpenses")
      .where("month", "==", month)
      .where("category", "==", category)
      .where("subCategory", "==", subCategory);
    try {
      const expenses = await expensesCollectionRef.get();
      const expensesArray = [];
      expenses.forEach((doc) => {
        expensesArray.push(doc.data());
      });
      return expensesArray;
    } catch (error) {
      alert(error);
    }
  }
};

export const getSingleMonthlySalary = async (month, category) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("month", "==", month)
    .where("category", "==", category);

  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};
export const getSingleMonthlyLoanCashIn = async (month, category) => {
  const cashInsCollectionRef = firestore
    .collection("dailyCashIn")
    .where("month", "==", month)
    .where("category", "==", category);

  try {
    const cashIns = await cashInsCollectionRef.get();
    const cashInsArray = [];
    cashIns.forEach((doc) => {
      cashInsArray.push(doc.data());
    });
    return cashInsArray;
  } catch (error) {
    alert(error);
  }
};
export const getSingleMonthlyLoanCashOut = async (month, category) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("month", "==", month)
    .where("category", "==", category);

  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllPendingCashInByDay = async (day) => {
  const cashInsCollectionRef = firestore
    .collection("dailyCashIn")
    .where("date", "==", day)
    .where("status", "==", "pending");
  try {
    const cashIns = await cashInsCollectionRef.get();
    const cashInsArray = [];
    cashIns.forEach((doc) => {
      cashInsArray.push(doc.data());
    });
    return cashInsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllPendingCashIns = async () => {
  const cashInsCollectionRef = firestore
    .collection("dailyCashIn")
    .where("status", "==", "pending");
  try {
    const cashIns = await cashInsCollectionRef.get();
    const cashInsArray = [];
    cashIns.forEach((doc) => {
      cashInsArray.push(doc.data());
    });
    return cashInsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllLoansCashOuts = async () => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("category", "==", "LOAN");
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllLoansCashIns = async () => {
  const cashInsCollectionRef = firestore
    .collection("dailyCashIn")
    .where("category", "==", "LOAN");
  try {
    const cashIns = await cashInsCollectionRef.get();
    const cashInsArray = [];
    cashIns.forEach((doc) => {
      cashInsArray.push(doc.data());
    });
    return cashInsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllLoansCashOutCustomer = async (customer) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("category", "==", "LOAN")
    .where("uid", "==", customer);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getSingleCustomerLoan = async (customer) => {
  const loanRef = firestore.doc(`customerLoans/${customer}`);
  try {
    const customerLoan = await loanRef.get();
    return customerLoan.data();
  } catch (error) {
    alert(error);
  }
};

export const getAllInstallmentsCashOutCustomer = async (customer) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("category", "==", "MONTHLY INSTALLMENT")
    .where("uid", "==", customer);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllLoansCashInCustomer = async (customer) => {
  const cashInsCollectionRef = firestore
    .collection("dailyCashIn")
    .where("category", "==", "LOAN")
    .where("uid", "==", customer);
  try {
    const cashIns = await cashInsCollectionRef.get();
    const cashInsArray = [];
    cashIns.forEach((doc) => {
      cashInsArray.push(doc.data());
    });
    return cashInsArray;
  } catch (error) {
    alert(error);
  }
};

export const deleteCashIn = async (cashId) => {
  const cashInRef = firestore.doc(`dailyCashIn/${cashId}`);
  const snapShot = await cashInRef.get();
  console.log(snapShot.data());
  try {
    await cashInRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const deleteEmployee = async (employeeId) => {
  const employeeRef = firestore.doc(`employees/${employeeId}`);
  const snapShot = await employeeRef.get();
  console.log(snapShot.data());
  try {
    await employeeRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getAllCustomerLoans = async () => {
  const usersCollectionRef = firestore.collection("customerLoans");
  try {
    const users = await usersCollectionRef.get();
    const usersArray = [];
    users.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      usersArray.push({ uid: doc.id, ...doc.data() });
    });
    return usersArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllCustomerInstallments = async () => {
  const usersCollectionRef = firestore.collection("customerInstallments");
  try {
    const users = await usersCollectionRef.get();
    const usersArray = [];
    users.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      usersArray.push({ uid: doc.id, ...doc.data() });
    });
    return usersArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllCnfs = async () => {
  const cnfsCollectionRef = firestore.collection("cnfs");
  try {
    const cnfs = await cnfsCollectionRef.get();
    const cnfsArray = [];
    cnfs.forEach((doc) => {
      cnfsArray.push(doc.data());
    });
    return cnfsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadCnf = async (cnfObj) => {
  const cnfRef = firestore.doc(`cnfs/${cnfObj.cnfId}`);
  const snapShot = await cnfRef.get();
  if (!snapShot.exists) {
    try {
      await cnfRef.set({
        ...cnfObj,
      });
      console.log(snapShot.data());
      const uploadedSnapShot = await cnfRef.get();
      return uploadedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "there is already a cnf with similar name, please change the name and try again"
    );
  }
};

export const updateCnf = async (cnfObj) => {
  const cnfRef = firestore.doc(`cnfs/${cnfObj.cnfId}`);
  try {
    await cnfRef.update({ ...cnfObj });
    const snapShot = await cnfRef.get();
    return snapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteCnf = async (cnfId) => {
  const cnfRef = firestore.doc(`cnfs/${cnfId}`);
  const snapShot = await cnfRef.get();
  console.log(snapShot.data());
  try {
    await cnfRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const uploadCnfBill = async (billObj) => {
  const batch = firestore.batch();
  const cnfBillRef = firestore.doc(`cnfBills/${billObj.id}`);
  const cnfBillMonthRef = firestore.doc(`cnfBillMonths/${billObj.month}`);

  // Get the documents
  const cnfBillSnapShot = await cnfBillRef.get();
  const cnfBillMonthSnapShot = await cnfBillMonthRef.get();

  // Check if the bill document exists
  if (!cnfBillSnapShot.exists) {
    try {
      // Set the bill document
      batch.set(cnfBillRef, {
        ...billObj,
      });
      console.log(cnfBillSnapShot.data());
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a bill with similar id, please try again later");
  }

  // Check if the bill month document exists
  if (!cnfBillMonthSnapShot.exists) {
    // Set the bill month document
    batch.set(cnfBillMonthRef, { month: billObj.month });
  }

  // Commit the batch
  await batch.commit();

  return true;
};

export const getAllMonthsCnfBill = async (month) => {
  const monthRef = firestore.doc(`cnfBillMonths/${month}`);
  const monthdata = await monthRef.get();

  if (!monthdata.exists) {
    await monthRef.set({
      month: month,
    });
  }

  const monthsCollectionRef = firestore.collection(`cnfBillMonths`);
  try {
    const expenses = await monthsCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllCnfBills = async (month, name) => {
  const cnfsCollectionRef = firestore
    .collection("cnfBills")
    .where("month", "==", month)
    .where("cnf", "==", name);
  try {
    const cnfs = await cnfsCollectionRef.get();
    const cnfsArray = [];
    cnfs.forEach((doc) => {
      cnfsArray.push(doc.data());
    });
    return cnfsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllCnfExpenses = async (month, name) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("month", "==", month)
    .where("subCategory", "==", name);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllCnfBillsAllMonths = async (name) => {
  const cnfsCollectionRef = firestore
    .collection("cnfBills")
    .where("cnf", "==", name);
  try {
    const cnfs = await cnfsCollectionRef.get();
    const cnfsArray = [];
    cnfs.forEach((doc) => {
      cnfsArray.push(doc.data());
    });
    return cnfsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllCnfExpensesAllMonths = async (name) => {
  const expensesCollectionRef = firestore
    .collection("dailyExpenses")
    .where("subCategory", "==", name);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const updateEmployee = async (employeeObj) => {
  const employeeRef = firestore.doc(`employees/${employeeObj.employeeId}`);
  try {
    await employeeRef.update({ ...employeeObj });
    const snapShot = await employeeRef.get();
    return snapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const updateSalary = async (employee) => {
  const categoryMonthlyExpenseRef = firestore.doc(
    `categoryMonthlyExpense/${employee.id}`
  );
  const categoryMonthlyExpnese = await categoryMonthlyExpenseRef.get();
  await categoryMonthlyExpenseRef.update({
    ...categoryMonthlyExpnese.data(),
    salary: employee.salary,
  });
  const updatedSnapShot = await categoryMonthlyExpenseRef.get();
  return updatedSnapShot.data();
};

export const uploadEmployee = async (employeeObj) => {
  const employeeRef = firestore.doc(`employees/${employeeObj.employeeId}`);
  const snapShot = await employeeRef.get();
  if (!snapShot.exists) {
    try {
      await employeeRef.set({
        ...employeeObj,
      });
      console.log(snapShot.data());
      const uploadedSnapShot = await employeeRef.get();
      return uploadedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "there is already a employee with similar name, please change the name and try again"
    );
  }
};

export const getAllFunds = async () => {
  const expensesCollectionRef = firestore
    .collection(`dailyExpenses`)
    .where("category", "==", "FUND");

  const cashInCollectionRef = firestore
    .collection(`dailyCashIn`)
    .where("category", "==", "FUND");

  try {
    const expenses = await expensesCollectionRef.get();
    const cashIns = await cashInCollectionRef.get();
    const expensesArray = [];
    const cashInsArray = [];
    cashIns.forEach((doc) => {
      cashInsArray.push({ ...doc.data(), type: "cashIn" });
    });
    expenses.forEach((doc) => {
      expensesArray.push({ ...doc.data(), type: "expense" });
    });
    let mergedArray = [...expensesArray, ...cashInsArray];
    return mergedArray.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error) {
    alert(error);
  }
};

export const getAllCashIns = async (day) => {
  const expensesCollectionRef = firestore
    .collection("dailyCashIn")
    .where("date", "==", day);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });
    return expensesArray;
  } catch (error) {
    alert(error);
  }
};

export const createMonth = async () => {
  const date = new Date();
  const monthRef = firestore.doc(`months/${getMonthName()}`);
  const month = await monthRef.get();
  if (month.exists) {
    let monthsArray = [];
    const monthsCollectionRef = firestore.collection("months");
    const monthsCollection = await monthsCollectionRef.get();
    monthsCollection.forEach((doc) => {
      monthsArray.push(doc.data());
    });
    return monthsArray;
  } else {
    await monthRef.set({
      month: getMonthName(),
    });
    let monthsArray = [];
    const monthsCollectionRef = firestore.collection("months");
    const monthsCollection = await monthsCollectionRef.get();
    monthsCollection.forEach((doc) => {
      monthsArray.push(doc.data());
    });
    return monthsArray;
  }
};
export const getMonthName = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date();
  return `${monthNames[d.getMonth()]},${d.getFullYear()}`;
};

export const approveCashIn = async (expense) => {
  const batch = firestore.batch();
  const expenseRef = firestore.doc(`dailyCashIn/${expense.id}`);

  // Get the expense document snapshot
  const expenseSnapShot = await expenseRef.get();
  console.log(expenseSnapShot.data());

  // Get references to related documents
  const monthlyExpenseRef = firestore.doc(
    `monthlyCashIn/${expenseSnapShot.data().month}`
  );

  // Get document snapshots
  const monthlyExpenseSnapShot = await monthlyExpenseRef.get();

  // Update expense status
  batch.update(expenseRef, { status: "approved" });

  // Update related documents based on expense category
  if (expenseSnapShot.data().category === "LOAN") {
    const customerRef = firestore.doc(
      `customerLoans/${expenseSnapShot.data().uid}`
    );
    const customerSnapShot = await customerRef.get();
    if (customerSnapShot.exists) {
      batch.update(customerRef, {
        amount:
          parseInt(customerSnapShot.data().amount) -
          parseInt(expenseSnapShot.data().amount),
        customer: expenseSnapShot.data().subCategory,
      });
    } else {
      batch.set(customerRef, {
        customer: expenseSnapShot.data().subCategory,
        amount: -parseInt(expenseSnapShot.data().amount),
        uid: expenseSnapShot.data().uid,
      });
    }
  } else if (expenseSnapShot.data().category === "INVEST") {
    const categoryMonthlyExpenseRef = firestore.doc(
      `categoryMonthlyExpense/${expenseSnapShot.data().month}-${
        expenseSnapShot.data().category
      }-${expenseSnapShot.data().subCategory.replaceAll("/", "_")}`
    );
    const categoryMonthlyExpenseSnapShot =
      await categoryMonthlyExpenseRef.get();
    if (categoryMonthlyExpenseSnapShot.exists) {
      batch.update(categoryMonthlyExpenseRef, {
        amount:
          parseInt(categoryMonthlyExpenseSnapShot.data().amount) -
          parseInt(expenseSnapShot.data().amount),
      });
    } else {
      batch.set(categoryMonthlyExpenseRef, {
        id: `${expenseSnapShot.data().month}-${
          expenseSnapShot.data().category
        }-${expenseSnapShot.data().subCategory}`,
        amount: -parseInt(expenseSnapShot.data().amount),
        category: expenseSnapShot.data().category,
        subCategory: expenseSnapShot.data().subCategory,
        month: expenseSnapShot.data().month,
        paid: false,
        salary: 0,
      });
    }
  }

  // Update monthly expense
  if (monthlyExpenseSnapShot.exists) {
    batch.update(monthlyExpenseRef, {
      amount:
        parseInt(monthlyExpenseSnapShot.data().amount) +
        parseInt(expenseSnapShot.data().amount),
    });
  } else {
    batch.set(monthlyExpenseRef, {
      id: `${expenseSnapShot.data().month}`,
      amount: parseInt(expenseSnapShot.data().amount),
    });
  }

  // Commit the batch
  try {
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error approving cash-in:", error);
    return false;
  }
};

export const createSalaryMonth = async (month, employee) => {
  const categoryMonthlyExpenseRef = firestore.doc(
    `categoryMonthlyExpense/${month}-SALARY-${employee.name}`
  );
  const categoryMonthlyExpnese = await categoryMonthlyExpenseRef.get();
  if (!categoryMonthlyExpnese.exists) {
    await categoryMonthlyExpenseRef.set({
      id: `${month}-SALARY-${employee.name}`,
      amount: 0,
      category: "SALARY",
      subCategory: employee.name,
      month: month,
      paid: false,
      salary: 0,
    });
  }
};

export const getMonth = async (employee, month) => {
  const expensesCollectionRef = firestore
    .collection(`categoryMonthlyExpense`)
    .where("category", "==", "SALARY")
    .where("subCategory", "==", employee);
  try {
    const expenses = await expensesCollectionRef.get();
    const expensesArray = [];
    expenses.forEach((doc) => {
      expensesArray.push(doc.data());
    });

    const unPaidMonths = expensesArray.filter((expense) => !expense.paid);
    return unPaidMonths;
  } catch (error) {
    alert(error);
  }
};

export const updateCashSummaryCashOut = async (cashOutMonth, date, total) => {
  const [day, month, year] = date.split("/");
  let today = new Date();
  let expenseDate = new Date(year, parseInt(month - 1), day);

  const diffTime = Math.abs(today - expenseDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log(diffDays + " days");
  // get the last day remaining balance and update today's cash
  const cashSummaryRef = firestore.doc(
    `cashSummary/${date.replaceAll("/", "-")}`
  );

  let lastDay;
  for (let i = 1; i < 365; i++) {
    let dateObj = new Date(year, parseInt(month - 1), day - i);
    let previousDate = new Date(dateObj.getTime().toString() - 86400000);
    const previousDayRef = firestore.doc(
      `cashSummary/${previousDate
        .toLocaleDateString("en-GB")
        .replaceAll("/", "-")}`
    );
    const previouseDay = await previousDayRef.get();
    if (previouseDay.exists) {
      lastDay = previouseDay.data();
      break;
    }
  }
  console.log(lastDay);
  const cashSummary = await cashSummaryRef.get();
  if (cashSummary.exists) {
    cashSummaryRef.update({
      totalCashOuts:
        parseInt(cashSummary.data().totalCashOuts) + parseInt(total),
      remainingBalance:
        parseInt(cashSummary.data().remainingBalance) - parseInt(total),
    });
  } else {
    cashSummaryRef.set({
      month: cashOutMonth,
      date: date,
      previousCash: parseInt(lastDay.remainingBalance || 0),
      totalCashIns: 0,
      totalCashOuts: total,
      remainingBalance:
        parseInt(lastDay.remainingBalance || 0) - parseInt(total),
    });
  }

  // update every next day
  if (diffDays > 0) {
    for (let i = 1; i < parseInt(diffDays + 1); i++) {
      let dateObj = new Date(
        year,
        parseInt(parseInt(month) - 1),
        parseInt(day) + i
      );
      dateObj.setDate(dateObj.getDate());

      console.log(dateObj.toLocaleDateString("en-GB").replaceAll("/", "-"));
      const nextDayRef = firestore.doc(
        `cashSummary/${dateObj
          .toLocaleDateString("en-GB")
          .replaceAll("/", "-")}`
      );
      const nextDay = await nextDayRef.get();
      console.log(nextDay.data());
      if (nextDay.exists) {
        await nextDayRef.update({
          previousCash: parseInt(nextDay.data().previousCash) - parseInt(total),
          remainingBalance:
            parseInt(nextDay.data().remainingBalance) - parseInt(total),
        });
      }
    }
  }
};
export const updateCashSummaryCashIn = async (cashInMonth, date, total) => {
  const [day, month, year] = date.split("/");
  let today = new Date();
  let expenseDate = new Date(year, parseInt(month - 1), day);

  const diffTime = Math.abs(today - expenseDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log(diffDays + " days");
  // get the last day remaining balance and update today's cash
  const cashSummaryRef = firestore.doc(
    `cashSummary/${date.replaceAll("/", "-")}`
  );

  let lastDay;
  for (let i = 1; i < 365; i++) {
    let dateObj = new Date(year, parseInt(month - 1), day - i);
    let previousDate = new Date(dateObj.getTime().toString() - 86400000);
    const previousDayRef = firestore.doc(
      `cashSummary/${previousDate
        .toLocaleDateString("en-GB")
        .replaceAll("/", "-")}`
    );
    const previouseDay = await previousDayRef.get();
    if (previouseDay.exists) {
      lastDay = previouseDay.data();
      break;
    }
  }
  console.log(lastDay);
  const cashSummary = await cashSummaryRef.get();
  if (cashSummary.exists) {
    cashSummaryRef.update({
      totalCashIns: parseInt(cashSummary.data().totalCashIns) + parseInt(total),
      remainingBalance:
        parseInt(cashSummary.data().remainingBalance) + parseInt(total),
    });
  } else {
    cashSummaryRef.set({
      month: cashInMonth,
      date: date,
      previousCash: parseInt(lastDay.remainingBalance || 0),
      totalCashIns: parseInt(total),
      totalCashOuts: 0,
      remainingBalance:
        parseInt(lastDay.remainingBalance || 0) + parseInt(total),
    });
  }

  // update every next day
  if (diffDays > 0) {
    for (let i = 1; i < parseInt(diffDays + 1); i++) {
      let dateObj = new Date(
        year,
        parseInt(parseInt(month) - 1),
        parseInt(day) + i
      );
      dateObj.setDate(dateObj.getDate());

      console.log(dateObj.toLocaleDateString("en-GB").replaceAll("/", "-"));
      const nextDayRef = firestore.doc(
        `cashSummary/${dateObj
          .toLocaleDateString("en-GB")
          .replaceAll("/", "-")}`
      );
      const nextDay = await nextDayRef.get();
      console.log(nextDay.data());
      if (nextDay.exists) {
        await nextDayRef.update({
          previousCash: parseInt(nextDay.data().previousCash) + parseInt(total),
          remainingBalance:
            parseInt(nextDay.data().remainingBalance) + parseInt(total),
        });
      }
    }
  }
};

export const getAllScreenShot = async () => {
  const cnfsCollectionRef = firestore.collection("screenshots");
  try {
    const cnfs = await cnfsCollectionRef.get();
    const cnfsArray = [];
    cnfs.forEach((doc) => {
      cnfsArray.push(doc.data());
    });
    return cnfsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadScreenShot = async (cnfObj) => {
  const cnfRef = firestore.doc(`screenshots/${cnfObj.id}`);
  const snapShot = await cnfRef.get();
  if (!snapShot.exists) {
    try {
      await cnfRef.set({
        ...cnfObj,
      });
      console.log(snapShot.data());
      const uploadedSnapShot = await cnfRef.get();
      return uploadedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "there is already a cnf with similar name, please change the name and try again"
    );
  }
};

export const updateScreenShot = async (cnfObj) => {
  const cnfRef = firestore.doc(`screenshots/${cnfObj.id}`);
  try {
    await cnfRef.update({ ...cnfObj });
    const snapShot = await cnfRef.get();
    return snapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteScreenShot = async (cnfId) => {
  const cnfRef = firestore.doc(`screenshots/${cnfId}`);
  const snapShot = await cnfRef.get();
  console.log(snapShot.data());
  try {
    await cnfRef.delete();
  } catch (error) {
    alert(error);
  }
};
