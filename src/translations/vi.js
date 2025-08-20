export const vi = {
  translation: {
    // Common texts used across screens
    common: {
      search: "Tìm kiếm",
      notifications: "Thông báo",
      profile: "Hồ sơ",
      logout: "Đăng xuất",
      save: "Lưu",
      cancel: "Hủy",
      delete: "Xóa",
      edit: "Sửa",
      confirm: "Xác nhận",
      back: "Quay lại",
      add: "Thêm",
      update: "Cập nhật",
      actions: "Thao tác",
      loading: "Đang xử lý...",
      error: "Đã có lỗi xảy ra",
      confirmLogout: "Bạn có chắc chắn muốn đăng xuất không?",
      active: "Đang hoạt động",
      inactive: "Đã vô hiệu hóa",


      // Sidebar navigation
      nav: {
        dashboard: "Tổng quan",
        products: "Sản phẩm",
        category: "Danh mục",
        brand: "Thương hiệu",
        banner: "Banner",
        voucher: "Mã giảm giá",
        notification: "Thông báo",
        account: "Tài khoản người dùng",
        inbox: "Tin nhắn",
        posts: "Bài viết",
        orderLists: "Danh sách đơn hàng",
        productStock: "Kho hàng",
        paymentHistory: "Quản lý thanh toán",
        settings: "Cài đặt",
        logout: "Đăng xuất"
      },

      // Pages section
      pages: {
        title: "TRANG",
        pricing: "Bảng giá",
        calendar: "Lịch",
        todo: "Công việc",
        contact: "Liên hệ",
        invoice: "Hóa đơn",
        uiElements: "Giao diện",
        team: "Nhóm",
        table: "Bảng"
      }
    },

    // Dashboard Screen
    dashboard: {
      title: "Tổng quan",
      totalUsers: "Tổng người dùng",
      totalOrders: "Tổng đơn hàng",
      totalSales: "Tổng doanh thu",
      totalPending: "Đang chờ xử lý",
      fromYesterday: "so với hôm qua",
      fromPastWeek: "so với tuần trước",

      charts: {
        salesDetails: "Chi tiết doanh số",
        revenueTitle: "Doanh thu",
        trend: "Xu hướng doanh thu",
        topProducts: 'Top 10 sản phẩm bán chạy'
      },

      period: {
        october: "Tháng 10",
        daily: "Hôm nay",
        weekly: "Tuần này",
        monthly: "Tháng này"
      },

      deals: {
        title: "Chi tiết giao dịch",
        productName: "Tên sản phẩm",
        location: "Địa điểm",
        dateTime: "Ngày - Giờ",
        quantity: "Số lượng",
        amount: "Số tiền",
        status: "Trạng thái",
        statusDelivered: "Đã giao"
      },
      startDate: "Từ ngày",
      endDate: "Đến ngày",
    },

    // Products Screen
    products: {
      title: "Sản phẩm",
      addProduct: "Thêm sản phẩm",
      editProduct: "Sửa sản phẩm",
      searchPlaceholder: "Tìm kiếm sản phẩm...",
      // add: {
      //   title: "Thêm sản phẩm mới",
      //   button: "Thêm sản phẩm",
      //   description: "Vui lòng điền đầy đủ thông tin sản phẩm"
      // },
      form: {
        name: "Tên sản phẩm",
        description: "Mô tả",
        brand: "Thương hiệu",
        category: "Danh mục",
        status: "Trạng thái",
        media: "Hình ảnh/Video"
      },
      status: {
        active: "Còn hàng",
        out_of_stock: "Hết hàng",
        importing_goods: "Đang nhập hàng",
        hidden: "Ẩn sản phẩm"  // Thêm translation cho hidden
      },
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        deleteSuccess: "Xóa sản phẩm thành công",
        updateSuccess: "Cập nhật sản phẩm thành công",
        addSuccess: "Thêm sản phẩm thành công"
      },
      modal: {
        basicInfo: "Thông tin cơ bản",
        name: "Tên sản phẩm",
        description: "Mô tả",
        brand: "Thương hiệu",
        selectBrand: "Chọn thương hiệu",
        category: "Danh mục",
        selectCategory: "Chọn danh mục (chọn thương hiệu trước)",
        status: "Trạng thái",
        selectStatus: "Chọn trạng thái",
        media: "Hình ảnh & Video",
        images: "Hình ảnh",
        videos: "Video",
        selectImages: "Chọn hình ảnh",
        selectVideos: "Chọn video",
        remove: "Xóa",
        variants: "Biến thể sản phẩm",
        color: "Màu sắc",
        selectColor: "Chọn màu",
        addColor: "Thêm màu",
        size: "Kích thước",
        selectSize: "Chọn size",
        price: "Giá",
        quantity: "Số lượng",
        addVariant: "Thêm biến thể",
        variantList: "Danh sách biến thể",
        newColor: "Thêm màu mới",
        newColorName: "Tên màu mới",
        newColorValue: "Mã màu",
        add: "Thêm",
        cancel: "Hủy",
        update: "Cập nhật",
        confirmCancel: "Bạn có chắc muốn hủy? Các thông tin đã nhập sẽ không được lưu.",
        addSuccess: "Thêm sản phẩm thành công",
        updateSuccess: "Cập nhật sản phẩm thành công",
        deleteSuccess: "Xóa sản phẩm thành công",
        confirmDelete: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        fillAllVariant: "Vui lòng điền đầy đủ thông tin biến thể",
        fillAllColor: "Vui lòng nhập đầy đủ thông tin màu",
        addColorSuccess: "Thêm màu thành công",
        addColorError: "Lỗi khi thêm màu mới: ",
        updateVariant: "Cập nhật biến thể",
        editVariant: "Sửa biến thể",
        variantStatus: {
          title: "Trạng thái biến thể",
          available: "Còn hàng",
          out_of_stock: "Hết hàng",
          discontinued: "Ngừng kinh doanh"
        }
      }
    },

    // Categories Screen
    categories: {
      title: "Danh mục",
      addCategory: "Thêm danh mục",
      editCategory: "Sửa danh mục",
      deleteCategory: "Xóa danh mục",
      form: {
        name: "Tên danh mục",
        image: "Hình ảnh",
        media: "Ảnh danh mục",
        status: "Trạng thái",
        brand: "Thương hiệu",
        selectBrand: "Chọn thương hiệu"
      },
      activate: "Bật danh mục",
      deactivate: "Tắt danh mục",
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa danh mục này?",
        deleteSuccess: "Xóa danh mục thành công",
        updateSuccess: "Cập nhật danh mục thành công",
        addSuccess: "Thêm danh mục thành công",
        activated: "Đã bật danh mục thành công",
        deactivated: "Đã tắt danh mục thành công"
      },
      searchPlaceholder: "Tìm kiếm danh mục..."
    },

    // Thêm section mới cho vouchers
    vouchers: {
      title: "Mã giảm giá",
      addVoucher: "Thêm mã giảm giá",
      editVoucher: "Sửa mã giảm giá",
      deleteVoucher: "Xóa mã giảm giá",
      form: {
        name: "Tên mã giảm giá",
        code: "Mã code",
        discountType: "Loại giảm giá",
        discountValue: "Giá trị",
        condition: "Điều kiện",
        startDate: "Ngày bắt đầu",
        endDate: "Ngày kết thúc",
        quantity: "Số lượng",
        minimumOrderValue: "Giá trị đơn hàng tối thiểu",
        maximumDiscount: "Giảm giá tối đa",
        percentage: "Phần trăm (%)",
        fixed: "Số tiền cố định (VNĐ)",
        voucherType: "Đối tượng sử dụng",
        allUsers: "Tất cả người dùng",
        specificUsers: "Người dùng cụ thể",
        selectUsers: "Chọn người dùng",
        selectUser: "Chọn người dùng để thêm",
        type: "Loại voucher",
        typeOrder: "Giảm giá đơn hàng",
        typeShipping: "Giảm phí vận chuyển"
      },
      status: {
        active: "Đang hoạt động",
        expired: "Đã hết hạn",
        outOfStock: "Hết lượt dùng"
      },
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa mã giảm giá này?",
        deleteSuccess: "Xóa mã giảm giá thành công",
        updateSuccess: "Cập nhật mã giảm giá thành công",
        addSuccess: "Thêm mã giảm giá thành công"
      },
      searchPlaceholder: "Tìm kiếm theo tên hoặc mã voucher..."
    },

    // Accounts section
    accounts: {
      title: "Quản lý tài khoản",
      form: {
        avatar: "Ảnh đại diện",
        username: "Tên người dùng",
        email: "Email",
        phone: "Số điện thoại",
        sex: "Giới tính",
        birthDate: "Ngày sinh",
        createdAt: "Ngày tạo",
        status: "Trạng thái",
        actions: "Thao tác"
      },
      noPhone: "Chưa cập nhật",
      noGender: "Chưa cập nhật",
      noBirthDate: "Chưa cập nhật",
      searchPlaceholder: "Tìm kiếm theo tên, email hoặc số điện thoại...",
      status: {
        active: "Đang hoạt động",
        inactive: "Đã vô hiệu hóa"
      },
      activate: "Kích hoạt",
      deactivate: "Vô hiệu hóa",
      confirmToggle: "Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?",
      toggleSuccess: "Thay đổi trạng thái tài khoản thành công"
    },

    // Thêm section mới cho product stock
    productStock: {
      title: "Kho hàng",
      quantity: "Số lượng",
      status: "Trạng thái",
      lowStock: "Sắp hết hàng",
      outOfStock: "Hết hàng",
      inStock: "Còn hàng",
      actions: {
        view: "Xem chi tiết",
        edit: "Chỉnh sửa",
        delete: "Xóa"
      },
      searchPlaceholder: "Tìm kiếm sản phẩm...",
      detail: {
        title: "Chi tiết sản phẩm",
        variants: "Danh sách biến thể",
        inStock: "Tồn kho",
      }
    },

    // Thêm section mới cho order list
    orderList: {
      title: "Danh sách đơn hàng",
      allOrders: "Tất cả đơn hàng",
      orderId: "Mã đơn",
      customer: "Khách hàng",
      totalAmount: "Tổng tiền",
      shippingFee: "Phí vận chuyển",
      discount: "Giảm giá",
      finalTotal: "Thành tiền",
      paymentMethod: "Phương thức thanh toán",
      shippingAddress: "Địa chỉ giao hàng",
      orderDate: "Ngày đặt",
      orderStatus: "Trạng thái đơn hàng",
      email: "Email",
      status: {
        title: "Trạng thái",
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        processing: "Đang xử lý",
        shipping: "Đang vận chuyển",
        delivered: "Đã giao hàng",
        received: "Đã nhận hàng",
        cancelled: "Đã hủy",
        return_requested: "Yêu cầu trả",
        return_accepted: "Đồng ý trả",
        return_rejected: "Từ chối trả",
        returned: "Đã trả hàng",
        refunded: "Đã hoàn tiền",
        reviewed: "Đã đánh giá"
      },
      actions: "Thao tác",
      confirmStatusChange: "Xác nhận thay đổi trạng thái đơn hàng?",
      statusUpdateSuccess: "Cập nhật trạng thái thành công",
      searchPlaceholder: "Tìm kiếm theo mã đơn, khách hàng hoặc trạng thái...",
      confirmRefund: "Bạn có chắc chắn muốn hoàn tiền cho đơn hàng này?",
      refundSuccess: "Hoàn tiền thành công",
      refund: "Hoàn tiền",
      noTransId: "Không tìm thấy mã giao dịch MoMo",
      orderDetail: {
        title: "Chi tiết đơn hàng",
        orderInfo: "Thông tin đơn hàng",
        customerInfo: "Thông tin khách hàng",
        products: "Danh sách sản phẩm",
        summary: "Tổng kết",
        productName: "Tên sản phẩm",
        variant: "Biến thể",
        quantity: "Số lượng",
        price: "Đơn giá",
        subtotal: "Thành tiền"
      },
      returnRequest: {
        title: "Chi tiết yêu cầu trả hàng",
        requestInfo: "Thông tin yêu cầu",
        orderId: "Mã đơn hàng",
        customer: "Khách hàng",
        email: "Email",
        reason: "Lý do trả hàng",
        quantity: "Số lượng trả",
        status: {
          title: "Trạng thái",
          pending: "Chờ xử lý",
          approved: "Đã chấp nhận",
          rejected: "Đã từ chối"
        },
        images: "Hình ảnh đính kèm",
        approve: "Chấp nhận",
        reject: "Từ chối",
        updateSuccess: "Cập nhật trạng thái thành công",
        noRequestFound: "Không tìm thấy yêu cầu trả hàng cho đơn hàng này"
      },
      cancelRequest: {
        title: "Chi tiết hủy đơn hàng",
        requestInfo: "Thông tin yêu cầu",
        orderId: "Mã đơn hàng",
        customer: "Khách hàng",
        reason: "Lý do hủy",
        viewReason: "Xem lý do hủy",
        noRequestFound: "Không tìm thấy thông tin hủy đơn cho đơn hàng này"
      }
    },

    // Thêm section mới cho notifications
    notifications: {
      title: "Quản lý thông báo",
      titleColumn: "Tiêu đề",
      message: "Nội dung",
      type: "Loại",
      actions: "Thao tác",
      add: "Thêm thông báo",
      edit: "Sửa thông báo",
      titleField: "Tiêu đề",
      messageField: "Nội dung",
      typeField: "Loại thông báo",
      confirmDelete: "Bạn có chắc chắn muốn xóa thông báo này?",
      selectUsers: "Chọn người nhận thông báo",
      selectUser: "Chọn người dùng",
      selectedUsers: "Người dùng đã chọn",
      types: {
        system: "Hệ thống",
        order: "Đơn hàng",
        promotion: "Khuyến mãi"
      },
      messages: {
        createSuccess: "Tạo thông báo thành công",
        updateSuccess: "Cập nhật thông báo thành công",
        deleteSuccess: "Xóa thông báo thành công",
        createUserSuccess: "Tạo thông báo cho người dùng thành công",
        updateUserSuccess: "Cập nhật thông báo người dùng thành công",
        deleteUserSuccess: "Xóa thông báo người dùng thành công"
      },
      searchPlaceholder: "Tìm kiếm theo tiêu đề, nội dung hoặc thể loại..."
    },

    // Thêm section mới cho brands
    brands: {
      title: "Thương hiệu",
      addBrand: "Thêm thương hiệu",
      editBrand: "Sửa thương hiệu",
      deleteBrand: "Xóa thương hiệu",
      form: {
        media: "Ảnh thương hiệu",
        name: "Tên thương hiệu",
        image: "Hình ảnh",
        status: "Trạng thái"
      },
      activate: "Bật thương hiệu",
      deactivate: "Tắt thương hiệu",
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa thương hiệu này?",
        deleteSuccess: "Xóa thương hiệu thành công",
        updateSuccess: "Cập nhật thương hiệu thành công",
        addSuccess: "Thêm thương hiệu thành công",
        activated: "Đã bật thương hiệu thành công",
        deactivated: "Đã tắt thương hiệu thành công"
      },
      searchPlaceholder: "Tìm kiếm thương hiệu..."
    },

    // Thêm section mới cho posts
    posts: {
      title: "Quản lý bài viết",
      add: "Thêm bài viết",
      edit: "Sửa bài viết",
      form: {
        title: "Tiêu đề",
        message: "Nội dung",
        media: "Hình ảnh/Video"
      },
      confirmDelete: "Bạn có chắc chắn muốn xóa bài viết này?",
      messages: {
        createSuccess: "Tạo bài viết thành công",
        updateSuccess: "Cập nhật bài viết thành công",
        deleteSuccess: "Xóa bài viết thành công"
      },
      searchPlaceholder: "Tìm kiếm theo tiêu đề hoặc nội dung..."
    },

    // Thêm section thống kê
    statistics: {
      title: "Thống kê",
      salesChart: {
        title: "Biểu đồ chi tiết doanh số",
        dateRange: "Khoảng thời gian",
        from: "Từ",
        to: "đến",
        revenue: "Doanh thu",
        noData: "Không có dữ liệu"
      },
      topProducts: {
        title: "Top 10 sản phẩm bán chạy",
        rank: "Thứ hạng",
        image: "Hình ảnh",
        name: "Tên sản phẩm",
        brand: "Thương hiệu",
        category: "Danh mục",
        price: "Giá",
        quantity: "Số lượng đã bán",
        revenue: "Doanh thu"
      },
      topCustomers: {
        title: "Top 10 khách hàng mua nhiều nhất",
        rank: "Thứ hạng",
        avatar: "Ảnh đại diện",
        name: "Tên khách hàng",
        email: "Email",
        phone: "Số điện thoại",
        birthDate: "Ngày sinh",
        orders: "Số đơn hàng",
        spent: "Tổng chi tiêu",
        lastPurchase: "Lần mua cuối"
      }
    },

    chat: {
      title: "Tin nhắn",
      userList: {
        title: "Danh sách người dùng",
        search: "Tìm kiếm người dùng...",
        noUsers: "Không tìm thấy người dùng",
        loading: "Đang tải danh sách..."
      },
      window: {
        placeholder: "Nhập tin nhắn...",
        send: "Gửi",
        loading: "Đang tải tin nhắn...",
        noMessages: "Chưa có tin nhắn",
        selectUser: "Chọn một người dùng để bắt đầu trò chuyện"
      }
    },

    login: {
      title: "Đăng nhập tài khoản",
      subtitle: "Vui lòng nhập email và mật khẩu để tiếp tục",
      email: "Địa chỉ email",
      emailPlaceholder: "example@gmail.com",
      password: "Mật khẩu",
      passwordPlaceholder: "••••••",
      forgotPassword: "Quên mật khẩu?",
      rememberMe: "Ghi nhớ mật khẩu",
      signIn: "Đăng nhập",
      signingIn: "Đang đăng nhập...",
      errors: {
        invalidCredentials: "Email hoặc mật khẩu không đúng",
        adminOnly: "Chỉ tài khoản Admin mới có thể đăng nhập vào trang quản trị",
        networkError: "Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại."
      }
    },

    paymentHistory: {
      title: "Lịch sử thanh toán",
      export: {
        excel: "Xuất Excel",
        pdf: "Xuất PDF"
      },
      table: {
        username: "Tên người dùng",
        date: "Ngày thanh toán",
        paymentMethod: "Phương thức thanh toán",
        orderId: "Mã đơn hàng",
        customer: "Khách hàng",
        amount: "Số tiền",
        time: "Thời gian",
        method: "Phương thức",
        status: "Trạng thái",
        email: "Email"
      },
      status: {
        pending: "Chờ xử lý",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy"
      },
      noData: "Không có dữ liệu thanh toán",
      loading: "Đang tải lịch sử thanh toán...",
      searchPlaceholder: "Tìm kiếm theo mã đơn hàng hoặc người dùng..."
    },

    // Thêm section mới cho banners
    banners: {
      title: "Quản lý banner",
      addBanner: "Thêm banner",
      editBanner: "Sửa banner",
      deleteBanner: "Xóa banner",
      form: {
        image: "Hình ảnh banner"
      },
      messages: {
        confirmDelete: "Bạn có chắc chắn muốn xóa banner này?",
        deleteSuccess: "Xóa banner thành công",
        updateSuccess: "Cập nhật banner thành công",
        addSuccess: "Thêm banner thành công",
        maxBanners: "Chỉ cho phép tối đa 3 banner"
      }
    }
  }
};