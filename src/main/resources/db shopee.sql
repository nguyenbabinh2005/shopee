use shopee
GO

-- =============================================
-- TABLES
-- =============================================

CREATE TABLE users
(
    user_id       bigint IDENTITY (1, 1) NOT NULL,
    email         varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    username      varchar(255) NOT NULL,
    full_name     varchar(255),
    phone         varchar(50),
    role          varchar(20)  NOT NULL,
    status        varchar(20)  NOT NULL,
    created_at    datetime     NOT NULL,
    updated_at    datetime     NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id)
)
GO

CREATE TABLE addresses
(
    address_id     bigint IDENTITY (1, 1) NOT NULL,
    user_id        bigint       NOT NULL,
    recipient_name varchar(255) NOT NULL,
    phone          varchar(50)  NOT NULL,
    street         varchar(255) NOT NULL,
    ward           varchar(120) NOT NULL,
    district       varchar(120) NOT NULL,
    city           varchar(120) NOT NULL,
    is_default     bit          NOT NULL,
    created_at     datetime     NOT NULL,
    updated_at     datetime     NOT NULL,
    CONSTRAINT pk_addresses PRIMARY KEY (address_id)
)
GO

CREATE TABLE categories
(
    category_id bigint IDENTITY (1, 1) NOT NULL,
    parent_id   bigint,
    name        varchar(200) NOT NULL,
    slug        varchar(200) NOT NULL,
    status      varchar(20)  NOT NULL,
    sort_order  int          NOT NULL,
    CONSTRAINT pk_categories PRIMARY KEY (category_id)
)
GO

CREATE TABLE products
(
    product_id           bigint IDENTITY (1, 1) NOT NULL,
    name                 varchar(255)   NOT NULL,
    description          nvarchar(MAX),
    price                decimal(12, 2) NOT NULL,
    status               varchar(20)    NOT NULL,
    created_at           datetime       NOT NULL,
    total_purchase_count bigint         NOT NULL,
    updated_at           datetime       NOT NULL,
    CONSTRAINT pk_products PRIMARY KEY (product_id)
)
GO

CREATE TABLE product_images
(
    image_id   bigint IDENTITY (1, 1) NOT NULL,
    product_id bigint       NOT NULL,
    image_url  varchar(500) NOT NULL,
    is_primary bit          NOT NULL,
    sort_order int          NOT NULL,
    created_at datetime     NOT NULL,
    CONSTRAINT pk_productimages PRIMARY KEY (image_id)
)
GO

CREATE TABLE product_variants
(
    variant_id      bigint IDENTITY (1, 1) NOT NULL,
    product_id      bigint      NOT NULL,
    attributes_json nvarchar(MAX),
    price_override  decimal(18, 0),
    status          varchar(20) NOT NULL,
    created_at      datetime    NOT NULL,
    purchase_count  bigint      NOT NULL,
    CONSTRAINT pk_productvariants PRIMARY KEY (variant_id)
)
GO

CREATE TABLE product_categories
(
    product_id  bigint NOT NULL,
    category_id bigint NOT NULL,
    CONSTRAINT pk_productcategories PRIMARY KEY (product_id, category_id)
)
GO

CREATE TABLE discounts
(
    discount_id    bigint IDENTITY (1, 1) NOT NULL,
    product_id     bigint         NOT NULL,
    discount_type  varchar(20)    NOT NULL,
    discount_value decimal(12, 2) NOT NULL,
    start_time     datetime       NOT NULL,
    end_time       datetime       NOT NULL,
    is_active      bit            NOT NULL,
    created_at     datetime,
    CONSTRAINT pk_discounts PRIMARY KEY (discount_id)
)
GO

