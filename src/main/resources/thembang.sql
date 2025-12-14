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

CREATE TABLE flash_sale_user_purchases
(
    id                 bigint IDENTITY (1, 1) NOT NULL,
    flash_sale_id      bigint NOT NULL,
    user_id            bigint NOT NULL,
    purchased_quantity int    NOT NULL,
    CONSTRAINT pk_flash_sale_user_purchases PRIMARY KEY (id)
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

CREATE TABLE product_shipping
(
    product_id         bigint NOT NULL,
    shipping_method_id bigint NOT NULL,
    CONSTRAINT pk_product_shipping PRIMARY KEY (product_id, shipping_method_id)
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

ALTER TABLE products
    ADD total_purchase_count bigint
    GO

ALTER TABLE products
ALTER
COLUMN total_purchase_count bigint NOT NULL
GO

ALTER TABLE orders
    ADD voucher_id bigint
    GO

ALTER TABLE user_vouchers
    ADD CONSTRAINT UQ_UserVoucher_User_Voucher UNIQUE (user_id, voucher_id)
    GO

ALTER TABLE vouchers
    ADD CONSTRAINT UQ_Voucher_Code UNIQUE (code)
    GO

ALTER TABLE flash_sale_user_purchases
    ADD CONSTRAINT uc_406834c57ca28570fadfed8ff UNIQUE (flash_sale_id, user_id)
    GO

ALTER TABLE discounts
    ADD CONSTRAINT FK_DISCOUNTS_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES products (product_id)
    GO

ALTER TABLE flash_sales
    ADD CONSTRAINT FK_FLASHSALES_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES products (product_id)
    GO

ALTER TABLE flash_sale_user_purchases
    ADD CONSTRAINT FK_FLASH_SALE_USER_PURCHASES_ON_FLASH_SALE FOREIGN KEY (flash_sale_id) REFERENCES flash_sales (flash_sale_id)
    GO

ALTER TABLE flash_sale_user_purchases
    ADD CONSTRAINT FK_FLASH_SALE_USER_PURCHASES_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id)
    GO

ALTER TABLE orders
    ADD CONSTRAINT FK_ORDERS_ON_VOUCHER FOREIGN KEY (voucher_id) REFERENCES vouchers (voucher_id)
    GO

ALTER TABLE user_vouchers
    ADD CONSTRAINT FK_USERVOUCHERS_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id)
    GO

ALTER TABLE user_vouchers
    ADD CONSTRAINT FK_USERVOUCHERS_ON_VOUCHER FOREIGN KEY (voucher_id) REFERENCES vouchers (voucher_id)
    GO

ALTER TABLE product_shipping
    ADD CONSTRAINT fk_proshi_on_products FOREIGN KEY (product_id) REFERENCES products (product_id)
    GO

ALTER TABLE product_shipping
    ADD CONSTRAINT fk_proshi_on_shipping_methods FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods (shipping_method_id)
    GO

DECLARE
@sql [nvarchar](MAX)
SELECT @sql = N'ALTER TABLE products DROP CONSTRAINT ' + QUOTENAME([df].[name])
FROM [sys].[columns] AS [c]
    INNER JOIN [sys].[default_constraints] AS [df]
ON [df].[object_id] = [c].[default_object_id]
WHERE [c].[object_id] = OBJECT_ID(N'products')
  AND [c].[name] = N'slug'
    EXEC sp_executesql @sql
    GO

ALTER TABLE products
DROP
COLUMN slug
GO

DECLARE
@sql [nvarchar](MAX)
SELECT @sql = N'ALTER TABLE products DROP CONSTRAINT ' + QUOTENAME([df].[name])
FROM [sys].[columns] AS [c]
    INNER JOIN [sys].[default_constraints] AS [df]
ON [df].[object_id] = [c].[default_object_id]
WHERE [c].[object_id] = OBJECT_ID(N'products')
  AND [c].[name] = N'description'
    EXEC sp_executesql @sql
    GO

ALTER TABLE products
DROP
COLUMN description
GO

DECLARE
@sql [nvarchar](MAX)
SELECT @sql = N'ALTER TABLE product_variants DROP CONSTRAINT ' + QUOTENAME([df].[name])
FROM [sys].[columns] AS [c]
    INNER JOIN [sys].[default_constraints] AS [df]
ON [df].[object_id] = [c].[default_object_id]
WHERE [c].[object_id] = OBJECT_ID(N'product_variants')
  AND [c].[name] = N'attributes_json'
    EXEC sp_executesql @sql
    GO

ALTER TABLE product_variants
DROP
COLUMN attributes_json
GO

ALTER TABLE product_variants
    ADD attributes_json nvarchar(MAX)
GO

DECLARE
@sql [nvarchar](MAX)
SELECT @sql = N'ALTER TABLE reviews DROP CONSTRAINT ' + QUOTENAME([df].[name])
FROM [sys].[columns] AS [c]
    INNER JOIN [sys].[default_constraints] AS [df]
ON [df].[object_id] = [c].[default_object_id]
WHERE [c].[object_id] = OBJECT_ID(N'reviews')
  AND [c].[name] = N'content'
    EXEC sp_executesql @sql
    GO

ALTER TABLE reviews
DROP
COLUMN content
GO

ALTER TABLE reviews
    ADD content nvarchar(MAX)
GO

DECLARE
@sql [nvarchar](MAX)
SELECT @sql = N'ALTER TABLE brands DROP CONSTRAINT ' + QUOTENAME([df].[name])
FROM [sys].[columns] AS [c]
    INNER JOIN [sys].[default_constraints] AS [df]
ON [df].[object_id] = [c].[default_object_id]
WHERE [c].[object_id] = OBJECT_ID(N'brands')
  AND [c].[name] = N'description'
    EXEC sp_executesql @sql
    GO

ALTER TABLE brands
DROP
COLUMN description
GO

ALTER TABLE brands
    ADD description nvarchar(MAX)
GO

ALTER TABLE products
    ADD description nvarchar(MAX)
GO

ALTER TABLE orders
ALTER
COLUMN status varchar(255)
GO

ALTER TABLE products
    ADD CONSTRAINT UQ_Products_Slug UNIQUE ()
    GO