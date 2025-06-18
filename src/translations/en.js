export const en = {
  translation: {
    common: {
      search: "Search",
      notifications: "Notifications",
      profile: "Profile",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      confirm: "Confirm", 
      back: "Back",
      add: "Add",
      update: "Update",
      actions: "Actions",
      loading: "Loading...",
      error: "An error occurred",
      confirmLogout: "Are you sure you want to logout?",

      nav: {
        dashboard: "Dashboard",
        products: "Products",
        category: "Categories",
        brand: "Brands",
        voucher: "Vouchers",
        notification: "Notifications",
        account: "User Accounts",
        inbox: "Messages",
        posts: "Posts",
        orderLists: "Order Lists", 
        productStock: "Product Stock",
        paymentHistory: "Payment History",
        settings: "Settings",
        logout: "Logout"
      },

      pages: {
        title: "PAGES",
        pricing: "Pricing",
        calendar: "Calendar",
        todo: "Todo",
        contact: "Contact",
        invoice: "Invoice",
        uiElements: "UI Elements",
        team: "Team",
        table: "Table"
      }
    },

    dashboard: {
      title: "Dashboard",
      totalUsers: "Total Users",
      totalOrders: "Total Orders", 
      totalSales: "Total Sales",
      totalPending: "Pending Orders",
      fromYesterday: "from yesterday",
      fromPastWeek: "from last week",

      charts: {
        salesDetails: "Sales Details",
        revenueTitle: "Revenue",
        trend: "Revenue Trend",
        topProducts: "Top 10 Best Selling Products"
      },

      period: {
        october: "October",
        daily: "Today",
        weekly: "This Week",
        monthly: "This Month"
      },

      deals: {
        title: "Transaction Details",
        productName: "Product Name",
        location: "Location",
        dateTime: "Date - Time",
        quantity: "Quantity",
        amount: "Amount",
        status: "Status",
        statusDelivered: "Delivered"
      }
    },

    products: {
      title: "Products",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      form: {
        name: "Product Name",
        description: "Description",
        brand: "Brand",
        category: "Category", 
        status: "Status",
        media: "Images/Videos"
      },
      status: {
        active: "In Stock",
        'out of stock': "Out of Stock",
        'importing goods': "Importing"
      },
      messages: {
        confirmDelete: "Are you sure you want to delete this product?",
        deleteSuccess: "Product deleted successfully",
        updateSuccess: "Product updated successfully",
        addSuccess: "Product added successfully"
      },
      modal: {
        basicInfo: "Basic Information",
        name: "Product Name",
        description: "Description",
        brand: "Brand",
        selectBrand: "Select brand",
        category: "Category",
        selectCategory: "Select category",
        status: "Status",
        selectStatus: "Select status",
        media: "Images & Videos",
        images: "Images",
        videos: "Videos",
        selectImages: "Select images",
        selectVideos: "Select videos",
        remove: "Remove",
        variants: "Product Variants",
        color: "Color",
        selectColor: "Select color",
        addColor: "Add color",
        size: "Size",
        selectSize: "Select size",
        price: "Price",
        quantity: "Quantity",
        addVariant: "Add variant",
        variantList: "Variant List",
        newColor: "Add New Color",
        newColorName: "New color name",
        newColorValue: "Color code",
        add: "Add",
        cancel: "Cancel",
        update: "Update",
        confirmCancel: "Are you sure you want to cancel? Entered information will not be saved.",
        addSuccess: "Product added successfully",
        updateSuccess: "Product updated successfully",
        deleteSuccess: "Product deleted successfully",
        confirmDelete: "Are you sure you want to delete this product?",
        fillAllVariant: "Please fill in all variant information",
        fillAllColor: "Please enter all color information",
        addColorSuccess: "Color added successfully",
        addColorError: "Error adding new color: "
      }
    },

    categories: {
      title: "Categories",
      addCategory: "Add Category",
      editCategory: "Edit Category", 
      deleteCategory: "Delete Category",
      form: {
        name: "Category Name",
        image: "Image",
        media: "Category Image"
      },
      messages: {
        confirmDelete: "Are you sure you want to delete this category?",
        deleteSuccess: "Category deleted successfully",
        updateSuccess: "Category updated successfully",
        addSuccess: "Category added successfully"
      }
    },

    vouchers: {
      title: "Vouchers",
      addVoucher: "Add Voucher",
      editVoucher: "Edit Voucher",
      deleteVoucher: "Delete Voucher",
      form: {
        name: "Voucher Name",
        code: "Code",
        discountType: "Discount Type",
        discountValue: "Value",
        condition: "Condition",
        startDate: "Start Date",
        endDate: "End Date",
        quantity: "Quantity",
        minimumOrderValue: "Minimum Order Value",
        maximumDiscount: "Maximum Discount",
        percentage: "Percentage (%)",
        fixed: "Fixed Amount (USD)",
        voucherType: "Target Users",
        allUsers: "All Users",
        specificUsers: "Specific Users",
        selectUsers: "Select Users",
        selectUser: "Select user to add"
      },
      status: {
        active: "Active",
        expired: "Expired", 
        outOfStock: "Out of Stock"
      },
      messages: {
        confirmDelete: "Are you sure you want to delete this voucher?",
        deleteSuccess: "Voucher deleted successfully",
        updateSuccess: "Voucher updated successfully",
        addSuccess: "Voucher added successfully"
      }
    },

    accounts: {
      title: "Account Management",
      form: {
        avatar: "Avatar",
        username: "Username",
        email: "Email",
        phone: "Phone Number",
        sex: "Gender",
        birthDate: "Birth Date",
        createdAt: "Created Date"
      },
      noPhone: "Not updated",
      noGender: "Not updated",
      noBirthDate: "Not updated"
    },

    productStock: {
      title: "Product Stock",
      quantity: "Quantity",
      status: "Status",
      lowStock: "Low Stock",  
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      actions: {
        view: "View Details",
        edit: "Edit",
        delete: "Delete"
      }
    },

    orderList: {
      title: "Order List",
      allOrders: "All Orders",
      orderId: "Order ID",
      customer: "Customer",
      totalAmount: "Total Amount",
      shippingFee: "Shipping Fee",
      discount: "Discount",
      finalTotal: "Final Total",
      paymentMethod: "Payment Method",
      shippingAddress: "Shipping Address", 
      orderDate: "Order Date",
      orderStatus: "Order Status",
      status: {
        pending: "Pending",
        confirmed: "Confirmed",
        processing: "Processing",
        shipping: "Shipping",
        delivered: "Delivered",
        received: "Received",
        cancelled: "Cancelled",
        return_requested: "Return Requested",
        return_accepted: "Return Accepted", 
        return_rejected: "Return Rejected",
        returned: "Returned",
        refunded: "Refunded",
        reviewed: "Reviewed"
      },
      actions: "Actions",
      confirmStatusChange: "Confirm order status change?",
      statusUpdateSuccess: "Status updated successfully"
    },

    notifications: {
      title: "Notification Management",
      titleColumn: "Title",
      message: "Content",
      type: "Type",
      actions: "Actions",
      add: "Add Notification",
      titleField: "Title",
      messageField: "Content", 
      typeField: "Notification Type",
      confirmDelete: "Are you sure you want to delete this notification?",
      selectUsers: "Select notification recipients",
      selectUser: "Select user",
      selectedUsers: "Selected users",
      types: {
        system: "System",
        order: "Order",
        promotion: "Promotion"
      },
      messages: {
        createSuccess: "Notification created successfully",
        updateSuccess: "Notification updated successfully",
        deleteSuccess: "Notification deleted successfully",
        createUserSuccess: "User notification created successfully",
        updateUserSuccess: "User notification updated successfully",
        deleteUserSuccess: "User notification deleted successfully"
      }
    },

    brands: {
      title: "Brands",
      addBrand: "Add Brand",
      editBrand: "Edit Brand",
      deleteBrand: "Delete Brand",
      form: {
        name: "Brand Name",
        image: "Image"
      },
      messages: {
        confirmDelete: "Are you sure you want to delete this brand?",
        deleteSuccess: "Brand deleted successfully",
        updateSuccess: "Brand updated successfully",
        addSuccess: "Brand added successfully"
      }
    },

    posts: {
      title: "Post Management",
      add: "Add Post",
      edit: "Edit Post",
      form: {
        title: "Title",
        message: "Content",
        media: "Images/Videos"
      },
      confirmDelete: "Are you sure you want to delete this post?",
      messages: {
        createSuccess: "Post created successfully",
        updateSuccess: "Post updated successfully",
        deleteSuccess: "Post deleted successfully"
      }
    },

    statistics: {
      title: "Statistics",
      salesChart: {
        title: "Sales Details Chart",
        dateRange: "Date Range",
        from: "From",
        to: "To", 
        revenue: "Revenue",
        noData: "No data available"
      },
      topProducts: {
        title: "Top 10 Best Selling Products",
        rank: "Rank",
        image: "Image",
        name: "Product Name",
        brand: "Brand",
        category: "Category",
        price: "Price",
        quantity: "Quantity Sold",
        revenue: "Revenue"
      },
      topCustomers: {
        title: "Top 10 Customers",
        rank: "Rank",
        avatar: "Avatar",
        name: "Customer Name",
        email: "Email",
        phone: "Phone",
        birthDate: "Birth Date",
        orders: "Total Orders",
        spent: "Total Spent",
        lastPurchase: "Last Purchase"
      }
    },

    chat: {
      title: "Messages",
      userList: {
        title: "User List",
        search: "Search users",
        noUsers: "No users found",
        loading: "Loading users..."
      },
      window: {
        placeholder: "Type a message...",
        send: "Send",
        loading: "Loading messages...",
        noMessages: "No messages yet",
        selectUser: "Select a user to start chatting"
      }
    },

    login: {
      title: "Login to Account",
      subtitle: "Please enter your email and password to continue",
      email: "Email address",
      emailPlaceholder: "example@gmail.com",
      password: "Password",
      passwordPlaceholder: "••••••",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember Password",
      signIn: "Sign In",
      signingIn: "Signing in...",
      errors: {
        invalidCredentials: "Invalid email or password",
        adminOnly: "Only admin accounts can access this panel",
        networkError: "Network error. Please check your connection and try again."
      }
    },

    paymentHistory: {
      title: "Payment History",
      export: {
        excel: "Export Excel",
        pdf: "Export PDF"
      },
      table: {
        username: "Username",
        date: "Payment Date",
        paymentMethod: "Payment Method",
        orderId: "Order ID",
        customer: "Customer",
        amount: "Amount",
        time: "Time",
        method: "Payment Method",
        status: "Status"
      },
      status: {
        pending: "Pending",
        completed: "Completed",
        cancelled: "Cancelled"
      },
      noData: "No payment data available",
      loading: "Loading payment history..."
    }
  }
};