CREATE TABLE flash_sales
(
    flash_sale_id bigint IDENTITY (1, 1) NOT NULL,
    product_id    bigint         NOT NULL,
    flash_price   decimal(12, 2) NOT NULL,
    quantity      int            NOT NULL,
    sold          int            NOT NULL,
    start_time    datetime       NOT NULL,
    end_time      datetime       NOT NULL,
    status        varchar(20)    NOT NULL,
    CONSTRAINT pk_flashsales PRIMARY KEY (flash_sale_id)
)
GO

CREATE TABLE flash_sale_user_purchases
(
    id                 bigint IDENTITY (1, 1) NOT NULL,
    flash_sale_id      bigint NOT NULL,
    user_id            bigint NOT NULL,
    purchased_quantity int    NOT NULL,
    CONSTRAINT pk_flash_sale_user_purchases PRIMARY KEY (id)
)
GO

CREATE TABLE inventory
(
    inventory_id bigint IDENTITY (1, 1) NOT NULL,
    variant_id   bigint   NOT NULL,
    stock_qty    int      NOT NULL,
    reserved_qty int      NOT NULL,
    updated_at   datetime NOT NULL,
    CONSTRAINT pk_inventory PRIMARY KEY (inventory_id)
)
GO

CREATE TABLE reviews
(
    review_id  bigint IDENTITY (1, 1) NOT NULL,
    product_id bigint       NOT NULL,
    user_id    bigint,
    rating     smallint     NOT NULL,
    title      varchar(200),
    content    nvarchar(MAX),
    status     varchar(255) NOT NULL,
    created_at datetime     NOT NULL,
    updated_at datetime     NOT NULL,
    CONSTRAINT pk_reviews PRIMARY KEY (review_id)
)
GO

CREATE TABLE carts
(
    cart_id    bigint IDENTITY (1, 1) NOT NULL,
    user_id    bigint     NOT NULL,
    session_id varchar(255),
    is_active  bit        NOT NULL,
    currency   varchar(3) NOT NULL,
    expires_at datetime,
    created_at datetime   NOT NULL,
    updated_at datetime   NOT NULL,
    CONSTRAINT pk_carts PRIMARY KEY (cart_id)
)
GO

CREATE TABLE cart_items
(
    item_id           bigint IDENTITY (1, 1) NOT NULL,
    cart_id           bigint         NOT NULL,
    variant_id        bigint         NOT NULL,
    quantity          int            NOT NULL,
    price_snapshot    decimal(12, 2) NOT NULL,
    discount_snapshot decimal(12, 2) NOT NULL,
    line_total        decimal(12, 2),
    created_at        datetime       NOT NULL,
    updated_at        datetime       NOT NULL,
    CONSTRAINT pk_cartitems PRIMARY KEY (item_id)
)
GO

CREATE TABLE vouchers
(
    voucher_id      bigint IDENTITY (1, 1) NOT NULL,
    code            varchar(50)    NOT NULL,
    discount_type   varchar(20)    NOT NULL,
    discount_value  decimal(12, 2) NOT NULL,
    max_discount    decimal(12, 2),
    min_order_value decimal(12, 2),
    usage_limit     int,
    used_count      int            NOT NULL,
    start_time      datetime       NOT NULL,
    end_time        datetime       NOT NULL,
    status          varchar(20)    NOT NULL,
    created_at      datetime,
    CONSTRAINT pk_vouchers PRIMARY KEY (voucher_id)
)
GO

CREATE TABLE user_vouchers
(
    user_voucher_id bigint IDENTITY (1, 1) NOT NULL,
    user_id         bigint      NOT NULL,
    voucher_id      bigint      NOT NULL,
    status          varchar(20) NOT NULL,
    redeemed_at     datetime,
    created_at      datetime,
    CONSTRAINT pk_uservouchers PRIMARY KEY (user_voucher_id)
)
GO

