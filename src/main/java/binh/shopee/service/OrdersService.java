package binh.shopee.service;
import binh.shopee.dto.order.CancelOrderRequest;
import binh.shopee.dto.order.CheckoutItemResponse;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderCreateResponse;
import binh.shopee.dto.order.OrderItemResponse;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.entity.Addresses;
import binh.shopee.entity.OrderItems;
import binh.shopee.entity.Orders;
import binh.shopee.entity.PaymentMethods;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Users;
import binh.shopee.entity.Vouchers;
import binh.shopee.repository.AddressesRepository;
import binh.shopee.repository.OrdersRepository;
import binh.shopee.repository.ProductVariantsRepository;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import binh.shopee.entity.Orders.OrderStatus;
@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;
    private final ProductVariantsRepository productVariantsRepository;
    private final PaymentMethodsService paymentMethodsService;
    private final UsersRepository usersRepository;
    private final AddressesRepository addressesRepository;
    private final InventoryService inventoryService;
    private final VoucherService voucherService;
    private final CheckoutService checkoutService;
    private final CartsService cartsService;
    @Transactional
    public OrderCreateResponse createOrder(OrderCreateRequest request) {
        // FIX: Use VariantItem.builder() instead of constructor to include priceSnapshot
        CheckoutResponse checkout = checkoutService.buildCheckoutFromRequest(
                request.getItems().stream()
                        .map(item -> VariantItem.builder()
                                .variantId(item.getVariantId())
                                .quantity(item.getQuantity())
                                .priceSnapshot(item.getPrice()) // Use price from order request
                                .build())
                        .collect(Collectors.toList()),
                request.getShippingMethodId(),
                request.getVoucherCode(),
                request.getPaymentMethod(),
                request.getUserId()
        );
        if (!checkout.getCanProceedToPayment()) {
            throw new RuntimeException(
                    "Không thể tạo đơn hàng: " +
                            String.join(", ", checkout.getValidationErrors())
            );
        }
        // 3️⃣ Validate user
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        Addresses shippingAddress = addressesRepository
                .findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));
        if (!shippingAddress.getUser().getUserId().equals(request.getUserId())) {
            throw new RuntimeException("Địa chỉ không thuộc về user này");
        }
        PaymentMethods paymentMethod = paymentMethodsService
                .findbyCode(request.getPaymentMethod());
        Vouchers voucher = null;
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            voucher = voucherService.findVoucherByCode(request.getVoucherCode());
        }
        // 7️⃣ Tạo order entity
        Orders order = new Orders();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setPaymentMethod(paymentMethod);
        order.setVoucher(voucher);
        order.setShippingAddress(shippingAddress);
        // Lấy số liệu từ checkout response
        order.setSubtotal(checkout.getSubtotal());
        order.setDiscountTotal(checkout.getOrderDiscount());
        order.setShippingFee(checkout.getShippingFee());
        // grandTotal sẽ được DB tự tính: subtotal - discount_total + shipping_fee
        order.setNote(request.getNote());
        order.setStatus(Orders.OrderStatus.pending);
        order.setCurrency("VND");
        // 8️⃣ Save order trước để có orderId
        Orders savedOrder = ordersRepository.save(order);
        // 9️⃣ Tạo order items từ checkout items
        List<OrderItems> orderItems = new ArrayList<>();
        for (CheckoutItemResponse checkoutItem : checkout.getItems()) {
            ProductVariants variant = productVariantsRepository
                    .findById(checkoutItem.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant không tồn tại"));
            OrderItems orderItem = new OrderItems();
            orderItem.setOrder(savedOrder);
            orderItem.setVariant(variant);
            orderItem.setProductNameSnapshot(checkoutItem.getProductName());
            orderItem.setUnitPrice(checkoutItem.getDiscountedPrice()); // Giá đã discount
            orderItem.setQuantity(checkoutItem.getQuantity());
            orderItem.setDiscountAmount(checkoutItem.getItemDiscountTotal());
            orderItems.add(orderItem);
        }
        savedOrder.setItems(orderItems);
        savedOrder = ordersRepository.save(savedOrder);
        // 🔥 FIX: Only mark voucher as used if voucher code is present
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            voucherService.markAsUsed(request.getVoucherCode(), savedOrder.getUser().getUserId());
        }
        for (CheckoutItemResponse checkoutItem : checkout.getItems()) {
            inventoryService.reduceStock(
                    checkoutItem.getVariantId(),
                    checkoutItem.getQuantity()
            );
        }
        // 🔥 Xóa các sản phẩm đã đặt hàng khỏi giỏ hàng
        List<Long> orderedVariantIds = checkout.getItems().stream()
                .map(CheckoutItemResponse::getVariantId)
                .collect(Collectors.toList());
        cartsService.removeOrderedItemsFromCart(request.getUserId(), orderedVariantIds);
        return OrderCreateResponse.builder()
                .orderId(savedOrder.getOrderId())
                .status(savedOrder.getStatus().name())
                .message("Chờ xác nhận")
                .build();
    }
    private boolean canCancelOrder(Orders.OrderStatus status) {
        return status == Orders.OrderStatus.pending ||
                status == Orders.OrderStatus.processing;
    }
    @Transactional
    public OrderCreateResponse cancelOrder(Long orderId, Long userId, CancelOrderRequest request) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        if (!order.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này");
        }
        // 2️⃣ Validate trạng thái có thể hủy không
        if (!canCancelOrder(order.getStatus())) {
            throw new RuntimeException(
                    "Không thể hủy đơn hàng ở trạng thái: " + order.getStatus().name()
            );
        }
        // 3️⃣ Hoàn trả inventory
        for (OrderItems item : order.getItems()) {
            inventoryService.restoreInventory(
                    item.getVariant().getVariantId(),
                    item.getQuantity()
            );
        }
        // 4️⃣ Hoàn trả voucher (nếu có)
        if (order.getVoucher() != null) {
            voucherService.restoreVoucher(
                    order.getVoucher().getCode(),
                    userId
            );
        }
        // 5️⃣ Update order status
        order.setStatus(Orders.OrderStatus.canceled);
        order.setNote(
                (order.getNote() != null ? order.getNote() + "\n" : "") +
                        "--- HỦY ĐƠN ---\n" +
                        "Lý do: " + request.getReason() + "\n" +
                        "Thời gian: " + LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                )
        );
        order.setUpdatedAt(LocalDateTime.now());
        Orders savedOrder = ordersRepository.save(order);
        return OrderCreateResponse.builder()
                .orderId(savedOrder.getOrderId())
                .status(savedOrder.getStatus().name())
                .message("Đơn hàng đã được hủy")
                .build();
    }
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return ordersRepository.findByStatus(status)
                .stream()
                .map(order -> OrderResponse.builder()
                        .orderId(order.getOrderId())
                        .orderNumber(order.getOrderNumber())
                        .status(order.getStatus().name())
                        .subtotal(order.getSubtotal())
                        .discountTotal(order.getDiscountTotal())
                        .shippingFee(order.getShippingFee())
                        .grandTotal(order.getGrandTotal())
                        .currency(order.getCurrency())
                        .note(order.getNote())
                        .createdAt(order.getCreatedAt())
                        .items(
                                order.getItems().stream()
                                        .map(item -> OrderItemResponse.builder()
                                                .orderItemId(item.getOrderItemId())
                                                .productName(item.getProductNameSnapshot())
                                                .unitPrice(item.getUnitPrice())
                                                .quantity(item.getQuantity())
                                                .totalPrice(item.getTotalPrice())
                                                .build()
                                        ).toList()
                        )
                        .build()
                ).toList();
    }
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Orders order = ordersRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().name())
                .subtotal(order.getSubtotal())
                .discountTotal(order.getDiscountTotal())
                .shippingFee(order.getShippingFee())
                .grandTotal(order.getGrandTotal())
                .currency(order.getCurrency())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .items(
                        order.getItems().stream()
                                .map(item -> OrderItemResponse.builder()
                                        .orderItemId(item.getOrderItemId())
                                        .productName(item.getProductNameSnapshot())
                                        .unitPrice(item.getUnitPrice())
                                        .quantity(item.getQuantity())
                                        .totalPrice(item.getTotalPrice())
                                        .build()
                                ).toList()
                )
                .build();
    }
    // 🔥 NEW: Get all orders for a specific user WITH shipping address
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        List<Orders> userOrders = ordersRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
        return userOrders.stream()
                .map(order -> {
                    OrderResponse.OrderResponseBuilder builder = OrderResponse.builder()
                            .orderId(order.getOrderId())
                            .orderNumber(order.getOrderNumber())
                            .status(order.getStatus().name())
                            .subtotal(order.getSubtotal())
                            .discountTotal(order.getDiscountTotal())
                            .shippingFee(order.getShippingFee())
                            .grandTotal(order.getGrandTotal())
                            .currency(order.getCurrency())
                            .note(order.getNote())
                            .createdAt(order.getCreatedAt())
                            .items(
                                    order.getItems().stream()
                                            .map(item -> OrderItemResponse.builder()
                                                    .orderItemId(item.getOrderItemId())
                                                    .productName(item.getProductNameSnapshot())
                                                    .unitPrice(item.getUnitPrice())
                                                    .quantity(item.getQuantity())
                                                    .totalPrice(item.getTotalPrice())
                                                    .build()
                                            ).toList()
                            );
                    // 🔥 Add shipping address if available
                    if (order.getShippingAddress() != null) {
                        builder.recipientName(order.getShippingAddress().getRecipientName())
                                .phone(order.getShippingAddress().getPhone())
                                .street(order.getShippingAddress().getStreet())
                                .ward(order.getShippingAddress().getWard())
                                .district(order.getShippingAddress().getDistrict())
                                .city(order.getShippingAddress().getCity());
                    }
                    return builder.build();
                }).toList();
    }
    // ===========================
    // Tạo mã đơn hàng
    // ===========================
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}