package binh.shopee.service;

import binh.shopee.entity.Discounts;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.repository.DiscountsRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import binh.shopee.dto.discount.DiscountResult;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class DiscountService {
    private final DiscountsRepository discountsRepository;
    private final ProductVariantsRepository productVariantsRepo;
    public DiscountResult calculateVariantDiscount(Long variantId, int quantity) {

        ProductVariants variant = productVariantsRepo.findById(variantId)
                .orElseThrow();

        Products product = variant.getProducts();

        Optional<Discounts> discountOpt =
                discountsRepository.findActiveDiscountByProductId(
                        product.getProductId(),
                        LocalDateTime.now()
                );

        BigDecimal originalPrice = variant.getPriceOverride();
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (discountOpt.isPresent()) {
            Discounts discount = discountOpt.get();

            if (discount.getDiscountType() == Discounts.DiscountType.percentage) {
                discountAmount = originalPrice
                        .multiply(discount.getDiscountValue())
                        .divide(BigDecimal.valueOf(100));
            } else {
                discountAmount = discount.getDiscountValue();
            }
        }

        BigDecimal finalPrice = originalPrice.subtract(discountAmount);

        return DiscountResult.builder()
                .finalPrice(finalPrice)
                .discountAmount(discountAmount)
                .build();
    }

}