CREATE TABLE payment_methods
(
    payment_method_id bigint IDENTITY (1, 1) NOT NULL,
    code              varchar(50)  NOT NULL,
    display_name      varchar(100) NOT NULL,
    status            varchar(20)  NOT NULL,
    created_at        datetime     NOT NULL,
    updated_at        datetime     NOT NULL,
    CONSTRAINT pk_paymentmethods PRIMARY KEY (payment_method_id)
)
GO

CREATE TABLE shipping_methods
(
    shipping_method_id bigint IDENTITY (1, 1) NOT NULL,
    name               varchar(100)   NOT NULL,
    base_fee           decimal(12, 2) NOT NULL,
    estimated_days     int            NOT NULL,
    is_active          bit            NOT NULL,
    CONSTRAINT pk_shippingmethods PRIMARY KEY (shipping_method_id)
)
GO

CREATE TABLE product_shipping
(
    product_id         bigint NOT NULL,
    shipping_method_id bigint NOT NULL,
    CONSTRAINT pk_product_shipping PRIMARY KEY (product_id, shipping_method_id)
)
GO

CREATE TABLE orders
(
    order_id            bigint IDENTITY (1, 1) NOT NULL,
    user_id             bigint         NOT NULL,
    order_number        varchar(40)    NOT NULL,
    payment_method_id   bigint,
    voucher_id          bigint,
    shipping_address_id bigint,
    currency            varchar(3)     NOT NULL,
    subtotal            decimal(12, 2) NOT NULL,
    discount_total      decimal(12, 2) NOT NULL,
    shipping_fee        decimal(12, 2) NOT NULL,
    grand_total         decimal(12, 2),
    note                varchar(255),
    created_at          datetime       NOT NULL,
    updated_at          datetime       NOT NULL,
    status              varchar(255)   NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (order_id)
)
GO

CREATE TABLE order_items
(
    order_item_id         bigint IDENTITY (1, 1) NOT NULL,
    order_id              bigint         NOT NULL,
    variant_id            bigint         NOT NULL,
    product_name_snapshot varchar(255)   NOT NULL,
    unit_price            decimal(12, 2) NOT NULL,
    quantity              int            NOT NULL,
    discount_amount       decimal(12, 2) NOT NULL,
    total_price           decimal(12, 2),
    created_at            datetime       NOT NULL,
    updated_at            datetime       NOT NULL,
    CONSTRAINT pk_orderitems PRIMARY KEY (order_item_id)
)
GO

CREATE TABLE payments
(
    payment_id        bigint IDENTITY (1, 1) NOT NULL,
    order_id          bigint         NOT NULL,
    payment_method_id bigint         NOT NULL,
    amount            decimal(18, 0) NOT NULL,
    currency          varchar(3)     NOT NULL,
    provider          varchar(255),
    provider_txn_id   varchar(255),
    status            varchar(255)   NOT NULL,
    paid_at           datetime,
    created_at        datetime       NOT NULL,
    CONSTRAINT pk_payments PRIMARY KEY (payment_id)
)
GO

CREATE TABLE shipments
(
    shipment_id     bigint IDENTITY (1, 1) NOT NULL,
    order_id        bigint       NOT NULL,
    carrier         varchar(100),
    tracking_number varchar(100),
    ship_date       datetime,
    delivery_date   datetime,
    status          varchar(255) NOT NULL,
    created_at      datetime     NOT NULL,
    updated_at      datetime     NOT NULL,
    CONSTRAINT pk_shipments PRIMARY KEY (shipment_id)
)
GO

CREATE TABLE shipment_items
(
    shipment_item_id bigint IDENTITY (1, 1) NOT NULL,
    shipment_id      bigint NOT NULL,
    order_item_id    bigint NOT NULL,
    quantity         int    NOT NULL,
    CONSTRAINT pk_shipmentitems PRIMARY KEY (shipment_item_id)
)
GO

-- =============================================
-- UNIQUE CONSTRAINTS
-- =============================================

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email)
GO

ALTER TABLE users
    ADD CONSTRAINT uc_users_username UNIQUE (username)
