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

export const getAllProducts = async () => {
  const productsCollectionRef = firestore.collection("products");
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
  try {
    await orderRef.update({
      orderObj,
    });
    const updatedSnapShot = await orderRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
    return order.data();
  }
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
      const updatedSnapShot = await productRef.get();
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
              homePosition: Number(product2.data().homePosition) + 1,
            });
          }
        });
      }
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
    const updatedSnapShot = await productRef.get();
    if (productObj.homePosition) {
      const productsCollectionRef = firestore
        .collection("categories")
        .where("homePage", "==", true);
      const products = await productsCollectionRef.get();

      products.forEach(async (doc) => {
        const productRef2 = firestore.doc(`categories/${doc.data().id}`);
        const product2 = await productRef2.get();
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
    }
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
