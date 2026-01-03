package binh.shopee.service;
import org.springframework.transaction.annotation.Transactional;
import binh.shopee.dto.discount.DiscountResult;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.dto.order.CheckoutItemResponse;
import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.PaymentMethodResponse;
import binh.shopee.dto.order.SelectAddressRequest;
import binh.shopee.dto.order.SelectPaymentMethodRequest;
import binh.shopee.dto.order.SelectShippingRequest;
import binh.shopee.dto.order.SelectVoucherRequest;
import binh.shopee.dto.order.ShippingMethodResponse;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import binh.shopee.dto.voucher.VoucherResponse;
@Service
@RequiredArgsConstructor
public class CheckoutService {
    private final ProductVariantsRepository variantRepo;
    private final ProductImagesRepository productImagesRepository;
    private final PaymentMethodsService paymentMethodsService;
    private final InventoryService inventoryService;
    private final ShippingMethodsService shippingMethodsService;
    private final VoucherService voucherService;
    private final DiscountService discountService;
    private final AddressesService addressesService;
    @Transactional(readOnly = true)
    public CheckoutResponse getCheckoutInfo(CheckoutRequest request, Long userId) {
        // 1️⃣ Validate và tính items
        List<CheckoutItemResponse> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        List<String> validationErrors = new ArrayList<>();
        for (VariantItem item : request.getVariants()) {
            try {
                ProductVariants variant = variantRepo.findById(item.getVariantId())
                        .orElseThrow(() -> new RuntimeException("Variant không tồn tại"));
                Products product = variant.getProducts();
                // Kiểm tra tồn kho
                int availableQty = inventoryService.getAvailableQuantity(variant.getVariantId());
                if (availableQty < item.getQuantity()) {
                    validationErrors.add(
                            "Sản phẩm '" + product.getName() + "' chỉ còn " + availableQty + " sản phẩm"
                    );
                    continue; // Bỏ qua item này nhưng vẫn tính các item khác
                }
                // Tính discount cho variant
                DiscountResult discountResult = discountService.calculateVariantDiscount(
                        variant.getVariantId()
                );
                // FIX: Use priceSnapshot from cart if available, otherwise fallback
                BigDecimal basePrice = item.getPriceSnapshot();
                if (basePrice == null) {
                    basePrice = variant.getPriceOverride();
                    if (basePrice == null) {
                        basePrice = product.getPrice();
                        if (basePrice == null) {
                            basePrice = BigDecimal.ZERO;
                        }
                    }
                }
                BigDecimal discountItemAmount = discountResult.getDiscountAmount();
                BigDecimal discountedPrice = basePrice.subtract(discountItemAmount);
                BigDecimal lineTotal = discountedPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                subtotal = subtotal.add(lineTotal);
                // Lấy ảnh
                CheckoutItemResponse checkoutItem = CheckoutItemResponse.builder()
                        .variantId(variant.getVariantId())
                        .productName(product.getName())
                        .attribution(variant.getAttributesJson())
                        .basePrice(basePrice)
                        .itemDiscountTotal(discountItemAmount)
                        .discountedPrice(discountedPrice)
                        .quantity(item.getQuantity())
                        .lineTotal(lineTotal)
                        .build();
                items.add(checkoutItem);
            } catch (Exception e) {
                validationErrors.add("Lỗi xử lý sản phẩm: " + e.getMessage());
            }
        }
        // 2️⃣ Lấy shipping mặc định
        ShippingMethodResponse defaultShipping = shippingMethodsService.getDefaultShipping();
        List<ShippingMethodResponse> availableShippingMethods =
                shippingMethodsService.getAvailableShippingMethods();
        // 3️⃣ Lấy address mặc định
        AddressResponse defaultAddress = null;
        try {
            defaultAddress = addressesService.getDefaultAddress(userId);
        } catch (Exception e) {
            validationErrors.add("Chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ.");
        }
        // 4️⃣ Lấy danh sách payment methods
        List<PaymentMethodResponse> availablePaymentMethods =
                paymentMethodsService.getAvailableMethods();
        // 5️⃣ Tính toán giá cuối
        BigDecimal shippingFee = defaultShipping.getBaseFee();
        BigDecimal orderDiscount = BigDecimal.ZERO;
        BigDecimal finalTotal = calculateFinalTotal(subtotal, shippingFee, orderDiscount);
        // 6️⃣ Validate có thể thanh toán không
        Boolean canProceedToPayment = validationErrors.isEmpty() &&
                defaultAddress != null &&
                !items.isEmpty();
        return CheckoutResponse.builder()
                .items(items)
                .subtotal(subtotal)
                .availableShippingMethods(availableShippingMethods)
                .selectedShipping(defaultShipping)
                .shippingFee(shippingFee)
                .selectedAddress(defaultAddress)
                .selectedVoucher(null)
                .orderDiscount(orderDiscount)
                .availablePaymentMethods(availablePaymentMethods)
                .selectedPayment(null)
                .finalTotal(finalTotal)
                .canProceedToPayment(canProceedToPayment)
                .validationErrors(validationErrors)
                .build();
    }
    @Transactional(readOnly = true)
    public CheckoutResponse selectAddress(SelectAddressRequest request, Long userId) {
        CheckoutResponse checkout = buildCheckoutFromRequest(
                request.getVariants(),
                request.getShippingMethodId(),
                request.getVoucherCode(),
                request.getPaymentMethodCode(),
                userId
        );
        // Cập nhật address
        AddressResponse addressResponse = addressesService.getAddressByUser(
                request.getAddressId(),
                userId
        );
        checkout.setSelectedAddress(addressResponse);
        // Validate lại
        checkout.setCanProceedToPayment(validateCheckout(checkout));
        return checkout;
    }
    @Transactional(readOnly = true)
    public CheckoutResponse selectShipping(SelectShippingRequest request, Long userId) {
        // Build checkout với shipping mới
        CheckoutResponse checkout = buildCheckoutFromRequest(
                request.getVariants(),
                request.getShippingMethodId(),
                request.getVoucherCode(),
                request.getPaymentMethodCode(),
                userId
        );
        checkout.setCanProceedToPayment(validateCheckout(checkout));
        return checkout;
    }
    @Transactional(readOnly = true)
    public CheckoutResponse selectVoucher(SelectVoucherRequest request, Long userId) {
        CheckoutResponse checkout = buildCheckoutFromRequest(
                request.getVariants(),
                request.getShippingMethodId(),
                request.getVouchercode(),
                request.getPaymentMethodCode(),
                userId
        );
        return checkout;
    }
    @Transactional(readOnly = true)
    public CheckoutResponse selectPaymentMethod(SelectPaymentMethodRequest request, Long userId) {
        // Build checkout với payment method mới
        CheckoutResponse checkout = buildCheckoutFromRequest(
                request.getVariants(),
                request.getShippingMethodId(),
                request.getVoucherCode(),
                request.getCode(),
                userId
        );
        return checkout;
    }
    public CheckoutResponse buildCheckoutFromRequest(
            List<VariantItem> variants,
            Long shippingMethodId,
            String voucherCode,
            String paymentMethodCode,
            Long userId) {
        System.out.println("🔍 ===== START buildCheckoutFromRequest =====");
        System.out.println("📦 Received variants: " + variants);
        System.out.println("👤 UserId: " + userId);
        List<CheckoutItemResponse> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        List<String> validationErrors = new ArrayList<>();
        for (VariantItem item : variants) {
            System.out.println("\n🔄 Processing variant: " + item.getVariantId() + " (quantity: " + item.getQuantity() + ")");
            try {
                // 1. Tìm variant
                System.out.println("  ➡️ Finding variant in database...");
                ProductVariants variant = variantRepo.findById(item.getVariantId())
                        .orElseThrow(() -> new RuntimeException("Variant không tồn tại"));
                System.out.println("  ✅ Found variant: " + variant.getVariantId());
                Products product = variant.getProducts();
                System.out.println("  ✅ Product: " + product.getName());
                // 2. Kiểm tra inventory
                System.out.println("  ➡️ Checking inventory...");
                int availableQty = inventoryService.getAvailableQuantity(variant.getVariantId());
                System.out.println("  ✅ Available quantity: " + availableQty);
                if (availableQty < item.getQuantity()) {
                    String error = "Sản phẩm '" + product.getName() + "' chỉ còn " + availableQty + " sản phẩm";
                    System.out.println("  ⚠️ " + error);
                    validationErrors.add(error);
                    continue;
                }
                // 3. Tính discount
                System.out.println("  ➡️ Calculating discount...");
                DiscountResult discountResult = discountService.calculateVariantDiscount(
                        variant.getVariantId()
                );
                System.out.println("  ✅ Discount: " + discountResult.getDiscountAmount());
                // FIX: Use priceSnapshot from cart (sent by frontend)
                BigDecimal basePrice = item.getPriceSnapshot();
                if (basePrice == null) {
                    // Fallback to variant/product price if priceSnapshot not provided
                    basePrice = variant.getPriceOverride();
                    if (basePrice == null) {
                        basePrice = product.getPrice();
                        if (basePrice == null) {
                            basePrice = BigDecimal.ZERO;
                        }
                    }
                    System.out.println("  ⚠️ priceSnapshot not provided, using fallback: " + basePrice);
                } else {
                    System.out.println("  ✅ Using priceSnapshot from cart: " + basePrice);
                }
                BigDecimal discountItemAmount = discountResult.getDiscountAmount();
                BigDecimal discountedPrice = basePrice.subtract(discountItemAmount);
                BigDecimal lineTotal = discountedPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                subtotal = subtotal.add(lineTotal);
                System.out.println("  ✅ Line total: " + lineTotal + " | Running subtotal: " + subtotal);

                CheckoutItemResponse checkoutItem = CheckoutItemResponse.builder()
                        .variantId(variant.getVariantId())
                        .productName(product.getName())
                        .attribution(variant.getAttributesJson())
                        .basePrice(basePrice)
                        .itemDiscountTotal(discountItemAmount)
                        .discountedPrice(discountedPrice)
                        .quantity(item.getQuantity())
                        .lineTotal(lineTotal)
                        .build();
                items.add(checkoutItem);
                System.out.println("  ✅ Item added to checkout");
            } catch (Exception e) {
                System.out.println("  ❌ ERROR processing variant " + item.getVariantId() + ":");
                System.out.println("     Message: " + e.getMessage());
                System.out.println("     Type: " + e.getClass().getName());
                e.printStackTrace();
                validationErrors.add("Lỗi xử lý sản phẩm: " + e.getMessage());
            }
        }
        System.out.println("\n📊 Final items count: " + items.size());
        System.out.println("💰 Final subtotal: " + subtotal);
        // 2️⃣ Xử lý shipping
        ShippingMethodResponse selectedShipping;
        if (shippingMethodId != null) {
            selectedShipping = shippingMethodsService.getById(shippingMethodId);
        } else {
            selectedShipping = shippingMethodsService.getDefaultShipping();
        }
        BigDecimal shippingFee = selectedShipping.getBaseFee();
        // 3️⃣ Xử lý voucher
        VoucherResponse selectedVoucher = null;
        BigDecimal orderDiscount = BigDecimal.ZERO;
        if (voucherCode != null && !voucherCode.trim().isEmpty()) {
            try {
                System.out.println("\n🎫 Calculating voucher discount for: " + voucherCode);
                System.out.println("   Subtotal for voucher: " + subtotal);
                orderDiscount = voucherService.calculateDiscount(voucherCode, subtotal);
                System.out.println("   ✅ Voucher discount: " + orderDiscount);
                selectedVoucher = voucherService.getVoucherByCode(voucherCode);
            } catch (Exception e) {
                System.out.println("   ❌ Voucher error: " + e.getMessage());
                validationErrors.add("Voucher không hợp lệ: " + e.getMessage());
            }
        }
        // 4️⃣ Xử lý address
        AddressResponse selectedAddress = null;
        try {
            selectedAddress = addressesService.getDefaultAddress(userId);
        } catch (Exception e) {
            validationErrors.add("Chưa có địa chỉ giao hàng");
        }
        // 5️⃣ Xử lý payment method
        PaymentMethodResponse selectedPayment = null;
        if (paymentMethodCode != null && !paymentMethodCode.trim().isEmpty()) {
            try {
                selectedPayment = paymentMethodsService.getByCode(paymentMethodCode);
            } catch (Exception e) {
                validationErrors.add("Phương thức thanh toán không hợp lệ");
            }
        }
        // 6️⃣ Tính final total
        BigDecimal finalTotal = calculateFinalTotal(subtotal, shippingFee, orderDiscount);
        System.out.println("\n💵 Final calculation:");
        System.out.println("   Subtotal: " + subtotal);
        System.out.println("   Shipping: " + shippingFee);
        System.out.println("   Discount: " + orderDiscount);
        System.out.println("   Final Total: " + finalTotal);
        System.out.println("🔍 ===== END buildCheckoutFromRequest =====\n");
        // 7️⃣ Build response
        CheckoutResponse checkout = CheckoutResponse.builder()
                .items(items)
                .subtotal(subtotal)
                .availableShippingMethods(shippingMethodsService.getAvailableShippingMethods())
                .selectedShipping(selectedShipping)
                .shippingFee(shippingFee)
                .selectedAddress(selectedAddress)
                .selectedVoucher(selectedVoucher)
                .orderDiscount(orderDiscount)
                .availablePaymentMethods(paymentMethodsService.getAvailableMethods())
                .selectedPayment(selectedPayment)
                .finalTotal(finalTotal)
                .validationErrors(validationErrors)
                .build();
        // 8️⃣ Validate
        checkout.setCanProceedToPayment(validateCheckout(checkout));
        return checkout;
    }
    private BigDecimal calculateFinalTotal(
            BigDecimal subtotal,
            BigDecimal shippingFee,
            BigDecimal orderDiscount) {
        return subtotal
                .add(shippingFee)
                .subtract(orderDiscount)
                .max(BigDecimal.ZERO);
    }
    private Boolean validateCheckout(CheckoutResponse checkout) {
        return checkout.getValidationErrors().isEmpty() &&
                checkout.getSelectedAddress() != null &&
                checkout.getSelectedPayment() != null &&
                !checkout.getItems().isEmpty() &&
                checkout.getFinalTotal().compareTo(BigDecimal.ZERO) > 0;
    }
}