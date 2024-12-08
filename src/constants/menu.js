import {
  Home,
  Box,
  DollarSign,
  Tag,
  Clipboard,
  Camera,
  AlignLeft,
  UserPlus,
  Users,
  Chrome,
  BarChart,
  Settings,
  Archive,
  LogIn,
  MessageCircle,
} from "react-feather";

export const MENUITEMSFORADMIN = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: Home,
    type: "link",
    badgeType: "primary",
    active: false,
  },
  {
    path: "/messages",
    title: "Messages",
    icon: MessageCircle,
    type: "link",
    badgeType: "primary",
    active: false,
  },
  {
    title: "Products",
    icon: Box,
    type: "sub",
    active: false,
    children: [
      {
        path: "/products/physical/all-products",
        title: "All Products",
        type: "link",
      },

      {
        path: "/products/physical/add-product",
        title: "Add Product",
        type: "link",
      },
      {
        path: "/products/physical/brands",
        title: "Brands",
        type: "link",
      },
      {
        path: "/products/physical/categories",
        title: "Categories",
        type: "link",
      },
      {
        path: "/products/physical/campaigns",
        title: "Campaigns",
        type: "link",
      },
      {
        path: "/products/physical/banners",
        title: "Banners",
        type: "link",
      },
      {
        path: "/products/physical/shop-by-concern",
        title: "Shop By Concern",
        type: "link",
      },
      {
        path: "/products/physical/attributes",
        title: "Attributes",
        type: "link",
      },
      {
        path: "/products/physical/reviews",
        title: "Reviews",
        type: "link",
      },
    ],
  },
  {
    title: "Coupons",
    icon: Box,
    type: "sub",
    active: false,
    children: [
      {
        path: "/coupons/physical/all-coupons",
        title: "All Coupons",
        type: "link",
      },
    ],
  },
  // {
  //   title: "Orders",
  //   icon: DollarSign,
  //   type: "sub",
  //   active: false,
  //   children: [
  //     { path: "/sales/orders", title: "All Orders", type: "link" },
  //     { path: "/sales/order_pending", title: "Pending Orders", type: "link" },
  //     {
  //       path: "/sales/payment_approved",
  //       title: "Payment Approved",
  //       type: "link",
  //     },
  //     { path: "/sales/ordered", title: "Ordered", type: "link" },
  //     {
  //       path: "/sales/china_warehouse",
  //       title: "China Warehouse",
  //       type: "link",
  //     },
  //     { path: "/sales/in-shipping", title: "In Shipment", type: "link" },
  //     { path: "/sales/in_stock", title: "In stock", type: "link" },
  //     { path: "/sales/delivered", title: "Delivered", type: "link" },
  //   ],
  // },
  {
    title: "Orders",
    icon: Clipboard,
    type: "sub",
    active: false,
    children: [
      { path: "/orders/Processing", title: "Processing", type: "link" },
      { path: "/orders/Confirmed", title: "Confirmed", type: "link" },
      { path: "/orders/Packing", title: "Packing", type: "link" },
      {
        path: "/orders/Delivered",
        title: "Delivered",
        type: "link",
      },
    ],
  },
  // {
  //   title: "Product Request",
  //   icon: Clipboard,
  //   type: "sub",
  //   active: false,
  //   children: [
  //     { path: "/product-request/new", title: "New Request", type: "link" },
  //     {
  //       path: "/product-request/rates-given",
  //       title: "Rates Given",
  //       type: "link",
  //     },
  //     { path: "/product-request/paid", title: "Paid", type: "link" },
  //     { path: "/product-request/ordered", title: "Ordered", type: "link" },
  //     { path: "/product-request/delivered", title: "Delivered", type: "link" },
  //   ],
  // },
  // {
  //   title: "Shipment Request",
  //   icon: Clipboard,
  //   type: "sub",
  //   active: false,
  //   children: [
  //     { path: "/shipment-request/new", title: "New Request", type: "link" },
  //     {
  //       path: "/shipment-request/rates-given",
  //       title: "Rates Given",
  //       type: "link",
  //     },
  //     {
  //       path: "/shipment-request/received-in-warehouse",
  //       title: "Received in Warehouse",
  //       type: "link",
  //     },
  //     { path: "/shipment-request/delivered", title: "Delivered", type: "link" },
  //     { path: "/shipment-request/paid", title: "Paid", type: "link" },
  //   ],
  // },
  // {
  //   title: "Payment Request",
  //   icon: Clipboard,
  //   type: "sub",
  //   active: false,
  //   children: [
  //     {
  //       path: "/payment-request/pending",
  //       title: "Booking Request",
  //       type: "link",
  //     },
  //     {
  //       path: "/payment-request-order/pending",
  //       title: "Order Request",
  //       type: "link",
  //     },
  //   ],
  // },
  // {
  //   title: "Payments",
  //   icon: Tag,
  //   type: "sub",
  //   active: false,
  //   children: [
  //     {
  //       path: "/payments/unVerified",
  //       title: "Unverified Payments",
  //       type: "link",
  //     },
  //     { path: "/payments/verified", title: "Verified Payments", type: "link" },
  //   ],
  // },
  {
    title: "Product to order",
    icon: Clipboard,
    type: "sub",
    active: false,
    children: [
      {
        path: "/pages/product-to-order",
        title: "Product to order",
        type: "link",
      },
    ],
  },
  // {
  //     title: 'Media', path: '/media', icon: Camera, type: 'link', active: false
  // },
  // {
  //     title: 'Menus', icon: AlignLeft, type: 'sub', active: false, children: [
  //         { path: '/menus/list-menu', title: 'List Menu', type: 'link' },
  //         { path: '/menus/create-menu', title: 'Create Menu', type: 'link' },
  //     ]
  // },
  {
    title: "Users",
    icon: UserPlus,
    type: "sub",
    active: false,
    children: [
      { path: "/users/list-user", title: "User List", type: "link" },
      // { path: '/users/create-user', title: 'Create User', type: 'link' },
    ],
  },
  {
    title: "Invoices",
    path: "/invoices",
    icon: Archive,
    type: "link",
    active: false,
  },
  {
    title: "Register a manager",
    path: "/",
    icon: LogIn,
    type: "link",
    active: false,
  },
];