GO

ALTER TABLE categories
    ADD CONSTRAINT uc_categories_slug UNIQUE (slug)
GO

ALTER TABLE product_variants
    ADD CONSTRAINT uc_productvariants_image UNIQUE (image_id)
GO

ALTER TABLE carts
    ADD CONSTRAINT uc_carts_user UNIQUE (user_id)
GO

ALTER TABLE vouchers
    ADD CONSTRAINT UQ_Voucher_Code UNIQUE (code)
GO

ALTER TABLE user_vouchers
    ADD CONSTRAINT UQ_UserVoucher_User_Voucher UNIQUE (user_id, voucher_id)
GO

ALTER TABLE payment_methods
    ADD CONSTRAINT UQ_PayMethods_Code UNIQUE (code)
GO

ALTER TABLE orders
    ADD CONSTRAINT UQ_Orders_Number UNIQUE (order_number)
GO

ALTER TABLE inventory
    ADD CONSTRAINT uc_inventory_variant UNIQUE (variant_id)
GO

ALTER TABLE flash_sale_user_purchases
    ADD CONSTRAINT uc_flash_sale_user UNIQUE (flash_sale_id, user_id)
GO

-- =============================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================

-- Addresses
ALTER TABLE addresses
    ADD CONSTRAINT FK_ADDRESSES_ON_USER FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
GO

-- Categories
ALTER TABLE categories
    ADD CONSTRAINT FK_CATEGORIES_ON_PARENT FOREIGN KEY (parent_id)
        REFERENCES categories (category_id)
GO

-- Product Images
ALTER TABLE product_images
    ADD CONSTRAINT FK_PRODUCTIMAGES_ON_PRODUCT FOREIGN KEY (product_id)
        REFERENCES products (product_id) ON DELETE CASCADE
GO

-- Product Variants
ALTER TABLE product_variants
    ADD CONSTRAINT FK_PRODUCTVARIANTS_ON_PRODUCT FOREIGN KEY (product_id)
        REFERENCES products (product_id)
GO

ALTER TABLE product_variants
    ADD CONSTRAINT FK_PRODUCTVARIANTS_ON_IMAGE FOREIGN KEY (image_id)
        REFERENCES product_images (image_id)
GO

-- Product Categories
ALTER TABLE product_categories
    ADD CONSTRAINT FK_PRODUCTCATEGORIES_ON_PRODUCT FOREIGN KEY (product_id)
        REFERENCES products (product_id)
GO

ALTER TABLE product_categories
    ADD CONSTRAINT FK_PRODUCTCATEGORIES_ON_CATEGORY FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
GO

-- Discounts
ALTER TABLE discounts
    ADD CONSTRAINT FK_DISCOUNTS_ON_PRODUCT FOREIGN KEY (product_id)
        REFERENCES products (product_id)
GO

-- Flash Sales
ALTER TABLE flash_sales
    ADD CONSTRAINT FK_FLASHSALES_ON_PRODUCT FOREIGN KEY (product_id)
        REFERENCES products (product_id)
GO

ALTER TABLE flash_sale_user_purchases
    ADD CONSTRAINT FK_FLASH_SALE_USER_PURCHASES_ON_FLASH_SALE FOREIGN KEY (flash_sale_id)
        REFERENCES flash_sales (flash_sale_id)
GO

ALTER TABLE flash_sale_user_purchases
    ADD CONSTRAINT FK_FLASH_SALE_USER_PURCHASES_ON_USER FOREIGN KEY (user_id)
        REFERENCES users (user_id)
GO

-- Inventory
ALTER TABLE inventory
    ADD CONSTRAINT FK_INVENTORY_ON_VARIANT FOREIGN KEY (variant_id)
        REFERENCES product_variants (variant_id)
GO

-- Reviews
ALTER TABLE reviews
    ADD CONSTRAINT FK_REVIEWS_ON_PRODUCT FOREIGN KEY (product_id)
        REFERENCES products (product_id)
