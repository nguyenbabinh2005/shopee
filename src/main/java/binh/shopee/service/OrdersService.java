package binh.shopee.service;
import binh.shopee.dto.order.AddressRequest;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderItemRequest;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.dto.order.PaymentMethodResponse;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.dto.product.VariantInfo;
import binh.shopee.entity.Addresses;
import binh.shopee.entity.OrderItems;
import binh.shopee.entity.Orders;
import binh.shopee.entity.PaymentMethods;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.entity.Users;
import binh.shopee.repository.AddressesRepository;
import binh.shopee.repository.OrderItemsRepository;
import binh.shopee.repository.OrdersRepository;
import binh.shopee.repository.PaymentMethodsRepository;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;
    private final OrderItemsRepository orderItemsRepository;
    private final ProductVariantsRepository variantRepo;
    private final ProductVariantsRepository productVariantsRepository;
    private final ProductImagesRepository productImagesRepository;
    private final PaymentMethodsRepository paymentMethodsRepository;
    private final PaymentMethodsService paymentMethodsService;
    private final UsersRepository usersRepository;
    private final AddressesRepository addressesRepository;
    private final InventoryService inventoryService;
    private final AddressesService addressesService;
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
            int availableQty = inventoryService.getAvailableQuantity(variant.getVariantId());
            if (availableQty < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm '" + variant.getProducts().getName() + "' chỉ còn "
                        + availableQty + " sản phẩm có sẵn");
            }

            Products product = variant.getProducts();

            // Lấy ảnh: ưu tiên ảnh của variant, nếu không có fallback ảnh chính của product
            String imageUrl = Optional.ofNullable(variant.getProductImage())
                    .map(ProductImages::getImageUrl)
                    .orElseGet(() -> productImagesRepository.findFirstByProductsAndIsPrimaryTrue(product)
                            .map(ProductImages::getImageUrl)
                            .orElse(null));

            // Build VariantInfo kiểu Shopee
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
            // Tính tổng tiền các variant
            totalAmount = totalAmount.add(variantInfo.getPriceOverride()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) totalAmount = BigDecimal.ZERO;
        // Lấy dữ liệu phụ trợ
        List<PaymentMethodResponse> paymentMethods = paymentMethodsService.getAvailableMethods();
        List<AddressResponse> addressList = addressesService.getAddressesByUserId(userId);
        return CheckoutResponse.builder()
                .variants(variantInfos)
                .paymentMethods(paymentMethods)
                .addressList(addressList)
                .totalAmount(totalAmount)
                .build();
    }
    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {

        // 1. Validate user
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // 2. Validate payment method
        PaymentMethods paymentMethod = paymentMethodsRepository.findByCode(request.getPaymentMethod());
        if (paymentMethod == null) {
            throw new RuntimeException("Phương thức thanh toán không tồn tai");
        }

        // 3. Create shipping address
        Addresses shippingAddress = createShippingAddress(request.getAddressRequest(), user);


        // 4. Create Order entity
        Orders order = Orders.builder()
                .user(user)
                .orderNumber(generateOrderNumber())       // random
                .paymentMethod(paymentMethod)
                .shippingAddress(shippingAddress)
                .status("PENDING")
                .note(request.getNote())
                .subtotal(BigDecimal.ZERO)
                .discountTotal(BigDecimal.ZERO)
                .shippingFee(BigDecimal.ZERO)
                .taxTotal(BigDecimal.ZERO)
                .build();
        ordersRepository.save(order);

        // 5. Add items + calculate subtotal
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {

            ProductVariants variant = productVariantsRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found: " + itemReq.getVariantId()));

            // Subtotal += price * quantity
            BigDecimal itemTotal = itemReq.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            subtotal = subtotal.add(itemTotal);

            // Create OrderItem snapshot
            OrderItems orderItem = OrderItems.builder()
                    .order(order)
                    .variant(variant)
                    .productNameSnapshot(variant.getProducts().getName())
                    .skuSnapshot(variant.getSku())
                    .unitPrice(itemReq.getPrice())
                    .quantity(itemReq.getQuantity())
                    .discountAmount(BigDecimal.ZERO)
                    .build();

            orderItemsRepository.save(orderItem);
        }

        // 6. Update subtotal
        order.setSubtotal(subtotal);
        order.setShippingFee(BigDecimal.ZERO);

        ordersRepository.save(order);

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
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