export const MENUITEMSFORAGENT = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: Home,
    type: "link",
    badgeType: "primary",
    active: false,
  },
  {
    title: "Products",
    icon: Box,
    type: "sub",
    active: false,
    children: [
      {
        path: "/products/physical/all-products",
        title: "All Products",
        type: "link",
      },

      {
        path: "/products/physical/add-product",
        title: "Add Product",
        type: "link",
      },
      {
        path: "/products/physical/brands",
        title: "Brands",
        type: "link",
      },
      {
        path: "/products/physical/categories",
        title: "Categories",
        type: "link",
      },
      {
        path: "/products/physical/campaigns",
        title: "Campaigns",
        type: "link",
      },
      {
        path: "/products/physical/banners",
        title: "Banners",
        type: "link",
      },
      {
        path: "/products/physical/shop-by-concern",
        title: "Shop By Concern",
        type: "link",
      },
      {
        path: "/products/physical/attributes",
        title: "Attributes",
        type: "link",
      },
      {
        path: "/products/physical/reviews",
        title: "Reviews",
        type: "link",
      },
    ],
  },

  {
    title: "Product to order",
    icon: Clipboard,
    type: "sub",
    active: false,
    children: [
      {
        path: "/pages/product-to-order",
        title: "Product to order",
        type: "link",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    type: "sub",
    children: [{ path: "/settings/profile", title: "Profile", type: "link" }],
  },
  {
    title: "Logout",
    path: "/",
    icon: LogIn,
    type: "link",
    active: false,
  },
];
