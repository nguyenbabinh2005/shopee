package binh.shopee.service;
import binh.shopee.dto.discount.DiscountResult;
import binh.shopee.dto.order.AddressRequest;
import binh.shopee.dto.order.CheckoutItemResponse;
import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderItemRequest;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.dto.order.SelectShippingRequest;
import binh.shopee.dto.order.SelectVoucherRequest;
import binh.shopee.dto.order.ShippingMethodResponse;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.entity.Addresses;
import binh.shopee.entity.OrderItems;
import binh.shopee.entity.Orders;
import binh.shopee.entity.PaymentMethods;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.entity.ShippingMethods;
import binh.shopee.entity.Users;
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
    private final UsersRepository usersRepository;
    private final AddressesRepository addressesRepository;
    private final InventoryService inventoryService;
    private final ShippingMethodsService shippingMethodsService;
    private final VoucherService voucherService;
    private final ShippingMethodsRepository shippingMethodsRepository;
    private final VouchersRepository vouchersRepo;
    private final DiscountService discountService;
    @Transactional(readOnly = true)
    public CheckoutResponse getCheckoutInfo(CheckoutRequest request) {

        List<CheckoutItemResponse> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (VariantItem item : request.getVariants()) {
            ProductVariants variant = variantRepo.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant không tồn tại"));
            Products product = variant.getProducts();
            int availableQty = inventoryService.getAvailableQuantity(variant.getVariantId());
            if (availableQty < item.getQuantity()) {
                throw new RuntimeException(
                        "Sản phẩm '" + product.getName() +
                                "' chỉ còn " + availableQty + " sản phẩm"
                );
            }
            DiscountResult discountResult =
                    discountService.calculateVariantDiscount(
                            variant.getVariantId(),
                            item.getQuantity()
                    );
            BigDecimal basePrice = variant.getPriceOverride();
            BigDecimal discountItemAmount = discountResult.getDiscountAmount();
            BigDecimal discountedPrice = basePrice.subtract(discountItemAmount);// giá sau discount

            BigDecimal lineTotal = discountedPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
            String imageUrl = Optional.ofNullable(variant.getProductImage())
                    .map(ProductImages::getImageUrl)
                    .orElseGet(() -> productImagesRepository
                            .findFirstByProductsAndIsPrimaryTrue(product)
                            .map(ProductImages::getImageUrl)
                            .orElse(null));
            String attribution = variant.getAttributesJson();

            CheckoutItemResponse checkoutItem = CheckoutItemResponse.builder()
                    .variantId(variant.getVariantId())
                    .productName(product.getName())
                    .attribution(attribution)
                    .basePrice(basePrice)
                    .itemDiscountTotal(discountItemAmount)
                    .discountedPrice(discountedPrice)
                    .quantity(item.getQuantity())
                    .lineTotal(lineTotal)
                    .imageUrl(imageUrl)
                    .build();
            items.add(checkoutItem);
        }

        // 8️⃣ Shipping mặc định
        ShippingMethodResponse defaultShipping =
                shippingMethodsService.getDefaultShipping();

        BigDecimal shippingFee = defaultShipping.getBaseFee();

        // 9️⃣ Checkout INIT → chưa áp voucher
        BigDecimal orderDiscount = BigDecimal.ZERO;

        // 🔟 Final total
        BigDecimal finalTotal = subtotal.add(shippingFee).subtract(orderDiscount);

        return CheckoutResponse.builder()
                .items(items)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .orderDiscount(orderDiscount)
                .finalTotal(finalTotal)
                .shippingMethods(shippingMethodsService.getAvailableShippingMethods())
                .selectedShipping(defaultShipping)
                .build();
    }


    @Transactional(readOnly = true)
    public CheckoutResponse selectShipping(SelectShippingRequest request) {
        CheckoutResponse baseCheckout = getCheckoutInfo(
                new CheckoutRequest(request.getVariants())
        );

        ShippingMethodResponse selectedShipping =
                shippingMethodsService.getById(request.getShippingMethodId());

        BigDecimal shippingFee = selectedShipping.getBaseFee();
        BigDecimal finalTotal = baseCheckout.getSubtotal()
                .add(shippingFee)
                .subtract(baseCheckout.getOrderDiscount());
        baseCheckout.setSelectedShipping(selectedShipping);
        baseCheckout.setShippingFee(shippingFee);
        baseCheckout.setFinalTotal(finalTotal);

        return baseCheckout;
    }
    @Transactional(readOnly = true)
    public CheckoutResponse selectVoucher(SelectVoucherRequest request){
        CheckoutResponse baseCheckout = getCheckoutInfo(
                new CheckoutRequest(request.getVariants())
        );

        BigDecimal orderDiscount = voucherService.calculateDiscount(
                request.getVouchercode(),
                baseCheckout.getSubtotal()
        );

        BigDecimal finalTotal = baseCheckout.getSubtotal()
                .add(baseCheckout.getShippingFee())
                .subtract(orderDiscount);

        baseCheckout.setOrderDiscount(orderDiscount);
        baseCheckout.setFinalTotal(finalTotal);

        return baseCheckout;
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

