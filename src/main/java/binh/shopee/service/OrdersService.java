package binh.shopee.service;
import binh.shopee.dto.order.AddressRequest;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.CheckoutTotalResponse;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderItemRequest;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.dto.order.PaymentMethodResponse;
import binh.shopee.dto.order.ShippingMethodResponse;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.dto.product.VariantInfo;
import binh.shopee.entity.Addresses;
import binh.shopee.entity.OrderItems;
import binh.shopee.entity.Orders;
import binh.shopee.entity.PaymentMethods;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.entity.ShippingMethods;
import binh.shopee.entity.Users;
import binh.shopee.entity.Vouchers;
import binh.shopee.repository.AddressesRepository;
import binh.shopee.repository.OrdersRepository;
import binh.shopee.repository.PaymentMethodsRepository;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import binh.shopee.repository.ShippingMethodsRepository;
import binh.shopee.repository.UsersRepository;
import binh.shopee.repository.VouchersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;
    private final ProductVariantsRepository variantRepo;
    private final ProductVariantsRepository productVariantsRepository;
    private final ProductImagesRepository productImagesRepository;
    private final PaymentMethodsRepository paymentMethodsRepository;
    private final PaymentMethodsService paymentMethodsService;
    private final UsersRepository usersRepository;
    private final AddressesRepository addressesRepository;
    private final InventoryService inventoryService;
    private final AddressesService addressesService;
    private final ShippingMethodsService shippingMethodsService;
    private final VoucherService voucherService;
    private final ShippingMethodsRepository shippingMethodsRepository;
    private final VouchersRepository vouchersRepo;
    /**
     * Lấy thông tin checkout khi người dùng bấm "Mua hàng" (chưa tạo đơn)
     */
    @Transactional(readOnly = true)
    public CheckoutResponse getCheckoutInfo(CheckoutRequest request, Long userId) {

        List<VariantInfo> variantInfos = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (VariantItem item : request.getVariants()) {
            ProductVariants variant = variantRepo.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant không tồn tại"));

            // Kiểm tra tồn kho
            int availableQty = inventoryService.getAvailableQuantity(variant.getVariantId());
            if (availableQty < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm '" + variant.getProducts().getName() + "' chỉ còn "
                        + availableQty + " sản phẩm có sẵn");
            }

            Products product = variant.getProducts();

            // Lấy ảnh ưu tiên của variant, fallback ảnh chính của product
            String imageUrl = Optional.ofNullable(variant.getProductImage())
                    .map(ProductImages::getImageUrl)
                    .orElseGet(() -> productImagesRepository.findFirstByProductsAndIsPrimaryTrue(product)
                            .map(ProductImages::getImageUrl)
                            .orElse(null));

            // Tạo VariantInfo
            VariantInfo variantInfo = VariantInfo.builder()
                    .productId(product.getProductId())
                    .productName(product.getName())
                    .variantId(variant.getVariantId())
                    .sku(variant.getSku())
                    .attributesJson(variant.getAttributesJson())
                    .priceOverride(variant.getPriceOverride())
                    .quantity(item.getQuantity())
                    .imageUrl(imageUrl)
                    .status(variant.getStatus())
                    .createdAt(variant.getCreatedAt())
                    .build();

            variantInfos.add(variantInfo);

            // Cộng tổng tiền
            totalAmount = totalAmount.add(variantInfo.getPriceOverride()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Đảm bảo totalAmount >= 0
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) totalAmount = BigDecimal.ZERO;

        // Lấy dữ liệu phụ trợ
        List<PaymentMethodResponse> paymentMethods = paymentMethodsService.getAvailableMethods();
        List<AddressResponse> addressList = addressesService.getAddressesByUserId(userId);
        List<ShippingMethodResponse> shippingMethods = shippingMethodsService.getAvailableShippingMethods();

        return CheckoutResponse.builder()
                .variants(variantInfos)
                .paymentMethods(paymentMethods)
                .addressList(addressList)
                .shippingMethods(shippingMethods)
                .shippingFee(BigDecimal.ZERO) // phí vận chuyển mặc định, tính sau nếu chọn shipping method
                .totalAmount(totalAmount)
                .voucherDiscountAmount(BigDecimal.ZERO) // default chưa áp dụng voucher
                .finalTotalAmount(totalAmount) // default = tổng tiền trước khi voucher
                .build();
    }
    @Transactional(readOnly = true)
    public CheckoutTotalResponse calculateTotal(List<VariantItem> variants,
                                                Long shippingMethodId,
                                                String voucherCode) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal voucherDiscountAmount = BigDecimal.ZERO;

        // 1. Tính tổng tiền các variant
        for (VariantItem item : variants) {
            ProductVariants variant = variantRepo.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant không tồn tại"));
            totalAmount = totalAmount.add(variant.getPriceOverride()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // 2. Lấy phí vận chuyển nếu có
        if (shippingMethodId != null) {
            shippingFee = shippingMethodsRepository.findById(shippingMethodId)
                    .map(ShippingMethods::getBaseFee)
                    .orElse(BigDecimal.ZERO);
        }

        // 3. Áp dụng voucher nếu có
        if (voucherCode != null && !voucherCode.isEmpty()) {
            Vouchers voucher = vouchersRepo
                    .findByCodeAndStatus(voucherCode, Vouchers.VoucherStatus.active)
                    .orElseThrow(() -> new RuntimeException("Voucher không tồn tại hoặc không hoạt động"));

            switch (voucher.getDiscountType()) {
                case percentage -> voucherDiscountAmount = totalAmount
                        .multiply(voucher.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                case fixed -> voucherDiscountAmount = voucher.getDiscountValue();
            }
            // Giới hạn maxDiscount nếu có
            if (voucher.getMaxDiscount() != null &&
                    voucherDiscountAmount.compareTo(voucher.getMaxDiscount()) > 0) {
                voucherDiscountAmount = voucher.getMaxDiscount();
            }
        }

        // 4. Tính tổng cuối cùng
        BigDecimal finalTotalAmount = totalAmount.add(shippingFee).subtract(voucherDiscountAmount);
        if (finalTotalAmount.compareTo(BigDecimal.ZERO) < 0) finalTotalAmount = BigDecimal.ZERO;

        return CheckoutTotalResponse.builder()
                .totalAmount(totalAmount)
                .shippingFee(shippingFee)
                .voucherDiscountAmount(voucherDiscountAmount)
                .finalTotalAmount(finalTotalAmount)
                .build();
    }

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {

        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        PaymentMethods paymentMethod = paymentMethodsRepository.findByCode(request.getPaymentMethod());
        if (paymentMethod == null) throw new RuntimeException("Phương thức thanh toán không tồn tại");

        Addresses shippingAddress = createShippingAddress(request.getAddressRequest(), user);

        // 1️⃣ Khởi tạo order trong memory
        Orders order = Orders.builder()
                .user(user)
                .orderNumber(generateOrderNumber())
                .paymentMethod(paymentMethod)
                .shippingAddress(shippingAddress)
                .status(Orders.OrderStatus.pending)
                .note(request.getNote())
                .subtotal(BigDecimal.ZERO)
                .discountTotal(BigDecimal.ZERO)
                .shippingFee(BigDecimal.ZERO)
                .taxTotal(BigDecimal.ZERO)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal discountTotal = BigDecimal.ZERO;

        // 2️⃣ Thêm items & tính subtotal
        for (OrderItemRequest itemReq : request.getItems()) {
            ProductVariants variant = productVariantsRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found: " + itemReq.getVariantId()));

            // Check stock
            int availableQty = inventoryService.getAvailableQuantity(variant.getVariantId());
            if (availableQty < itemReq.getQuantity()) {
                throw new RuntimeException("Sản phẩm '" + variant.getProducts().getName() + "' chỉ còn " + availableQty);
            }

            BigDecimal itemTotal = itemReq.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItems orderItem = OrderItems.builder()
                    .order(order)
                    .variant(variant)
                    .productNameSnapshot(variant.getProducts().getName())
                    .skuSnapshot(variant.getSku())
                    .unitPrice(itemReq.getPrice())
                    .quantity(itemReq.getQuantity())
                    .discountAmount(BigDecimal.ZERO) // sẽ update nếu voucher áp dụng
                    .build();

            order.getItems().add(orderItem);
        }

        // 3️⃣ Áp dụng voucher nếu có

        if (request.getVoucherCode() != null) {
            discountTotal = voucherService.calculateDiscount(
                    request.getVoucherCode(),
                    subtotal
            );
        }
        // 4️⃣ Phí vận chuyển
        BigDecimal shippingFee = BigDecimal.ZERO;
        if (request.getShippingMethodId() != null) {
            shippingFee = shippingMethodsRepository.findById(request.getShippingMethodId())
                    .map(ShippingMethods::getBaseFee)
                    .orElse(BigDecimal.ZERO);
        }

        // 5️⃣ Tổng cuối cùng
        order.setSubtotal(subtotal);
        order.setDiscountTotal(discountTotal);
        order.setShippingFee(shippingFee);

        ordersRepository.save(order);

        // 6️⃣ Giảm stock
        inventoryService.reduceStock(request.getItems());

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus().name())
                .message("Đặt hàng thành công")
                .build();
    }

    // ===========================
    // Tạo địa chỉ giao hàng
    // ===========================
    private Addresses createShippingAddress(AddressRequest req, Users user) {

        Addresses address = Addresses.builder()
                .user(user)
                .recipientName(req.getRecipientName())
                .phone(req.getPhone())
                .street(req.getStreet())
                .ward(req.getWard())
                .district(req.getDistrict())
                .city(req.getCity())
                .isDefault(req.getIsDefault() != null ? req.getIsDefault() : false)
                .build();

        return addressesRepository.save(address);
    }

    // ===========================
    // Tạo mã đơn hàng
    // ===========================
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

