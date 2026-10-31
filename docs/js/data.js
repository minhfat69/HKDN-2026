/**
 * Single Source of Truth - Backend API Specification & Models Reference
 * Extracted directly from Node.js Express routes, controllers, middlewares, and Sequelize models.
 */

window.API_DATA = {
  project: {
    name: "AppDatMon - Restaurant Management System",
    description: "Hệ thống quản trị và đặt món nhà hàng qua mã QR / Web / Mobile. Cung cấp đầy đủ các API về xác thực, quản lý người dùng, món ăn, danh mục, bàn ăn & QR, đơn hàng & thanh toán trực tuyến PayOS, đặt bàn trước và tích điểm thành viên.",
    version: "1.0.0",
    environment: "Node.js / Express / MySQL / Sequelize",
    database: "MySQL (Sequelize ORM)",
    defaultBaseUrl: "http://localhost:3000",
    authScheme: "Bearer Token (JWT)",
    tokenExpiry: "7 ngày (7d)"
  },

  roles: [
    { code: "PUBLIC", name: "Khách vãng lai / Public", badge: "public", color: "#64748b", description: "Không yêu cầu JWT token, ai cũng có thể truy cập" },
    { code: "CUSTOMER", name: "Khách hàng thành viên", badge: "customer", color: "#3b82f6", description: "Đã đăng ký tài khoản, có JWT token cá nhân" },
    { code: "STAFF", name: "Nhân viên phục vụ", badge: "staff", color: "#10b981", description: "Nhân viên bàn, xác nhận đơn, đặt bàn, thanh toán" },
    { code: "KITCHEN", name: "Bếp / Đầu bếp", badge: "kitchen", color: "#f59e0b", description: "Xem danh sách món cần chế biến, cập nhật tiến độ nấu" },
    { code: "ADMIN", name: "Quản trị viên (Admin)", badge: "admin", color: "#ef4444", description: "Toàn quyền quản lý người dùng, danh mục, món ăn, thống kê" }
  ],

  stats: {
    totalEndpoints: 49,
    totalModules: 12,
    publicApis: 26,
    protectedApis: 23,
    methods: {
      GET: 20,
      POST: 13,
      PUT: 12,
      DELETE: 4
    },
    roleDistribution: {
      ADMIN: 15,
      STAFF_ADMIN: 4,
      CUSTOMER_AUTHENTICATED: 3,
      PUBLIC_OR_ALL: 27
    }
  },

  authWorkflows: {
    title: "Hướng dẫn Xác thực (Authentication Guide)",
    description: "Hệ thống sử dụng cơ chế JSON Web Token (JWT) qua Authorization Header dạng Bearer Token.",
    steps: [
      {
        step: 1,
        title: "Đăng ký tài khoản (Register)",
        description: "Gọi API `POST /api/auth/register` với thông tin `fullName`, `phone`, `username`, `password` để tạo người dùng mới với role mặc định là `CUSTOMER`."
      },
      {
        step: 2,
        title: "Đăng nhập nhận Token (Login)",
        description: "Gọi API `POST /api/auth/login` với `account` (có thể dùng username, số điện thoại hoặc email) và `password`. Khi đăng nhập thành công, server trả về chuỗi `token` JWT có thời hạn 7 ngày."
      },
      {
        step: 3,
        title: "Gắn Token vào Request Header",
        description: "Đối với tất cả các API yêu cầu xác thực hoặc phân quyền, thêm header `Authorization` vào request:",
        code: "Authorization: Bearer <JWT_TOKEN>"
      },
      {
        step: 4,
        title: "Xử lý Middleware & Phân quyền (RBAC)",
        description: "Backend kiểm tra tính hợp lệ của token qua `verifyToken` và phân quyền qua `isAdmin` hoặc `isStaffOrAdmin`. Nếu token thiếu/hết hạn trả về `401 Unauthorized`, nếu không đủ quyền trả về `403 Forbidden`."
      }
    ],
    middlewareDetails: [
      { name: "verifyToken", desc: "Xác thực JWT token từ header `Authorization: Bearer <token>`, giải mã `{ id, role }` và gán vào `req.user`. Trả về 401 nếu thiếu hoặc sai token." },
      { name: "optionalVerifyToken", desc: "Nếu có token hợp lệ thì gán `req.user`, nếu không có hoặc lỗi token thì gán `req.user = null` và vẫn tiếp tục xử lý (Dùng cho `POST /api/orders` để hỗ trợ cả khách vãng lai và thành viên)." },
      { name: "isAdmin", desc: "Yêu cầu `req.user.role === 'ADMIN'`. Trả về 403 Forbidden nếu không phải Admin." },
      { name: "isStaffOrAdmin", desc: "Yêu cầu `req.user.role === 'ADMIN' || req.user.role === 'STAFF'`. Trả về 403 Forbidden nếu là Customer hoặc Kitchen." }
    ]
  },

  errorGuide: {
    title: "Chuẩn định dạng Lỗi (Error Handling)",
    description: "Backend trả về các mã HTTP Status Code chuẩn kèm theo JSON response giải thích chi tiết nguyên nhân lỗi.",
    standardFormat: {
      success: false,
      message: "Mô tả nguyên nhân lỗi cụ thể bằng tiếng Việt hoặc tiếng Anh",
      error: "Chi tiết lỗi kỹ thuật nếu có từ hệ thống"
    },
    statusCodes: [
      { code: 200, name: "200 OK", desc: "Yêu cầu xử lý thành công, trả về dữ liệu tương ứng." },
      { code: 201, name: "201 Created", desc: "Tạo mới tài nguyên thành công (User, Product, Order, Reservation,...)." },
      { code: 204, name: "204 No Content", desc: "Xử lý thành công nhưng không có dữ liệu trả về trong body (Delete Product/Category)." },
      { code: 400, name: "400 Bad Request", desc: "Dữ liệu gửi lên không hợp lệ, thiếu trường bắt buộc, tài khoản đã tồn tại, hoặc vi phạm ràng buộc nghiệp vụ." },
      { code: 401, name: "401 Unauthorized", desc: "Thiếu Authorization header, token không hợp lệ hoặc token đã hết hạn." },
      { code: 403, name: "403 Forbidden", desc: "Người dùng không đủ quyền truy cập (Ví dụ: Customer cố gọi API của Admin hoặc Staff)." },
      { code: 404, name: "404 Not Found", desc: "Không tìm thấy tài nguyên theo ID, mã QR, hoặc endpoint không tồn tại." },
      { code: 500, name: "500 Internal Server Error", desc: "Lỗi phát sinh ngoài dự kiến từ phía Server hoặc kết nối cơ sở dữ liệu." }
    ]
  },

  dataModels: [
    {
      name: "User",
      table: "users",
      description: "Bảng quản lý tài khoản người dùng, nhân viên và quản trị viên.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Mã định danh duy nhất (Khóa chính)" },
        { field: "fullName", type: "VARCHAR(100)", null: false, desc: "Họ và tên đầy đủ" },
        { field: "email", type: "VARCHAR(100)", unique: true, null: true, desc: "Địa chỉ email (Duy nhất)" },
        { field: "phone", type: "VARCHAR(20)", unique: true, null: false, desc: "Số điện thoại đăng ký (Duy nhất, dùng tích điểm)" },
        { field: "username", type: "VARCHAR(40)", unique: true, null: false, desc: "Tên đăng nhập (Duy nhất)" },
        { field: "password", type: "VARCHAR(255)", null: false, desc: "Mật khẩu băm (Bcrypt hash)" },
        { field: "avatar", type: "TEXT", null: true, desc: "Đường dẫn ảnh đại diện" },
        { field: "points", type: "INTEGER", default: "0", null: false, desc: "Điểm thưởng tích lũy (1 điểm = 1 VNĐ)" },
        { field: "role", type: "ENUM('CUSTOMER','STAFF','KITCHEN','ADMIN')", default: "'CUSTOMER'", null: false, desc: "Vai trò người dùng trong hệ thống" },
        { field: "status", type: "ENUM('ACTIVE','BLOCKED')", default: "'ACTIVE'", null: false, desc: "Trạng thái hoạt động của tài khoản" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian tạo" },
        { field: "updated_at", type: "DATETIME", null: false, desc: "Thời gian cập nhật gần nhất" }
      ],
      relations: [
        "hasOne Cart (foreignKey: user_id)",
        "hasMany Reservation (foreignKey: user_id)",
        "hasMany Order (foreignKey: user_id)",
        "hasMany Review (foreignKey: user_id)"
      ]
    },
    {
      name: "RestaurantTable",
      table: "restaurant_tables",
      description: "Bảng quản lý bàn ăn trong nhà hàng và mã QR tương ứng.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "tableNumber", type: "INTEGER", unique: true, null: false, desc: "Số bàn ăn (1, 2, 3...)" },
        { field: "qrCode", type: "TEXT", null: false, desc: "Mã định danh QR bàn (VD: 'TABLE_01')" },
        { field: "capacity", type: "INTEGER", default: "4", null: false, desc: "Sức chứa tối đa của bàn (số khách)" },
        { field: "status", type: "ENUM('AVAILABLE','BOOKED','OCCUPIED','CLEANING')", default: "'AVAILABLE'", null: false, desc: "Trạng thái bàn hiện tại" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian tạo bàn" }
      ],
      relations: [
        "hasMany Reservation (foreignKey: table_id)",
        "hasMany Order (foreignKey: table_id)"
      ]
    },
    {
      name: "Category",
      table: "categories",
      description: "Danh mục phân loại món ăn trong thực đơn.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "name", type: "VARCHAR(100)", null: false, desc: "Tên danh mục món (Khai vị, Món chính, Đồ uống,...)" },
        { field: "description", type: "TEXT", null: true, desc: "Mô tả danh mục" },
        { field: "image", type: "TEXT", null: true, desc: "Hình ảnh đại diện danh mục" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian tạo" }
      ],
      relations: [
        "hasMany Product (foreignKey: category_id, as: 'products')"
      ]
    },
    {
      name: "Product",
      table: "products",
      description: "Món ăn và thức uống trong thực đơn nhà hàng.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "name", type: "VARCHAR(150)", null: false, desc: "Tên món ăn" },
        { field: "description", type: "TEXT", null: true, desc: "Mô tả chi tiết thành phần, hương vị" },
        { field: "price", type: "DECIMAL(10,2)", null: false, desc: "Đơn giá món ăn (VNĐ)" },
        { field: "image", type: "TEXT", null: true, desc: "Đường dẫn ảnh món ăn" },
        { field: "stock", type: "INTEGER", default: "0", null: false, desc: "Số lượng tồn trong kho/bếp" },
        { field: "isAvailable", type: "BOOLEAN", default: "true", null: false, desc: "Trạng thái còn món hay hết món" },
        { field: "category_id", type: "BIGINT", fk: true, null: false, desc: "Khóa ngoại tham chiếu bảng categories" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian tạo" },
        { field: "updated_at", type: "DATETIME", null: false, desc: "Thời gian cập nhật" }
      ],
      relations: [
        "belongsTo Category (foreignKey: category_id, as: 'category')",
        "hasMany OrderItem (foreignKey: product_id)",
        "hasMany CartItem (foreignKey: product_id)"
      ]
    },
    {
      name: "Order",
      table: "orders",
      description: "Đơn đặt món của khách hàng tại bàn hoặc trực tuyến.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Mã đơn hàng (Khóa chính)" },
        { field: "totalPrice", type: "DECIMAL(10,2)", null: false, desc: "Tổng tiền gốc của các món ăn" },
        { field: "discountAmount", type: "DECIMAL(10,2)", default: "0", null: false, desc: "Số tiền được giảm giá (quy đổi từ điểm thưởng)" },
        { field: "finalPrice", type: "DECIMAL(10,2)", null: false, desc: "Số tiền thanh toán thực tế sau giảm giá" },
        { field: "note", type: "TEXT", null: true, desc: "Ghi chú đơn hàng (Kèm mã PayOS nếu có)" },
        { field: "status", type: "ENUM('PENDING','CONFIRMED','PREPARING','READY','COMPLETED','CANCELLED')", default: "'PENDING'", null: false, desc: "Trạng thái chế biến/phục vụ đơn hàng" },
        { field: "paymentStatus", type: "ENUM('UNPAID','PAID','REFUNDED')", default: "'UNPAID'", null: false, desc: "Trạng thái thanh toán" },
        { field: "paymentMethod", type: "ENUM('CASH','TRANSFER')", null: true, desc: "Phương thức thanh toán (Tiền mặt / Chuyển khoản PayOS)" },
        { field: "isPointsAdded", type: "BOOLEAN", default: "false", null: false, desc: "Đã tích điểm thưởng 5% cho đơn này hay chưa" },
        { field: "table_id", type: "BIGINT", fk: true, null: true, desc: "Khóa ngoại tham chiếu bàn ăn" },
        { field: "user_id", type: "BIGINT", fk: true, null: true, desc: "Khóa ngoại tham chiếu khách hàng thành viên" },
        { field: "reservation_id", type: "BIGINT", fk: true, null: true, desc: "Khóa ngoại tham chiếu lịch đặt bàn (nếu có)" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian đặt món" },
        { field: "updated_at", type: "DATETIME", null: false, desc: "Thời gian cập nhật" }
      ],
      relations: [
        "belongsTo User (foreignKey: user_id, as: 'User')",
        "belongsTo RestaurantTable (foreignKey: table_id, as: 'RestaurantTable')",
        "belongsTo Reservation (foreignKey: reservation_id)",
        "hasMany OrderItem (foreignKey: order_id, as: 'OrderItems')",
        "hasOne Payment (foreignKey: order_id)"
      ]
    },
    {
      name: "OrderItem",
      table: "order_items",
      description: "Chi tiết từng món ăn trong một đơn hàng.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "quantity", type: "INTEGER", default: "1", null: false, desc: "Số lượng món đặt" },
        { field: "unitPrice", type: "DECIMAL(10,2)", null: false, desc: "Đơn giá tại thời điểm đặt" },
        { field: "totalPrice", type: "DECIMAL(10,2)", null: false, desc: "Thành tiền = quantity * unitPrice" },
        { field: "note", type: "TEXT", null: true, desc: "Yêu cầu riêng (Ít cay, không hành...)" },
        { field: "status", type: "ENUM('WAITING','COOKING','DONE','CANCELLED')", default: "'WAITING'", null: false, desc: "Tiến độ chế biến tại bếp" },
        { field: "order_id", type: "BIGINT", fk: true, null: false, desc: "Khóa ngoại tham chiếu bảng orders" },
        { field: "product_id", type: "BIGINT", fk: true, null: false, desc: "Khóa ngoại tham chiếu bảng products" }
      ],
      relations: [
        "belongsTo Order (foreignKey: order_id)",
        "belongsTo Product (foreignKey: product_id, as: 'Product')"
      ]
    },
    {
      name: "Reservation",
      table: "reservations",
      description: "Thông tin đặt bàn trước của khách hàng.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "guestName", type: "VARCHAR(255)", null: false, desc: "Tên người đặt bàn" },
        { field: "guestPhone", type: "VARCHAR(255)", null: false, desc: "Số điện thoại liên hệ" },
        { field: "reservationTime", type: "DATETIME", null: false, desc: "Thời gian đến nhận bàn" },
        { field: "numberOfGuests", type: "INTEGER", default: "1", null: false, desc: "Số lượng khách dự kiến" },
        { field: "note", type: "TEXT", null: true, desc: "Ghi chú thêm" },
        { field: "status", type: "ENUM('PENDING','CONFIRMED','ARRIVED','CHECKED_IN','COMPLETED','CANCELLED','EXPIRED')", default: "'PENDING'", null: false, desc: "Trạng thái lịch đặt bàn" },
        { field: "table_id", type: "BIGINT", fk: true, null: false, desc: "Bàn được tự động gán" },
        { field: "user_id", type: "BIGINT", fk: true, null: true, desc: "Khóa ngoại khách hàng (nếu có đăng nhập)" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian tạo" },
        { field: "updated_at", type: "DATETIME", null: false, desc: "Thời gian cập nhật" }
      ],
      relations: [
        "belongsTo User (foreignKey: user_id, as: 'User')",
        "belongsTo RestaurantTable (foreignKey: table_id, as: 'table')",
        "hasMany Order (foreignKey: reservation_id)"
      ]
    },
    {
      name: "Review",
      table: "reviews",
      description: "Đánh giá, nhận xét và số sao của khách hàng về món ăn/dịch vụ.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "phone", type: "VARCHAR(20)", null: true, desc: "Số điện thoại người đánh giá" },
        { field: "dish_name", type: "VARCHAR(150)", null: true, desc: "Tên món ăn được đánh giá" },
        { field: "content", type: "TEXT", null: true, desc: "Nội dung nhận xét chi tiết" },
        { field: "rating", type: "INTEGER", null: false, desc: "Số sao đánh giá (1 đến 5 sao)" },
        { field: "user_id", type: "BIGINT", fk: true, null: true, desc: "Khóa ngoại người dùng" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian gửi đánh giá" },
        { field: "updated_at", type: "DATETIME", null: false, desc: "Thời gian cập nhật" }
      ],
      relations: [
        "belongsTo User (foreignKey: user_id, as: 'user')"
      ]
    },
    {
      name: "Payment",
      table: "payments",
      description: "Giao dịch thanh toán của đơn hàng.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "amount", type: "DECIMAL(10,2)", null: false, desc: "Số tiền thanh toán" },
        { field: "paymentMethod", type: "ENUM('CASH','VNPAY','MOMO','BANKING')", null: false, desc: "Cổng / Phương thức thanh toán" },
        { field: "transactionCode", type: "VARCHAR(255)", null: true, desc: "Mã giao dịch từ cổng thanh toán" },
        { field: "status", type: "ENUM('PENDING','SUCCESS','FAILED')", default: "'PENDING'", null: false, desc: "Trạng thái giao dịch" },
        { field: "paidAt", type: "DATETIME", null: true, desc: "Thời điểm hoàn tất thanh toán" },
        { field: "order_id", type: "BIGINT", fk: true, null: false, desc: "Khóa ngoại đơn hàng" },
        { field: "created_at", type: "DATETIME", null: false, desc: "Thời gian tạo" }
      ],
      relations: [
        "belongsTo Order (foreignKey: order_id)"
      ]
    },
    {
      name: "Cart & CartItem",
      table: "carts, cart_items",
      description: "Giỏ hàng tạm thời của người dùng khi chọn món.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "totalPrice", type: "DECIMAL(10,2)", default: "0", null: false, desc: "Tổng tiền giỏ hàng" },
        { field: "user_id", type: "BIGINT", fk: true, null: false, desc: "Khóa ngoại người dùng" },
        { field: "quantity", type: "INTEGER", default: "1", null: false, desc: "Số lượng trong CartItem" },
        { field: "unitPrice", type: "DECIMAL(10,2)", null: false, desc: "Đơn giá món trong CartItem" }
      ],
      relations: [
        "User hasOne Cart",
        "Cart hasMany CartItem",
        "CartItem belongsTo Product"
      ]
    },
    {
      name: "Notification",
      table: "notifications",
      description: "Thông báo hệ thống, đơn hàng và ưu đãi gửi đến người dùng.",
      attributes: [
        { field: "id", type: "BIGINT", pk: true, ai: true, null: false, desc: "Khóa chính" },
        { field: "title", type: "VARCHAR(255)", null: false, desc: "Tiêu đề thông báo" },
        { field: "content", type: "TEXT", null: false, desc: "Nội dung chi tiết thông báo" },
        { field: "type", type: "ENUM('ORDER','PAYMENT','POINT','PROMOTION','SYSTEM')", default: "'SYSTEM'", null: false, desc: "Phân loại thông báo" },
        { field: "is_read", type: "BOOLEAN", default: "false", null: false, desc: "Đã đọc hay chưa" }
      ],
      relations: []
    }
  ],

  modules: [
    {
      id: "auth",
      name: "Authentication",
      title: "Xác thực & Phân quyền",
      icon: "fa-shield-alt",
      description: "Đăng ký tài khoản mới, đăng nhập trả về JWT token và kiểm tra kết nối xác thực.",
      endpoints: [
        {
          id: "auth_register",
          name: "Đăng ký tài khoản người dùng mới",
          method: "POST",
          path: "/api/auth/register",
          summary: "Tạo tài khoản khách hàng mới trong hệ thống",
          description: "API cho phép khách hàng đăng ký tài khoản bằng số điện thoại, tên đăng nhập và mật khẩu. Hệ thống sẽ băm mật khẩu bằng Bcrypt và kiểm tra tính duy nhất của số điện thoại / username.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "fullName", type: "string", required: true, desc: "Họ và tên người dùng", example: "Nguyễn Văn A" },
              { name: "phone", type: "string", required: true, desc: "Số điện thoại duy nhất", example: "0901234567" },
              { name: "username", type: "string", required: true, desc: "Tên đăng nhập duy nhất", example: "nguyenvana" },
              { name: "password", type: "string", required: true, desc: "Mật khẩu đăng ký", example: "Password@123" },
              { name: "email", type: "string", required: false, desc: "Địa chỉ email (tùy chọn)", example: "nguyenvana@example.com" }
            ],
            example: {
              fullName: "Nguyễn Văn A",
              phone: "0901234567",
              username: "nguyenvana",
              password: "Password@123",
              email: "nguyenvana@example.com"
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Đăng ký thành công",
              example: {
                message: "Đăng ký thành công!",
                user: {
                  id: 1,
                  fullName: "Nguyễn Văn A",
                  username: "nguyenvana",
                  phone: "0901234567"
                }
              }
            },
            {
              statusCode: 400,
              description: "Số điện thoại hoặc Tên đăng nhập đã tồn tại",
              example: {
                message: "Số điện thoại này đã được đăng ký!"
              }
            },
            {
              statusCode: 500,
              description: "Lỗi xử lý cơ sở dữ liệu trên server",
              example: {
                message: "Lỗi server",
                error: "Validation error"
              }
            }
          ]
        },
        {
          id: "auth_login",
          name: "Đăng nhập & Nhận JWT Token",
          method: "POST",
          path: "/api/auth/login",
          summary: "Xác thực tài khoản và trả về JWT Bearer Token (7 ngày)",
          description: "Khách hàng, nhân viên hoặc admin nhập `account` (hỗ trợ nhập username, số điện thoại hoặc email) và `password`. Khi xác thực thành công, trả về JWT Token chứa `id` và `role` cùng thông tin người dùng.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "account", type: "string", required: true, desc: "Tên đăng nhập, số điện thoại hoặc email", example: "0901234567" },
              { name: "password", type: "string", required: true, desc: "Mật khẩu tài khoản", example: "Password@123" }
            ],
            example: {
              account: "0901234567",
              password: "Password@123"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Đăng nhập thành công, trả về token",
              example: {
                message: "Đăng nhập thành công!",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzg2NjU1Nzg5LCJleHAiOjE3ODcyNjA1ODl9...",
                user: {
                  id: 1,
                  fullName: "Nguyễn Văn A",
                  username: "nguyenvana",
                  phone: "0901234567",
                  role: "CUSTOMER"
                }
              }
            },
            {
              statusCode: 400,
              description: "Thiếu thông tin hoặc Mật khẩu không chính xác",
              example: {
                message: "Mật khẩu không chính xác!"
              }
            },
            {
              statusCode: 404,
              description: "Tài khoản không tồn tại trong hệ thống",
              example: {
                message: "Tài khoản không tồn tại!"
              }
            }
          ]
        },
        {
          id: "auth_test",
          name: "Kiểm tra kết nối Auth (Health Check)",
          method: "GET",
          path: "/api/auth/test",
          summary: "Kiểm tra route authentication có hoạt động bình thường không",
          description: "Endpoint kiểm tra nhanh trạng thái sẵn sàng của module authentication.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Route hoạt động bình thường",
              example: "Auth route is working!"
            }
          ]
        }
      ]
    },

    {
      id: "users",
      name: "Users & Profiles",
      title: "Quản lý Người dùng & Hồ sơ",
      icon: "fa-users",
      description: "Quản trị danh sách người dùng, hồ sơ cá nhân, cấp quyền và chặn tài khoản.",
      endpoints: [
        {
          id: "users_get_all",
          name: "Lấy danh sách tất cả người dùng",
          method: "GET",
          path: "/api/users",
          summary: "Lấy danh sách người dùng có hỗ trợ lọc và tìm kiếm",
          description: "Chỉ dành cho **Admin** hoặc **Staff**. Hỗ trợ tìm kiếm theo tên, username, email, số điện thoại và lọc theo vai trò (role) hoặc trạng thái (status). Kết quả tự động loại trừ trường mật khẩu.",
          authRequired: true,
          authType: "STAFF_ADMIN",
          allowedRoles: ["ADMIN", "STAFF"],
          parameters: [
            { name: "search", in: "query", type: "string", required: false, desc: "Tìm kiếm gần đúng theo fullName, username, email hoặc phone", example: "Nguyen" },
            { name: "role", in: "query", type: "string", required: false, desc: "Lọc theo vai trò", example: "CUSTOMER", enum: ["CUSTOMER", "STAFF", "KITCHEN", "ADMIN"] },
            { name: "status", in: "query", type: "string", required: false, desc: "Lọc theo trạng thái tài khoản", example: "ACTIVE", enum: ["ACTIVE", "BLOCKED"] }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách người dùng",
              example: [
                {
                  id: 1,
                  fullName: "Nguyễn Văn A",
                  email: "user@example.com",
                  phone: "0901234567",
                  username: "nguyenvana",
                  avatar: "/uploads/avatar1.jpg",
                  points: 25000,
                  role: "CUSTOMER",
                  status: "ACTIVE",
                  created_at: "2026-08-10T08:30:00.000Z",
                  updated_at: "2026-08-12T14:20:00.000Z"
                }
              ]
            },
            {
              statusCode: 401,
              description: "Thiếu hoặc sai JWT Token",
              example: { message: "No token" }
            },
            {
              statusCode: 403,
              description: "Không đủ quyền truy cập (Staff or Admin only)",
              example: { message: "Access denied. Staff or Admin only." }
            }
          ]
        },
        {
          id: "users_get_profile",
          name: "Lấy thông tin cá nhân",
          method: "GET",
          path: "/api/users/profile",
          summary: "Lấy chi tiết thông tin hồ sơ của tài khoản đang đăng nhập",
          description: "Yêu cầu JWT Token. Backend đọc `userId` từ token đã giải mã để truy vấn cơ sở dữ liệu.",
          authRequired: true,
          authType: "AUTHENTICATED",
          allowedRoles: ["CUSTOMER", "STAFF", "KITCHEN", "ADMIN"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Thông tin hồ sơ người dùng",
              example: {
                id: 1,
                fullName: "Nguyễn Văn A",
                email: "user@example.com",
                phone: "0901234567",
                username: "nguyenvana",
                avatar: "/uploads/avatar1.jpg",
                points: 25000,
                role: "CUSTOMER",
                status: "ACTIVE",
                created_at: "2026-08-10T08:30:00.000Z"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy người dùng",
              example: { message: "Không tìm thấy người dùng" }
            }
          ]
        },
        {
          id: "users_update_profile",
          name: "Cập nhật thông tin cá nhân",
          method: "PUT",
          path: "/api/users/profile",
          summary: "Người dùng tự cập nhật họ tên, email, SĐT hoặc ảnh đại diện",
          description: "Yêu cầu JWT Token. Cập nhật các trường thông tin cá nhân của tài khoản hiện tại.",
          authRequired: true,
          authType: "AUTHENTICATED",
          allowedRoles: ["CUSTOMER", "STAFF", "KITCHEN", "ADMIN"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "fullName", type: "string", required: false, desc: "Họ và tên mới", example: "Nguyễn Văn A (Đã cập nhật)" },
              { name: "email", type: "string", required: false, desc: "Email mới", example: "newemail@example.com" },
              { name: "phone", type: "string", required: false, desc: "Số điện thoại mới", example: "0909999888" },
              { name: "avatar", type: "string", required: false, desc: "Đường dẫn ảnh đại diện", example: "/uploads/image-17235555.png" }
            ],
            example: {
              fullName: "Nguyễn Văn A (Đã cập nhật)",
              email: "newemail@example.com",
              phone: "0909999888",
              avatar: "/uploads/image-17235555.png"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật hồ sơ thành công",
              example: {
                message: "Cập nhật hồ sơ thành công",
                user: {
                  id: 1,
                  fullName: "Nguyễn Văn A (Đã cập nhật)",
                  email: "newemail@example.com",
                  phone: "0909999888",
                  avatar: "/uploads/image-17235555.png"
                }
              }
            }
          ]
        },
        {
          id: "users_get_by_id",
          name: "Lấy chi tiết người dùng theo ID",
          method: "GET",
          path: "/api/users/:id",
          summary: "Admin xem chi tiết một người dùng cụ thể",
          description: "Chỉ dành cho **Admin**. Yêu cầu `id` trên đường dẫn URL.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "Mã định danh User ID", example: 1 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Chi tiết người dùng",
              example: {
                id: 1,
                fullName: "Nguyễn Văn A",
                email: "user@example.com",
                phone: "0901234567",
                username: "nguyenvana",
                points: 25000,
                role: "CUSTOMER",
                status: "ACTIVE"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy người dùng",
              example: { message: "Không tìm thấy người dùng" }
            }
          ]
        },
        {
          id: "users_create",
          name: "Tạo người dùng mới (Admin)",
          method: "POST",
          path: "/api/users",
          summary: "Admin tạo mới tài khoản nhân viên, đầu bếp hoặc khách hàng",
          description: "Chỉ dành cho **Admin**. Cho phép gán trực tiếp vai trò `STAFF`, `KITCHEN`, `ADMIN` hoặc `CUSTOMER`.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "fullName", type: "string", required: true, desc: "Họ và tên", example: "Trần Thị B" },
              { name: "email", type: "string", required: false, desc: "Email", example: "staff01@example.com" },
              { name: "phone", type: "string", required: true, desc: "Số điện thoại", example: "0987654321" },
              { name: "username", type: "string", required: true, desc: "Tên đăng nhập", example: "staff_b" },
              { name: "password", type: "string", required: true, desc: "Mật khẩu khởi tạo", example: "StaffPass123" },
              { name: "role", type: "string", required: false, desc: "Vai trò người dùng (Mặc định: CUSTOMER)", example: "STAFF", enum: ["CUSTOMER", "STAFF", "KITCHEN", "ADMIN"] }
            ],
            example: {
              fullName: "Trần Thị B",
              email: "staff01@example.com",
              phone: "0987654321",
              username: "staff_b",
              password: "StaffPass123",
              role: "STAFF"
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Tạo người dùng thành công",
              example: {
                message: "Tạo người dùng thành công",
                user: {
                  id: 2,
                  fullName: "Trần Thị B",
                  username: "staff_b"
                }
              }
            },
            {
              statusCode: 400,
              description: "Tài khoản hoặc số điện thoại đã tồn tại",
              example: { message: "Tài khoản hoặc số điện thoại đã tồn tại" }
            }
          ]
        },
        {
          id: "users_update",
          name: "Cập nhật thông tin người dùng theo ID",
          method: "PUT",
          path: "/api/users/:id",
          summary: "Cập nhật người dùng với phân quyền chặt chẽ (Admin / Staff)",
          description: "Dành cho **Admin** hoặc **Staff**.\n- **Admin**: Có thể cập nhật tất cả trường (`role`, `status`, `points`, `fullName`, `email`, `phone`, `username`, `avatar`). Có cơ chế chống Admin tự khóa tài khoản của chính mình.\n- **Staff**: Chỉ được cập nhật `points`, `fullName`, `phone`, `avatar` (chống lỗi Mass Assignment).",
          authRequired: true,
          authType: "STAFF_ADMIN",
          allowedRoles: ["ADMIN", "STAFF"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID người dùng cần cập nhật", example: 1 }
          ],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "fullName", type: "string", required: false, desc: "Họ và tên mới", example: "Nguyễn Văn A" },
              { name: "points", type: "integer", required: false, desc: "Điểm thưởng cập nhật", example: 50000 },
              { name: "role", type: "string", required: false, desc: "Vai trò mới (Admin only)", example: "STAFF", enum: ["CUSTOMER", "STAFF", "KITCHEN", "ADMIN"] },
              { name: "status", type: "string", required: false, desc: "Trạng thái mới (Admin only)", example: "ACTIVE", enum: ["ACTIVE", "BLOCKED"] }
            ],
            example: {
              fullName: "Nguyễn Văn A",
              points: 50000,
              status: "ACTIVE"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật thành công",
              example: {
                message: "Cập nhật thành công",
                user: {
                  id: 1,
                  fullName: "Nguyễn Văn A",
                  points: 50000,
                  status: "ACTIVE"
                }
              }
            },
            {
              statusCode: 400,
              description: "Admin tự khóa tài khoản chính mình",
              example: { message: "Bạn không thể tự khóa tài khoản của chính mình" }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy người dùng",
              example: { message: "Không tìm thấy người dùng" }
            }
          ]
        },
        {
          id: "users_delete",
          name: "Xóa người dùng (Admin)",
          method: "DELETE",
          path: "/api/users/:id",
          summary: "Admin xóa vĩnh viễn tài khoản người dùng",
          description: "Chỉ dành cho **Admin**. Có cơ chế phòng vệ chống việc Admin tự xóa tài khoản của chính mình.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID người dùng cần xóa", example: 5 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Xóa thành công",
              example: { message: "Xóa người dùng thành công" }
            },
            {
              statusCode: 400,
              description: "Admin tự xóa tài khoản của chính mình",
              example: { message: "Bạn không thể tự xóa tài khoản của chính mình" }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy người dùng",
              example: { message: "Không tìm thấy người dùng" }
            }
          ]
        }
      ]
    },

    {
      id: "categories",
      name: "Categories",
      title: "Quản lý Danh mục Món ăn",
      icon: "fa-tags",
      description: "Quản lý các danh mục thực đơn (Khai vị, Món chính, Tráng miệng, Đồ uống...).",
      endpoints: [
        {
          id: "categories_get_all",
          name: "Lấy danh sách tất cả danh mục",
          method: "GET",
          path: "/api/categories",
          summary: "Lấy danh sách danh mục món ăn (kèm số lượng sản phẩm trong từng danh mục)",
          description: "API công khai. Tự động tính toán trường `productCount` cho mỗi danh mục.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [
            { name: "search", in: "query", type: "string", required: false, desc: "Tìm kiếm theo tên hoặc mô tả danh mục", example: "nướng" }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách danh mục kèm số lượng món",
              example: [
                {
                  id: 1,
                  name: "Món Nướng BBQ",
                  description: "Các món nướng than hoa thơm lừng hảo hạng",
                  image: "/uploads/category-bbq.jpg",
                  created_at: "2026-08-10T08:00:00.000Z",
                  productCount: 12
                },
                {
                  id: 2,
                  name: "Lẩu & Soup",
                  description: "Nồi lẩu nóng hổi cho gia đình và bạn bè",
                  image: "/uploads/category-hotpot.jpg",
                  created_at: "2026-08-10T08:05:00.000Z",
                  productCount: 8
                }
              ]
            }
          ]
        },
        {
          id: "categories_get_by_id",
          name: "Lấy chi tiết danh mục theo ID",
          method: "GET",
          path: "/api/categories/:id",
          summary: "Xem thông tin chi tiết của một danh mục",
          description: "API công khai truy vấn danh mục theo khóa chính `id`.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID danh mục", example: 1 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Chi tiết danh mục",
              example: {
                id: 1,
                name: "Món Nướng BBQ",
                description: "Các món nướng than hoa thơm lừng hảo hạng",
                image: "/uploads/category-bbq.jpg",
                created_at: "2026-08-10T08:00:00.000Z"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy danh mục",
              example: { message: "Not found" }
            }
          ]
        },
        {
          id: "categories_create",
          name: "Tạo danh mục mới (Admin)",
          method: "POST",
          path: "/api/categories",
          summary: "Admin tạo mới một danh mục thực đơn",
          description: "Chỉ dành cho **Admin**. Yêu cầu JWT token quyền Admin.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "name", type: "string", required: true, desc: "Tên danh mục món", example: "Đồ Uống & Tráng Miệng" },
              { name: "description", type: "string", required: false, desc: "Mô tả danh mục", example: "Nước ngọt, cocktail, bia và bánh ngọt" },
              { name: "image", type: "string", required: false, desc: "Đường dẫn ảnh đại diện", example: "/uploads/category-drinks.jpg" }
            ],
            example: {
              name: "Đồ Uống & Tráng Miệng",
              description: "Nước ngọt, cocktail, bia và bánh ngọt",
              image: "/uploads/category-drinks.jpg"
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Tạo danh mục thành công",
              example: {
                id: 3,
                name: "Đồ Uống & Tráng Miệng",
                description: "Nước ngọt, cocktail, bia và bánh ngọt",
                image: "/uploads/category-drinks.jpg",
                created_at: "2026-08-13T10:00:00.000Z"
              }
            },
            {
              statusCode: 400,
              description: "Dữ liệu gửi lên không hợp lệ",
              example: { message: "Validation error" }
            }
          ]
        },
        {
          id: "categories_update",
          name: "Cập nhật danh mục (Admin)",
          method: "PUT",
          path: "/api/categories/:id",
          summary: "Admin cập nhật thông tin danh mục món",
          description: "Chỉ dành cho **Admin**. Cập nhật tên, mô tả hoặc ảnh danh mục.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID danh mục cần cập nhật", example: 1 }
          ],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "name", type: "string", required: false, desc: "Tên mới", example: "Món Nướng BBQ Cao Cấp" },
              { name: "description", type: "string", required: false, desc: "Mô tả mới", example: "Cập nhật mô tả mới" },
              { name: "image", type: "string", required: false, desc: "Ảnh mới", example: "/uploads/category-bbq-v2.jpg" }
            ],
            example: {
              name: "Món Nướng BBQ Cao Cấp",
              description: "Cập nhật mô tả mới",
              image: "/uploads/category-bbq-v2.jpg"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật danh mục thành công",
              example: {
                id: 1,
                name: "Món Nướng BBQ Cao Cấp",
                description: "Cập nhật mô tả mới",
                image: "/uploads/category-bbq-v2.jpg"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy danh mục",
              example: { message: "Not found" }
            }
          ]
        },
        {
          id: "categories_delete",
          name: "Xóa danh mục (Admin)",
          method: "DELETE",
          path: "/api/categories/:id",
          summary: "Admin xóa danh mục khỏi thực đơn",
          description: "Chỉ dành cho **Admin**. Trả về status 204 No Content khi xóa thành công.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID danh mục cần xóa", example: 3 }
          ],
          responses: [
            {
              statusCode: 204,
              description: "Xóa thành công (Không có body)",
              example: null
            },
            {
              statusCode: 404,
              description: "Không tìm thấy danh mục",
              example: { message: "Not found" }
            }
          ]
        }
      ]
    },

    {
      id: "products",
      name: "Products",
      title: "Quản lý Món ăn & Thực đơn",
      icon: "fa-utensils",
      description: "Quản lý danh sách món ăn, giá tiền, hình ảnh, trạng thái còn món và tồn kho.",
      endpoints: [
        {
          id: "products_get_all",
          name: "Lấy danh sách tất cả món ăn",
          method: "GET",
          path: "/api/products",
          summary: "Lấy danh sách món ăn với bộ lọc danh mục và tìm kiếm tên món",
          description: "API công khai dùng cho menu trang chủ và ứng dụng di động quét mã QR.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [
            { name: "category_id", in: "query", type: "integer", required: false, desc: "Lọc món ăn theo ID danh mục", example: 1 },
            { name: "search", in: "query", type: "string", required: false, desc: "Tìm kiếm gần đúng theo tên món ăn", example: "Bò" }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách món ăn",
              example: [
                {
                  id: 1,
                  name: "Bò Wagyu Nướng Đá Muối",
                  description: "Thịt bò Wagyu A5 thượng hạng nướng trên phiến đá muối Himalaya",
                  price: "350000.00",
                  image: "/uploads/product-wagyu.jpg",
                  stock: 50,
                  isAvailable: true,
                  category_id: 1,
                  created_at: "2026-08-10T09:00:00.000Z",
                  updated_at: "2026-08-10T09:00:00.000Z"
                },
                {
                  id: 2,
                  name: "Lẩu Nấm Hải Sản Hoàng Gia",
                  description: "Nước lẩu ngọt thanh từ xương hầm và 8 loại nấm quý kèm hải sản tươi",
                  price: "420000.00",
                  image: "/uploads/product-hotpot.jpg",
                  stock: 30,
                  isAvailable: true,
                  category_id: 2,
                  created_at: "2026-08-10T09:10:00.000Z",
                  updated_at: "2026-08-10T09:10:00.000Z"
                }
              ]
            }
          ]
        },
        {
          id: "products_get_by_id",
          name: "Lấy chi tiết món ăn theo ID",
          method: "GET",
          path: "/api/products/:id",
          summary: "Xem thông tin chi tiết một món ăn cụ thể",
          description: "API công khai tra cứu món ăn theo ID.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "Mã ID món ăn", example: 1 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Chi tiết món ăn",
              example: {
                id: 1,
                name: "Bò Wagyu Nướng Đá Muối",
                description: "Thịt bò Wagyu A5 thượng hạng nướng trên phiến đá muối Himalaya",
                price: "350000.00",
                image: "/uploads/product-wagyu.jpg",
                stock: 50,
                isAvailable: true,
                category_id: 1
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy món ăn",
              example: { message: "Product not found" }
            }
          ]
        },
        {
          id: "products_create",
          name: "Tạo món ăn mới (Admin)",
          method: "POST",
          path: "/api/products",
          summary: "Admin thêm món ăn mới vào thực đơn",
          description: "Chỉ dành cho **Admin**. Yêu cầu JWT token Admin.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "name", type: "string", required: true, desc: "Tên món ăn", example: "Cá Hồi Nướng Sốt Teriyaki" },
              { name: "description", type: "string", required: false, desc: "Mô tả chi tiết", example: "Cá hồi tươi Na Uy nướng sốt đậm đà" },
              { name: "price", type: "number", required: true, desc: "Đơn giá (VNĐ)", example: 280000 },
              { name: "image", type: "string", required: false, desc: "Đường dẫn ảnh", example: "/uploads/product-salmon.jpg" },
              { name: "stock", type: "integer", required: false, desc: "Số lượng tồn (Mặc định: 0)", example: 40 },
              { name: "isAvailable", type: "boolean", required: false, desc: "Trạng thái sẵn sàng phục vụ (Mặc định: true)", example: true },
              { name: "category_id", type: "integer", required: true, desc: "ID danh mục chứa món này", example: 1 }
            ],
            example: {
              name: "Cá Hồi Nướng Sốt Teriyaki",
              description: "Cá hồi tươi Na Uy nướng sốt đậm đà",
              price: 280000,
              image: "/uploads/product-salmon.jpg",
              stock: 40,
              isAvailable: true,
              category_id: 1
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Tạo món ăn thành công",
              example: {
                id: 3,
                name: "Cá Hồi Nướng Sốt Teriyaki",
                price: 280000,
                stock: 40,
                isAvailable: true,
                category_id: 1,
                created_at: "2026-08-13T10:30:00.000Z"
              }
            },
            {
              statusCode: 400,
              description: "Dữ liệu không hợp lệ hoặc sai category_id",
              example: { message: "Validation error" }
            }
          ]
        },
        {
          id: "products_update",
          name: "Cập nhật món ăn (Admin)",
          method: "PUT",
          path: "/api/products/:id",
          summary: "Admin sửa đổi thông tin, giá bán hoặc trạng thái còn món",
          description: "Chỉ dành cho **Admin**. Cập nhật thông tin chi tiết món ăn.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID món ăn cần cập nhật", example: 1 }
          ],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "name", type: "string", required: false, desc: "Tên món mới", example: "Bò Wagyu Nướng Đá Muối (Set Đặc Biệt)" },
              { name: "price", type: "number", required: false, desc: "Đơn giá mới", example: 380000 },
              { name: "isAvailable", type: "boolean", required: false, desc: "Còn món hay hết món", example: true }
            ],
            example: {
              name: "Bò Wagyu Nướng Đá Muối (Set Đặc Biệt)",
              price: 380000,
              isAvailable: true
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật món ăn thành công",
              example: {
                id: 1,
                name: "Bò Wagyu Nướng Đá Muối (Set Đặc Biệt)",
                price: "380000.00",
                isAvailable: true
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy món ăn",
              example: { message: "Product not found" }
            }
          ]
        },
        {
          id: "products_delete",
          name: "Xóa món ăn (Admin)",
          method: "DELETE",
          path: "/api/products/:id",
          summary: "Admin xóa món ăn khỏi cơ sở dữ liệu",
          description: "Chỉ dành cho **Admin**. Trả về status 204 No Content khi xóa thành công.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID món ăn cần xóa", example: 3 }
          ],
          responses: [
            {
              statusCode: 204,
              description: "Xóa món ăn thành công (No content)",
              example: null
            },
            {
              statusCode: 404,
              description: "Không tìm thấy món ăn",
              example: { message: "Product not found" }
            }
          ]
        }
      ]
    },

    {
      id: "tables",
      name: "Restaurant Tables & QR",
      title: "Bàn ăn & Mã QR Ordering",
      icon: "fa-qrcode",
      description: "Quản lý bàn ăn, tính toán thời gian ngồi thực tế, tạo mã QR và quét mã tại bàn.",
      endpoints: [
        {
          id: "tables_get_all",
          name: "Lấy danh sách tất cả bàn ăn (Real-time Analytics)",
          method: "GET",
          path: "/api/tables",
          summary: "Lấy toàn bộ bàn ăn kèm tính toán thời gian khách ngồi và cảnh báo lịch đặt bàn",
          description: "API trả về danh sách bàn kèm phân tích động thời gian thực:\n- `timeUsed`: Định dạng thời gian khách đã ngồi (VD: `1h 15p` hoặc `45p`).\n- `calculatedStatus`: Trạng thái thực tế (`AVAILABLE`, `BOOKED`, `OCCUPIED`, `CLEANING`).\n- `waitingAlert`: Báo động khi khách đã đến giờ đặt bàn nhưng chưa check-in.\n- `activeReservation`: Chi tiết lịch đặt bàn liên quan.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["CUSTOMER", "STAFF", "ADMIN", "KITCHEN"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách bàn ăn kèm phân tích",
              example: [
                {
                  id: 1,
                  tableNumber: 1,
                  qrCode: "TABLE_01",
                  capacity: 4,
                  status: "OCCUPIED",
                  occupiedSince: "2026-08-13T11:15:00.000Z",
                  timeUsedMins: 45,
                  timeUsed: "45p",
                  guestCount: 3,
                  calculatedStatus: "OCCUPIED"
                },
                {
                  id: 2,
                  tableNumber: 2,
                  qrCode: "TABLE_02",
                  capacity: 6,
                  status: "AVAILABLE",
                  calculatedStatus: "AVAILABLE"
                }
              ]
            }
          ]
        },
        {
          id: "tables_get_by_qr",
          name: "Quét mã QR bàn ăn (QR Scanner)",
          method: "GET",
          path: "/api/tables/qr/:qrCode",
          summary: "Tra cứu thông tin bàn khi khách hàng quét mã QR dán trên bàn",
          description: "App di động / Web quét mã QR lấy chuỗi `qrCode` (VD: `TABLE_01`) và gọi endpoint này để lấy `tableNumber` và `id` phục vụ việc đặt món.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [
            { name: "qrCode", in: "path", type: "string", required: true, desc: "Chuỗi mã QR duy nhất dán trên bàn", example: "TABLE_01" }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Thông tin bàn quét được",
              example: {
                id: 1,
                tableNumber: 1,
                qrCode: "TABLE_01",
                capacity: 4,
                status: "AVAILABLE"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy bàn với mã QR này",
              example: { message: "Không tìm thấy bàn với mã QR này" }
            }
          ]
        },
        {
          id: "tables_create",
          name: "Tạo bàn ăn mới",
          method: "POST",
          path: "/api/tables",
          summary: "Tạo một bàn ăn đơn lẻ",
          description: "Thêm bàn mới vào hệ thống với số bàn, sức chứa và mã QR tương ứng.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["ADMIN", "STAFF"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "tableNumber", type: "integer", required: true, desc: "Số hiệu bàn ăn (Duy nhất)", example: 11 },
              { name: "capacity", type: "integer", required: false, desc: "Sức chứa tối đa (Mặc định: 4)", example: 6 },
              { name: "qrCode", type: "string", required: false, desc: "Mã QR định danh (Mặc định: T + tableNumber)", example: "TABLE_11" },
              { name: "status", type: "string", required: false, desc: "Trạng thái khởi tạo", example: "AVAILABLE", enum: ["AVAILABLE", "BOOKED", "OCCUPIED", "CLEANING"] }
            ],
            example: {
              tableNumber: 11,
              capacity: 6,
              qrCode: "TABLE_11",
              status: "AVAILABLE"
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Tạo bàn thành công",
              example: {
                message: "Tạo bàn mới thành công",
                table: {
                  id: 11,
                  tableNumber: 11,
                  capacity: 6,
                  qrCode: "TABLE_11",
                  status: "AVAILABLE"
                }
              }
            },
            {
              statusCode: 400,
              description: "Số bàn đã tồn tại",
              example: { message: "Bàn #11 đã tồn tại trong hệ thống!" }
            }
          ]
        },
        {
          id: "tables_bulk_create",
          name: "Tạo hàng loạt bàn ăn (Bulk Insert)",
          method: "POST",
          path: "/api/tables/bulk",
          summary: "Khởi tạo nhanh nhiều bàn ăn cùng một lúc",
          description: "Gửi lên một mảng JSON danh sách các bàn. Hỗ trợ tự động cập nhật nếu đã tồn tại (`updateOnDuplicate`).",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["ADMIN"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "tables", type: "array", required: true, desc: "Mảng danh sách các bàn ăn", example: [{ tableNumber: 1, capacity: 4, qrCode: "TABLE_01", status: "AVAILABLE" }] }
            ],
            example: [
              { tableNumber: 1, capacity: 4, qrCode: "TABLE_01", status: "AVAILABLE" },
              { tableNumber: 2, capacity: 4, qrCode: "TABLE_02", status: "AVAILABLE" },
              { tableNumber: 3, capacity: 6, qrCode: "TABLE_03", status: "AVAILABLE" }
            ]
          },
          responses: [
            {
              statusCode: 201,
              description: "Nạp dữ liệu bàn hàng loạt thành công",
              example: {
                message: "Đã xử lý thành công 3 bàn trong hệ thống",
                data: [
                  { id: 1, tableNumber: 1, qrCode: "TABLE_01", capacity: 4 },
                  { id: 2, tableNumber: 2, qrCode: "TABLE_02", capacity: 4 },
                  { id: 3, tableNumber: 3, qrCode: "TABLE_03", capacity: 6 }
                ]
              }
            }
          ]
        },
        {
          id: "tables_update",
          name: "Cập nhật thông tin bàn ăn",
          method: "PUT",
          path: "/api/tables/:id",
          summary: "Cập nhật sức chứa, số bàn hoặc mã QR",
          description: "Hỗ trợ truyền `id` hoặc `tableNumber` trên URL. **Nghiệp vụ quan trọng**: Không thể chuyển trạng thái bàn về `AVAILABLE` (Bàn trống) nếu bàn này vẫn còn đơn hàng chưa thanh toán (`paymentStatus !== 'PAID'`).",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["ADMIN", "STAFF"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, desc: "ID hoặc số hiệu bàn ăn", example: "1" }
          ],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "tableNumber", type: "integer", required: false, desc: "Số hiệu bàn", example: 1 },
              { name: "capacity", type: "integer", required: false, desc: "Sức chứa mới", example: 8 },
              { name: "qrCode", type: "string", required: false, desc: "Mã QR mới", example: "TABLE_01_VIP" },
              { name: "status", type: "string", required: false, desc: "Trạng thái", example: "AVAILABLE", enum: ["AVAILABLE", "BOOKED", "OCCUPIED", "CLEANING"] }
            ],
            example: {
              capacity: 8,
              status: "AVAILABLE"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật bàn thành công",
              example: {
                message: "Cập nhật bàn thành công",
                table: {
                  id: 1,
                  tableNumber: 1,
                  capacity: 8,
                  status: "AVAILABLE"
                }
              }
            },
            {
              statusCode: 400,
              description: "Bàn còn đơn hàng chưa thanh toán",
              example: {
                message: "Không thể chuyển Bàn #1 về trạng thái 'Bàn trống' vì bàn này còn Đơn hàng #5 chưa thanh toán!"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy bàn ăn",
              example: { message: "Không tìm thấy bàn ăn" }
            }
          ]
        },
        {
          id: "tables_update_status",
          name: "Cập nhật nhanh trạng thái bàn ăn",
          method: "PUT",
          path: "/api/tables/:id/status",
          summary: "Nhân viên cập nhật trạng thái bàn (Ví dụ: Chuyển sang Dọn dẹp CLEANING)",
          description: "Endpoint rút gọn chỉ cập nhật trường `status` của bàn. Kiểm tra ràng buộc đơn hàng chưa thanh toán.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, desc: "ID hoặc số hiệu bàn ăn", example: "1" }
          ],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "status", type: "string", required: true, desc: "Trạng thái mới của bàn", example: "CLEANING", enum: ["AVAILABLE", "BOOKED", "OCCUPIED", "CLEANING"] }
            ],
            example: {
              status: "CLEANING"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật trạng thái thành công",
              example: {
                message: "Cập nhật trạng thái bàn thành công",
                id: 1,
                status: "CLEANING"
              }
            }
          ]
        },
        {
          id: "tables_delete",
          name: "Xóa bàn ăn",
          method: "DELETE",
          path: "/api/tables/:id",
          summary: "Xóa bàn ăn khỏi danh sách nhà hàng",
          description: "Chỉ được phép xóa nếu bàn không có đơn hàng đang dang dở (chưa `COMPLETED` hoặc `CANCELLED`).",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, desc: "ID hoặc số bàn cần xóa", example: "11" }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Xóa bàn thành công",
              example: {
                message: "Xóa bàn ăn #11 thành công",
                id: 11
              }
            },
            {
              statusCode: 400,
              description: "Bàn đang có đơn hàng chưa hoàn tất",
              example: {
                message: "Không thể xóa Bàn #11 đang có đơn hàng #8 chưa hoàn tất!"
              }
            }
          ]
        }
      ]
    },

    {
      id: "orders",
      name: "Orders & Checkout",
      title: "Đơn hàng & Quy trình Phục vụ",
      icon: "fa-receipt",
      description: "Quy trình đặt món tại bàn, chế biến món ăn ở bếp, thanh toán hóa đơn và trừ điểm tích lũy.",
      endpoints: [
        {
          id: "orders_create",
          name: "Tạo đơn đặt món mới (Place Order)",
          method: "POST",
          path: "/api/orders",
          summary: "Khách quét QR đặt món tại bàn (Hỗ trợ áp dụng điểm thưởng)",
          description: "Endpoint hỗ trợ cả khách vãng lai (không token) và thành viên đăng nhập (kèm token):\n1. Chạy trong **Database Transaction**.\n2. Tự động kiểm tra giá và tính `totalPrice`.\n3. Nếu có `used_points`, hệ thống kiểm tra số dư và trừ điểm trực tiếp của User (tỷ lệ 1 điểm = 1 VNĐ).\n4. Tính `finalPrice = max(0, totalPrice - discountAmount)`.\n5. Tự động chuyển trạng thái bàn ăn sang `OCCUPIED`.\n6. Tạo hàng loạt bản ghi chi tiết món trong `order_items`.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["CUSTOMER", "STAFF"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "table_id", type: "integer", required: true, desc: "ID bàn ăn khách đang ngồi", example: 1 },
              { name: "items", type: "array", required: true, desc: "Danh sách món ăn đặt", example: [{ product_id: 1, quantity: 2, note: "Ít cay" }] },
              { name: "note", type: "string", required: false, desc: "Ghi chú chung cho toàn đơn", example: "Làm nóng giúp em" },
              { name: "used_points", type: "integer", required: false, desc: "Số điểm tích lũy muốn dùng để giảm giá", example: 20000 },
              { name: "user_id", type: "integer", required: false, desc: "ID người dùng (Nếu không truyền token)", example: 1 }
            ],
            example: {
              table_id: 1,
              items: [
                { product_id: 1, quantity: 2, note: "Ít cay" },
                { product_id: 2, quantity: 1, note: "Cho thêm 1 đĩa ớt" }
              ],
              note: "Phục vụ nhanh giúp bàn em",
              used_points: 20000
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Đặt món thành công",
              example: {
                message: "Đặt món thành công",
                data: {
                  id: 10,
                  table_id: 1,
                  user_id: 1,
                  totalPrice: "1120000.00",
                  discountAmount: "20000.00",
                  finalPrice: "1100000.00",
                  note: "Phục vụ nhanh giúp bàn em",
                  status: "PENDING",
                  paymentStatus: "UNPAID",
                  OrderItems: [
                    {
                      id: 21,
                      product_id: 1,
                      quantity: 2,
                      unitPrice: "350000.00",
                      totalPrice: "700000.00",
                      note: "Ít cay",
                      Product: { name: "Bò Wagyu Nướng Đá Muối" }
                    },
                    {
                      id: 22,
                      product_id: 2,
                      quantity: 1,
                      unitPrice: "420000.00",
                      totalPrice: "420000.00",
                      note: "Cho thêm 1 đĩa ớt",
                      Product: { name: "Lẩu Nấm Hải Sản Hoàng Gia" }
                    }
                  ]
                }
              }
            },
            {
              statusCode: 400,
              description: "Đơn hàng rỗng hoặc Điểm tích lũy không đủ",
              example: { message: "Số điểm tích lũy (10000) không đủ để áp dụng (20000)" }
            }
          ]
        },
        {
          id: "orders_get_my",
          name: "Lịch sử đơn hàng của tôi",
          method: "GET",
          path: "/api/orders/my-orders",
          summary: "Khách hàng xem lại các đơn hàng mình đã từng đặt",
          description: "Yêu cầu JWT Token. Lấy danh sách đơn hàng gắn với `user_id` của tài khoản hiện tại.",
          authRequired: true,
          authType: "AUTHENTICATED",
          allowedRoles: ["CUSTOMER", "STAFF", "ADMIN"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách đơn hàng của người dùng",
              example: [
                {
                  id: 10,
                  totalPrice: "1120000.00",
                  finalPrice: "1100000.00",
                  status: "COMPLETED",
                  paymentStatus: "PAID",
                  created_at: "2026-08-13T11:30:00.000Z",
                  RestaurantTable: { tableNumber: 1 },
                  OrderItems: [
                    {
                      quantity: 2,
                      unitPrice: "350000.00",
                      Product: { name: "Bò Wagyu Nướng Đá Muối" }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "orders_get_all",
          name: "Lấy tất cả đơn hàng (Hỗ trợ lọc)",
          method: "GET",
          path: "/api/orders",
          summary: "Nhân viên & Bếp xem toàn bộ đơn hàng trong ca làm việc",
          description: "Hỗ trợ lọc theo trạng thái chế biến (`status`) và trạng thái thanh toán (`paymentStatus`).",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["ADMIN", "STAFF", "KITCHEN"],
          parameters: [
            { name: "status", in: "query", type: "string", required: false, desc: "Lọc trạng thái đơn", example: "PREPARING", enum: ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"] },
            { name: "paymentStatus", in: "query", type: "string", required: false, desc: "Lọc trạng thái thanh toán", example: "UNPAID", enum: ["UNPAID", "PAID", "REFUNDED"] }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách đơn hàng",
              example: [
                {
                  id: 10,
                  table_id: 1,
                  status: "PREPARING",
                  paymentStatus: "UNPAID",
                  finalPrice: "1100000.00",
                  created_at: "2026-08-13T11:30:00.000Z",
                  RestaurantTable: { tableNumber: 1 },
                  User: { fullName: "Nguyễn Văn A", phone: "0901234567" },
                  OrderItems: [{ id: 21, quantity: 2, Product: { name: "Bò Wagyu Nướng Đá Muối" } }]
                }
              ]
            }
          ]
        },
        {
          id: "orders_get_by_id",
          name: "Lấy chi tiết đơn hàng theo ID",
          method: "GET",
          path: "/api/orders/:id",
          summary: "Tra cứu hóa đơn và danh sách món chi tiết",
          description: "Tra cứu đơn hàng kèm chi tiết bàn, người đặt và từng món ăn.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["CUSTOMER", "STAFF", "KITCHEN", "ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "Mã ID đơn hàng", example: 10 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Chi tiết đơn hàng",
              example: {
                id: 10,
                table_id: 1,
                status: "PREPARING",
                paymentStatus: "UNPAID",
                finalPrice: "1100000.00",
                OrderItems: []
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy đơn hàng",
              example: { message: "Không tìm thấy đơn hàng" }
            }
          ]
        },
        {
          id: "orders_update_status",
          name: "Cập nhật trạng thái đơn hàng (Bếp & Phục vụ)",
          method: "PUT",
          path: "/api/orders/:id/status",
          summary: "Cập nhật tiến độ: PENDING -> CONFIRMED -> PREPARING -> READY -> COMPLETED",
          description: "Đầu bếp hoặc nhân viên phục vụ cập nhật trạng thái chế biến của đơn.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "KITCHEN", "ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID đơn hàng", example: 10 }
          ],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "status", type: "string", required: true, desc: "Trạng thái mới", example: "READY", enum: ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"] }
            ],
            example: {
              status: "READY"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật trạng thái thành công",
              example: {
                message: "Cập nhật trạng thái thành công",
                data: {
                  id: 10,
                  status: "READY"
                }
              }
            }
          ]
        },
        {
          id: "orders_get_by_table",
          name: "Lấy các đơn chưa thanh toán của một bàn",
          method: "GET",
          path: "/api/orders/table/:tableId",
          summary: "Lấy tất cả các món đang ăn / chưa tính tiền của bàn",
          description: "Dùng để hiển thị hóa đơn tạm tính trên màn hình nhân viên hoặc thiết bị của khách.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "CUSTOMER"],
          parameters: [
            { name: "tableId", in: "path", type: "integer", required: true, desc: "ID bàn ăn", example: 1 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách đơn hàng chưa thanh toán của bàn",
              example: [
                {
                  id: 10,
                  table_id: 1,
                  paymentStatus: "UNPAID",
                  status: "READY",
                  finalPrice: "1100000.00",
                  OrderItems: []
                }
              ]
            }
          ]
        },
        {
          id: "orders_pay_all_table",
          name: "Thanh toán gộp toàn bộ bàn (Pay All Orders)",
          method: "PUT",
          path: "/api/orders/table/:tableId/pay-all",
          summary: "Thanh toán tất cả đơn hàng của bàn, giải phóng bàn và kết thúc đặt bàn",
          description: "Quy trình thanh toán gộp:\n1. Kiểm tra tất cả các đơn của bàn phải ở trạng thái `READY` hoặc `COMPLETED` (không được thanh toán khi bếp đang nấu `PREPARING`).\n2. Cập nhật tất cả các đơn thành `paymentStatus: 'PAID'` và `status: 'COMPLETED'`.\n3. Đổi trạng thái bàn ăn về `AVAILABLE` (Bàn trống sẵn sàng đón khách mới).\n4. Tự động chuyển lịch đặt bàn liên quan sang `COMPLETED`.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "ADMIN"],
          parameters: [
            { name: "tableId", in: "path", type: "integer", required: true, desc: "ID bàn ăn cần thanh toán", example: 1 }
          ],
          requestBody: {
            contentType: "application/json",
            required: false,
            fields: [
              { name: "paymentMethod", type: "string", required: false, desc: "Phương thức thanh toán (Mặc định: CASH)", example: "CASH", enum: ["CASH", "TRANSFER"] }
            ],
            example: {
              paymentMethod: "CASH"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Thanh toán thành công toàn bộ bàn",
              example: {
                message: "Đã thanh toán thành công 2 đơn hàng."
              }
            },
            {
              statusCode: 400,
              description: "Có đơn hàng chưa nấu xong",
              example: {
                message: "Không thể thanh toán. Có đơn hàng chưa hoàn thành chế biến.",
                invalidOrderIds: [12]
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy đơn hàng cần thanh toán",
              example: { message: "Không tìm thấy đơn hàng cần thanh toán" }
            }
          ]
        },
        {
          id: "orders_pay_single",
          name: "Thanh toán cho một đơn hàng đơn lẻ",
          method: "PUT",
          path: "/api/orders/:id/pay",
          summary: "Thanh toán từng hóa đơn và giải phóng bàn ăn",
          description: "Yêu cầu đơn hàng phải ở trạng thái `READY` hoặc `COMPLETED` mới được thanh toán.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID đơn hàng", example: 10 }
          ],
          requestBody: {
            contentType: "application/json",
            required: false,
            fields: [
              { name: "paymentMethod", type: "string", required: false, desc: "Phương thức thanh toán", example: "TRANSFER", enum: ["CASH", "TRANSFER"] }
            ],
            example: {
              paymentMethod: "TRANSFER"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Thanh toán thành công",
              example: {
                message: "Thanh toán thành công. Bàn hiện đã sẵn sàng."
              }
            },
            {
              statusCode: 400,
              description: "Đơn hàng chưa nấu xong hoặc đã thanh toán trước đó",
              example: {
                message: "Đơn hàng phải ở trạng thái 'Chờ phục vụ' mới có thể thanh toán"
              }
            }
          ]
        },
        {
          id: "orders_delete",
          name: "Hủy / Xóa đơn hàng",
          method: "DELETE",
          path: "/api/orders/:id",
          summary: "Xóa bản ghi đơn hàng khỏi hệ thống",
          description: "Dành cho nhân viên hoặc quản trị viên.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["ADMIN", "STAFF"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID đơn hàng cần xóa", example: 10 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Xóa đơn hàng thành công",
              example: { message: "Xóa đơn hàng thành công" }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy đơn hàng",
              example: { message: "Không tìm thấy đơn hàng" }
            }
          ]
        }
      ]
    },

    {
      id: "reservations",
      name: "Reservations & Booking",
      title: "Đặt bàn trước & Nhận bàn",
      icon: "fa-calendar-check",
      description: "Khách hàng đặt bàn trực tuyến, thuật toán gán bàn tự động, kiểm tra trùng giờ và check-in.",
      endpoints: [
        {
          id: "reservations_create",
          name: "Khách hàng đặt bàn mới (Tự động gán bàn trống)",
          method: "POST",
          path: "/api/reservations",
          summary: "Đặt bàn trực tuyến với thuật toán tự động chọn bàn tối ưu nhất",
          description: "Thuật toán xử lý đặt bàn:\n1. Tính thời lượng đặt bàn mặc định là 2 tiếng.\n2. Quét cơ sở dữ liệu tìm các bàn đã bị trùng lịch (`CONFIRMED` hoặc `CHECKED_IN`) trong khung giờ yêu cầu.\n3. Lựa chọn bàn trống có sức chứa nhỏ nhất nhưng `>= numberOfGuests` (tránh lãng phí bàn lớn) và bàn không ở trạng thái `CLEANING`.\n4. Lưu thông tin đặt bàn với trạng thái `PENDING`.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC", "CUSTOMER"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "guestName", type: "string", required: true, desc: "Tên người đặt bàn", example: "Lê Văn C" },
              { name: "guestPhone", type: "string", required: true, desc: "Số điện thoại liên hệ", example: "0912345678" },
              { name: "reservationTime", type: "string", required: true, desc: "Thời gian đến nhận bàn (ISO String hoặc datetime)", example: "2026-08-15T19:00:00.000Z" },
              { name: "numberOfGuests", type: "integer", required: true, desc: "Số lượng khách dự kiến", example: 4 },
              { name: "note", type: "string", required: false, desc: "Ghi chú yêu cầu đặc biệt", example: "Cần ghế trẻ em" },
              { name: "user_id", type: "integer", required: false, desc: "ID người dùng (nếu có đăng nhập)", example: 1 }
            ],
            example: {
              guestName: "Lê Văn C",
              guestPhone: "0912345678",
              reservationTime: "2026-08-15T19:00:00.000Z",
              numberOfGuests: 4,
              note: "Cần ghế trẻ em",
              user_id: 1
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Đặt bàn thành công",
              example: {
                message: "Đặt bàn thành công",
                data: {
                  id: 5,
                  table_id: 2,
                  guestName: "Lê Văn C",
                  guestPhone: "0912345678",
                  reservationTime: "2026-08-15T19:00:00.000Z",
                  numberOfGuests: 4,
                  status: "PENDING",
                  tableNumber: 2
                }
              }
            },
            {
              statusCode: 400,
              description: "Hết bàn trống phù hợp trong khung giờ",
              example: {
                message: "Rất tiếc, hiện tại không còn bàn trống phù hợp với số lượng khách và khung giờ bạn yêu cầu. Vui lòng chọn khung giờ khác!"
              }
            }
          ]
        },
        {
          id: "reservations_get_my",
          name: "Lịch đặt bàn của tôi",
          method: "GET",
          path: "/api/reservations/my-reservations",
          summary: "Khách hàng xem lại lịch sử và danh sách đặt bàn của mình",
          description: "Yêu cầu JWT Token. Lấy danh sách lịch đặt bàn kèm thông tin số bàn tương ứng.",
          authRequired: true,
          authType: "AUTHENTICATED",
          allowedRoles: ["CUSTOMER"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách lịch đặt bàn của khách",
              example: [
                {
                  id: 5,
                  guestName: "Lê Văn C",
                  reservationTime: "2026-08-15T19:00:00.000Z",
                  numberOfGuests: 4,
                  status: "CONFIRMED",
                  table: { id: 2, tableNumber: 2, capacity: 6 }
                }
              ]
            }
          ]
        },
        {
          id: "reservations_get_all",
          name: "Lấy tất cả lịch đặt bàn (Staff & Admin)",
          method: "GET",
          path: "/api/reservations",
          summary: "Nhân viên xem toàn bộ lịch đặt bàn được sắp xếp theo thời gian đến",
          description: "Trả về danh sách tất cả các lượt đặt bàn kèm thông tin bàn ăn và tài khoản người dùng.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "ADMIN", "KITCHEN"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách lịch đặt bàn toàn hệ thống",
              example: [
                {
                  id: 5,
                  guestName: "Lê Văn C",
                  guestPhone: "0912345678",
                  reservationTime: "2026-08-15T19:00:00.000Z",
                  numberOfGuests: 4,
                  status: "PENDING",
                  table: { tableNumber: 2 },
                  User: { fullName: "Lê Văn C" }
                }
              ]
            }
          ]
        },
        {
          id: "reservations_confirm",
          name: "Nhân viên duyệt lịch đặt bàn (Confirm)",
          method: "PUT",
          path: "/api/reservations/:id/confirm",
          summary: "Chuyển trạng thái đặt bàn từ PENDING sang CONFIRMED",
          description: "Nhân viên xác nhận giữ bàn cho khách.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID lịch đặt bàn", example: 5 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Xác nhận đặt bàn thành công",
              example: {
                message: "Xác nhận đặt bàn thành công",
                data: {
                  id: 5,
                  status: "CONFIRMED"
                }
              }
            },
            {
              statusCode: 400,
              description: "Lịch đặt bàn không ở trạng thái Chờ duyệt",
              example: {
                message: "Chỉ có thể xác nhận lịch đặt bàn ở trạng thái 'Chờ duyệt' (PENDING)!"
              }
            }
          ]
        },
        {
          id: "reservations_check_in",
          name: "Khách nhận bàn (Check-in Validation)",
          method: "PUT",
          path: "/api/reservations/:id/check-in",
          summary: "Xác nhận khách đã đến quán trong khung giờ hợp lệ",
          description: "Quy tắc kiểm tra thời gian:\n- Chỉ cho phép check-in trong khoảng **30 phút trước hoặc 30 phút sau** giờ hẹn đặt bàn (`diffMins` từ -30 đến +30).\n- Khi check-in thành công: đổi trạng thái lịch sang `CHECKED_IN` và chuyển trạng thái bàn ăn sang `OCCUPIED`.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "CUSTOMER"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID lịch đặt bàn", example: 5 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Nhận bàn thành công",
              example: { message: "Xác nhận nhận bàn thành công" }
            },
            {
              statusCode: 400,
              description: "Chưa tới giờ hoặc đã quá giờ check-in",
              example: {
                message: "Chỉ có thể nhấn nhận bàn trong khoảng 30 phút trước hoặc 30 phút sau giờ đặt bàn!"
              }
            }
          ]
        },
        {
          id: "reservations_cancel",
          name: "Hủy lịch đặt bàn",
          method: "PUT",
          path: "/api/reservations/:id/cancel",
          summary: "Khách hoặc nhân viên hủy đặt bàn",
          description: "Chỉ cho phép hủy khi lịch đặt bàn đang ở trạng thái `PENDING` hoặc `CONFIRMED`.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["CUSTOMER", "STAFF"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID lịch đặt bàn", example: 5 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Hủy đặt bàn thành công",
              example: { message: "Đã hủy đặt bàn thành công" }
            },
            {
              statusCode: 400,
              description: "Trạng thái không hợp lệ để hủy",
              example: {
                message: "Chỉ có thể hủy lịch đặt bàn ở trạng thái 'Chờ duyệt' (PENDING) hoặc 'Đã xác nhận' (CONFIRMED)!"
              }
            }
          ]
        },
        {
          id: "reservations_update_status",
          name: "Cập nhật trạng thái đặt bàn thủ công",
          method: "PUT",
          path: "/api/reservations/:id/status",
          summary: "Staff / Admin cập nhật trạng thái bất kỳ của lịch đặt bàn",
          description: "Cập nhật thủ công trạng thái (`PENDING`, `CONFIRMED`, `ARRIVED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`, `EXPIRED`).",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["STAFF", "ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID lịch đặt bàn", example: 5 }
          ],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "status", type: "string", required: true, desc: "Trạng thái mới", example: "ARRIVED", enum: ["PENDING", "CONFIRMED", "ARRIVED", "CHECKED_IN", "COMPLETED", "CANCELLED", "EXPIRED"] }
            ],
            example: {
              status: "ARRIVED"
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Cập nhật trạng thái thành công",
              example: {
                message: "Cập nhật trạng thái đặt bàn thành công",
                data: { id: 5, status: "ARRIVED" }
              }
            }
          ]
        }
      ]
    },

    {
      id: "points",
      name: "Loyalty Points",
      title: "Tích điểm & Ưu đãi Thành viên",
      icon: "fa-coins",
      description: "Tích điểm thưởng 5% giá trị hóa đơn đã thanh toán cho khách hàng thành viên.",
      endpoints: [
        {
          id: "points_add",
          name: "Tích điểm từ hóa đơn hoàn tất (5% Cashback Points)",
          method: "POST",
          path: "/api/points/add-points",
          summary: "Nhân viên tích điểm thưởng cho khách hàng sau khi thanh toán",
          description: "Quy tắc nghiệp vụ:\n- Chỉ dành cho **Admin** hoặc **Staff**.\n- Đơn hàng phải có `paymentStatus === 'PAID'` và `status === 'COMPLETED'`.\n- Kiểm tra cờ `isPointsAdded: false` để chống tích điểm trùng lặp.\n- Tỷ lệ tích điểm: **5%** trên tổng số tiền thực trả (`Math.round(finalPrice * 0.05)`).\n- Tự động cộng điểm vào User và cập nhật `isPointsAdded: true` trong Database Transaction.",
          authRequired: true,
          authType: "STAFF_ADMIN",
          allowedRoles: ["ADMIN", "STAFF"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "phone", type: "string", required: true, desc: "Số điện thoại của khách hàng cần tích điểm", example: "0901234567" },
              { name: "orderId", type: "integer", required: true, desc: "Mã hóa đơn vừa hoàn thành thanh toán", example: 10 }
            ],
            example: {
              phone: "0901234567",
              orderId: 10
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Tích điểm thành công",
              example: {
                message: "Tích điểm thành công cho khách hàng Nguyễn Văn A",
                earnedPoints: 55000,
                totalPoints: 80000
              }
            },
            {
              statusCode: 400,
              description: "Đơn hàng chưa thanh toán hoặc đã được tích điểm trước đó",
              example: {
                message: "Đơn hàng này đã được tích điểm trước đó"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy khách hàng hoặc mã hóa đơn",
              example: {
                message: "Không tìm thấy khách hàng với số điện thoại này"
              }
            }
          ]
        }
      ]
    },

    {
      id: "reviews",
      name: "Reviews & Ratings",
      title: "Đánh giá & Nhận xét Món ăn",
      icon: "fa-star",
      description: "Khách hàng gửi đánh giá chấm điểm 1-5 sao, phân trang và quản lý đánh giá.",
      endpoints: [
        {
          id: "reviews_get_all",
          name: "Lấy danh sách đánh giá (Phân trang & Lọc ngày)",
          method: "GET",
          path: "/api/reviews",
          summary: "Lấy danh sách đánh giá món ăn kèm phân trang",
          description: "API công khai hiển thị đánh giá trên trang chủ hoặc trang quản trị admin.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC", "ADMIN"],
          parameters: [
            { name: "page", in: "query", type: "integer", required: false, desc: "Số trang (Mặc định: 1)", example: 1 },
            { name: "limit", in: "query", type: "integer", required: false, desc: "Số bản ghi mỗi trang (Mặc định: 10)", example: 10 },
            { name: "date", in: "query", type: "string", required: false, desc: "Lọc theo ngày cụ thể (YYYY-MM-DD)", example: "2026-08-13" }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Danh sách đánh giá kèm thông tin phân trang",
              example: {
                totalItems: 48,
                totalPages: 5,
                currentPage: 1,
                reviews: [
                  {
                    id: 1,
                    user_id: 1,
                    phone: "0901234567",
                    dish_name: "Bò Wagyu Nướng Đá Muối",
                    content: "Thịt mềm mọng nước, sốt chấm rất vừa miệng. Sẽ quay lại!",
                    rating: 5,
                    created_at: "2026-08-13T12:00:00.000Z",
                    user: {
                      fullName: "Nguyễn Văn A",
                      phone: "0901234567"
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          id: "reviews_create",
          name: "Gửi đánh giá món ăn mới",
          method: "POST",
          path: "/api/reviews",
          summary: "Khách hàng chấm điểm sao (1-5) và gửi nhận xét món ăn",
          description: "API công khai. Bắt buộc trường `rating` phải là số nguyên từ 1 đến 5.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "dish_name", type: "string", required: true, desc: "Tên món ăn muốn đánh giá", example: "Lẩu Nấm Hải Sản Hoàng Gia" },
              { name: "rating", type: "integer", required: true, desc: "Số sao chấm điểm (1 - 5)", example: 5 },
              { name: "content", type: "string", required: false, desc: "Nội dung nhận xét", example: "Nước lẩu rất ngon, nấm tươi ngọt!" },
              { name: "phone", type: "string", required: false, desc: "Số điện thoại người đánh giá", example: "0901234567" },
              { name: "user_id", type: "integer", required: false, desc: "ID người dùng (nếu có)", example: 1 }
            ],
            example: {
              dish_name: "Lẩu Nấm Hải Sản Hoàng Gia",
              rating: 5,
              content: "Nước lẩu rất ngon, nấm tươi ngọt!",
              phone: "0901234567",
              user_id: 1
            }
          },
          responses: [
            {
              statusCode: 201,
              description: "Gửi đánh giá thành công",
              example: {
                message: "Cảm ơn bạn đã gửi đánh giá!",
                review: {
                  id: 2,
                  dish_name: "Lẩu Nấm Hải Sản Hoàng Gia",
                  rating: 5,
                  content: "Nước lẩu rất ngon, nấm tươi ngọt!"
                }
              }
            },
            {
              statusCode: 400,
              description: "Số sao không hợp lệ",
              example: { message: "Số sao không hợp lệ (1-5)" }
            }
          ]
        },
        {
          id: "reviews_delete",
          name: "Xóa đánh giá (Admin)",
          method: "DELETE",
          path: "/api/reviews/:id",
          summary: "Admin xóa các đánh giá phản cảm hoặc vi phạm",
          description: "Chỉ dành cho **Admin**.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "id", in: "path", type: "integer", required: true, desc: "ID đánh giá cần xóa", example: 1 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Xóa đánh giá thành công",
              example: { message: "Đã xóa đánh giá thành công" }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy đánh giá",
              example: { message: "Không tìm thấy đánh giá" }
            }
          ]
        }
      ]
    },

    {
      id: "stats",
      name: "Statistics & Analytics",
      title: "Báo cáo Doanh thu & Thống kê",
      icon: "fa-chart-line",
      description: "Thống kê doanh thu theo ngày, tháng, năm và tổng số lượng đơn hàng hoàn thành.",
      endpoints: [
        {
          id: "stats_get",
          name: "Báo cáo doanh thu và đơn hàng (Dashboard)",
          method: "GET",
          path: "/api/stats",
          summary: "Thống kê tổng doanh thu và tổng đơn hoàn tất theo ngày/tháng/năm",
          description: "Chỉ dành cho **Admin**. Yêu cầu JWT Token Admin.\n- `type`: `day` (theo ngày), `month` (theo tháng), `year` (theo năm).\n- Chỉ tính các đơn hàng có `status === 'COMPLETED'` và `paymentStatus === 'PAID'`.",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "type", in: "query", type: "string", required: false, desc: "Khung thời gian thống kê (Mặc định: day)", example: "day", enum: ["day", "month", "year"] },
            { name: "date", in: "query", type: "string", required: false, desc: "Mốc ngày cần xem thống kê", example: "2026-08-13" }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Số liệu thống kê doanh thu",
              example: {
                type: "day",
                startDate: "2026-08-13T00:00:00.000Z",
                endDate: "2026-08-13T23:59:59.999Z",
                totalOrders: 35,
                totalRevenue: 28450000
              }
            },
            {
              statusCode: 403,
              description: "Không có quyền truy cập (Admin only)",
              example: { message: "Access denied. Admin only." }
            }
          ]
        }
      ]
    },

    {
      id: "payos",
      name: "PayOS Online Payments",
      title: "Cổng Thanh toán Trực tuyến PayOS",
      icon: "fa-credit-card",
      description: "Tạo liên kết thanh toán VietQR PayOS, Webhook nhận IPN và kiểm tra trạng thái đơn hàng.",
      endpoints: [
        {
          id: "payos_create_link",
          name: "Tạo link thanh toán PayOS (QR Checkout)",
          method: "POST",
          path: "/api/payos/create-payment-link",
          summary: "Tạo mã QR thanh toán PayOS cho một đơn hàng hoặc gộp toàn bộ bàn",
          description: "Quy trình tạo link:\n1. Truyền `orderId` (thanh toán đơn lẻ) HOẶC `tableId` (thanh toán gộp toàn bàn).\n2. Sinh mã `orderCode` ngẫu nhiên 8 số.\n3. Gán tag `[PAYOS:orderCode]` vào trường `note` của đơn hàng để phục vụ Webhook đối soát.\n4. Trả về `checkoutUrl` và mã QR thanh toán từ cổng PayOS.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["CUSTOMER", "STAFF"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "orderId", type: "integer", required: false, desc: "Mã đơn hàng cần thanh toán", example: 10 },
              { name: "tableId", type: "integer", required: false, desc: "Mã bàn cần thanh toán gộp", example: 1 }
            ],
            example: {
              orderId: 10
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Tạo link thanh toán thành công",
              example: {
                bin: "970422",
                accountNumber: "0345678910",
                accountName: "NHA HANG APPDATMON",
                amount: 1100000,
                description: "THANHTOAN DH10",
                orderCode: 84729103,
                qrCode: "00020101021238540010A00000072701240006970422011003456789100208QRIBFTTA5303704540711000005802VN...",
                checkoutUrl: "https://pay.payos.vn/web/a9bc8d7e6f54..."
              }
            },
            {
              statusCode: 400,
              description: "Thiếu orderId hoặc tableId",
              example: { message: "Thiếu orderId hoặc tableId" }
            }
          ]
        },
        {
          id: "payos_check_status",
          name: "Kiểm tra trạng thái thanh toán PayOS (Polling Fallback)",
          method: "GET",
          path: "/api/payos/order-status/:orderId",
          summary: "Hỏi trực tiếp cổng PayOS trạng thái đơn hàng (Dùng khi Webhook bị trễ)",
          description: "Frontend polling định kỳ gọi API này để kiểm tra xem khách đã chuyển khoản thành công chưa. Nếu PayOS xác nhận `PAID`, backend tự động cập nhật Database sang `PAID`, `COMPLETED` và trả bàn `AVAILABLE`.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["CUSTOMER", "STAFF"],
          parameters: [
            { name: "orderId", in: "path", type: "integer", required: true, desc: "ID đơn hàng", example: 10 }
          ],
          responses: [
            {
              statusCode: 200,
              description: "Trạng thái thanh toán",
              example: {
                status: "PAID",
                message: "Updated from PayOS"
              }
            },
            {
              statusCode: 404,
              description: "Không tìm thấy đơn hàng",
              example: { message: "Order not found" }
            }
          ]
        },
        {
          id: "payos_webhook",
          name: "PayOS Webhook (IPN Callback)",
          method: "POST",
          path: "/api/payos/webhook",
          summary: "Cổng PayOS gửi thông báo tự động khi giao dịch thành công",
          description: "PayOS Server gọi đến endpoint này để bắn sự kiện thanh toán. Backend phân tích `orderCode`, cập nhật trạng thái đơn sang `PAID`, đổi phương thức sang `TRANSFER` và giải phóng bàn ăn.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          requestBody: {
            contentType: "application/json",
            required: true,
            fields: [
              { name: "code", type: "string", required: true, desc: "Mã trạng thái PayOS ('00' là thành công)", example: "00" },
              { name: "desc", type: "string", required: true, desc: "Mô tả kết quả", example: "success" },
              { name: "data", type: "object", required: true, desc: "Dữ liệu giao dịch chứa orderCode", example: { orderCode: 84729103, amount: 1100000 } }
            ],
            example: {
              code: "00",
              desc: "success",
              data: {
                orderCode: 84729103,
                amount: 1100000,
                description: "THANHTOAN DH10",
                accountNumber: "0345678910",
                reference: "FT26225890123"
              }
            }
          },
          responses: [
            {
              statusCode: 200,
              description: "Nhận webhook thành công",
              example: { message: "Success" }
            }
          ]
        },
        {
          id: "payos_debug",
          name: "Kiểm tra cấu hình PayOS Gateway",
          method: "GET",
          path: "/api/payos/debug",
          summary: "Debug trạng thái khởi tạo SDK PayOS",
          description: "Endpoint kiểm tra thư viện PayOS đã được cấu hình các key môi trường hợp lệ hay chưa.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Thông tin debug PayOS",
              example: {
                available: true,
                methods: ["createPaymentLink", "getPaymentLinkInformation", "cancelPaymentLink"]
              }
            }
          ]
        },
        {
          id: "payos_success_page",
          name: "Trang kết quả thanh toán thành công",
          method: "GET",
          path: "/api/payos/payment-success",
          summary: "Trang HTML thông báo trên trình duyệt sau khi khách thanh toán PayOS",
          description: "Return URL mà PayOS chuyển hướng khách về sau khi hoàn tất chuyển khoản.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Giao diện HTML Thanh toán thành công",
              example: "<h1>Thanh toán thành công!</h1>"
            }
          ]
        },
        {
          id: "payos_cancel_page",
          name: "Trang kết quả khi hủy thanh toán",
          method: "GET",
          path: "/api/payos/payment-cancel",
          summary: "Trang HTML thông báo khi khách nhấn hủy thanh toán trên cổng PayOS",
          description: "Cancel URL mà PayOS chuyển hướng khách về.",
          authRequired: false,
          authType: "PUBLIC",
          allowedRoles: ["PUBLIC"],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "Giao diện HTML Đã hủy thanh toán",
              example: "<h1>Đã hủy thanh toán</h1>"
            }
          ]
        }
      ]
    },

    {
      id: "upload",
      name: "File Uploads",
      title: "Tải lên Tệp tin & Hình ảnh",
      icon: "fa-cloud-upload-alt",
      description: "Upload hình ảnh sản phẩm, danh mục và avatar qua Multer multipart form-data.",
      endpoints: [
        {
          id: "upload_image",
          name: "Upload hình ảnh (Multer Multipart Form)",
          method: "POST",
          path: "/api/upload/image",
          summary: "Tải lên một file ảnh và nhận về đường dẫn tĩnh",
          description: "Chỉ dành cho **Admin**. Yêu cầu JWT token Admin.\n- Sử dụng `multipart/form-data`.\n- Tên field gửi lên: `image`.\n- File sẽ được lưu trong thư mục `uploads/` với tên duy nhất (kèm timestamp hash ngẫu nhiên).",
          authRequired: true,
          authType: "ADMIN_ONLY",
          allowedRoles: ["ADMIN"],
          parameters: [
            { name: "image", in: "header", type: "string", required: true, desc: "Content-Type: multipart/form-data", example: "multipart/form-data" }
          ],
          requestBody: {
            contentType: "multipart/form-data",
            required: true,
            fields: [
              { name: "image", type: "file (binary)", required: true, desc: "File hình ảnh (JPG, PNG, WEBP)", example: "dish.jpg" }
            ],
            example: "[Binary Image File]"
          },
          responses: [
            {
              statusCode: 200,
              description: "Upload ảnh thành công, trả về đường dẫn URL",
              example: {
                imageUrl: "/uploads/image-1786655789123-987654321.jpg"
              }
            },
            {
              statusCode: 400,
              description: "Chưa chọn file để upload",
              example: { message: "No file uploaded" }
            },
            {
              statusCode: 403,
              description: "Không có quyền Admin",
              example: { message: "Access denied. Admin only." }
            }
          ]
        }
      ]
    }
  ]
};