GO

ALTER TABLE reviews
    ADD CONSTRAINT FK_REVIEWS_ON_USER FOREIGN KEY (user_id)
        REFERENCES users (user_id)
GO

-- Carts
ALTER TABLE carts
    ADD CONSTRAINT FK_CARTS_ON_USER FOREIGN KEY (user_id)
        REFERENCES users (user_id)
GO

-- Cart Items
ALTER TABLE cart_items
    ADD CONSTRAINT FK_CARTITEMS_ON_CART FOREIGN KEY (cart_id)
        REFERENCES carts (cart_id)
GO

ALTER TABLE cart_items
    ADD CONSTRAINT FK_CARTITEMS_ON_VARIANT FOREIGN KEY (variant_id)
        REFERENCES product_variants (variant_id)
GO

-- User Vouchers
ALTER TABLE user_vouchers
    ADD CONSTRAINT FK_USERVOUCHERS_ON_USER FOREIGN KEY (user_id)
        REFERENCES users (user_id)
GO

ALTER TABLE user_vouchers
    ADD CONSTRAINT FK_USERVOUCHERS_ON_VOUCHER FOREIGN KEY (voucher_id)
        REFERENCES vouchers (voucher_id)
GO

-- Product Shipping
ALTER TABLE product_shipping
    ADD CONSTRAINT fk_proshi_on_products FOREIGN KEY (product_id)
        REFERENCES products (product_id)
GO

ALTER TABLE product_shipping
    ADD CONSTRAINT fk_proshi_on_shipping_methods FOREIGN KEY (shipping_method_id)
        REFERENCES shipping_methods (shipping_method_id)
GO

-- Orders
ALTER TABLE orders
    ADD CONSTRAINT FK_ORDERS_ON_USER FOREIGN KEY (user_id)
        REFERENCES users (user_id)
GO

ALTER TABLE orders
    ADD CONSTRAINT FK_ORDERS_ON_PAYMENT_METHOD FOREIGN KEY (payment_method_id)
        REFERENCES payment_methods (payment_method_id)
GO

ALTER TABLE orders
    ADD CONSTRAINT FK_ORDERS_ON_VOUCHER FOREIGN KEY (voucher_id)
        REFERENCES vouchers (voucher_id)
GO

ALTER TABLE orders
    ADD CONSTRAINT FK_ORDERS_ON_SHIPPING_ADDRESS FOREIGN KEY (shipping_address_id)
        REFERENCES addresses (address_id)
GO

-- Order Items
ALTER TABLE order_items
    ADD CONSTRAINT FK_ORDERITEMS_ON_ORDER FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
GO

ALTER TABLE order_items
    ADD CONSTRAINT FK_ORDERITEMS_ON_VARIANT FOREIGN KEY (variant_id)
        REFERENCES product_variants (variant_id)
GO

-- Payments
ALTER TABLE payments
    ADD CONSTRAINT FK_PAYMENTS_ON_ORDER FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
GO

ALTER TABLE payments
    ADD CONSTRAINT FK_PAYMENTS_ON_PAYMENT_METHOD FOREIGN KEY (payment_method_id)
        REFERENCES payment_methods (payment_method_id)
GO

-- Shipments
ALTER TABLE shipments
    ADD CONSTRAINT FK_SHIPMENTS_ON_ORDER FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
GO

-- Shipment Items
ALTER TABLE shipment_items
    ADD CONSTRAINT FK_SHIPMENTITEMS_ON_SHIPMENT FOREIGN KEY (shipment_id)
        REFERENCES shipments (shipment_id)
GO

ALTER TABLE shipment_items
    ADD CONSTRAINT FK_SHIPMENTITEMS_ON_ORDER_ITEM FOREIGN KEY (order_item_id)
        REFERENCES order_items (order_item_id)
GO