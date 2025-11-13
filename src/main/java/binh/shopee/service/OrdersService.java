package binh.shopee.service;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.PaymentMethodResponse;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.dto.product.VariantInfo;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.repository.InventoryRepository;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import binh.shopee.repository.ProductsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class OrdersService {
    @Autowired
    private final ProductVariantsRepository variantRepo;
    @Autowired
    private final InventoryRepository inventoryRepo;
    @Autowired
    private final ProductImagesRepository imageRepo;
    @Autowired
    private ProductImagesRepository productImagesRepository;
    @Autowired
    private ProductsRepository productsRepository;

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
        List<PaymentMethodResponse> paymentMethods = paymentMethodService.getAvailableMethods();
        List<AddressResponse> addressList = addressService.getAddressesByUserId(userId);
        return CheckoutResponse.builder()
                .variants(variantInfos)
                .paymentMethods(paymentMethods)
                .addressList(addressList)
                .totalAmount(totalAmount)
                .build();
    }
}

