package binh.shopee.service;

import binh.shopee.dto.flashsale.FlashSaleResponse;
import binh.shopee.entity.FlashSales;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.Discounts.DiscountType;
import binh.shopee.repository.FlashSalesRepository;
import binh.shopee.repository.ProductImagesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSalesRepository flashSalesRepository;
    private final ProductImagesRepository productImagesRepository;

    public List<FlashSaleResponse> getActiveFlashSales() {
        return flashSalesRepository
                .findActiveFlashSales(FlashSales.FlashSaleStatus.active, LocalDateTime.now())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<FlashSaleResponse> getUpcomingFlashSales() {
        return flashSalesRepository
                .findUpcomingFlashSales(FlashSales.FlashSaleStatus.upcoming, LocalDateTime.now())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /* ================== PRIVATE METHODS ================== */

    private FlashSaleResponse mapToResponse(FlashSales fs) {

        BigDecimal originalPrice = fs.getProduct().getPrice();
        BigDecimal flashPrice = calculateFlashPrice(
                originalPrice,
                fs.getDiscountType(),
                fs.getDiscountValue()
        );

        return new FlashSaleResponse(
                fs.getFlashSaleId(),
                flashPrice,
                fs.getDiscountType().name(),
                fs.getDiscountValue(),
                fs.getQuantity(),
                fs.getSold(),
                fs.getStartTime(),
                fs.getEndTime(),
                fs.getStatus().name(),
                fs.getProduct().getProductId(),
                fs.getProduct().getName(),
                originalPrice,
                getPrimaryImageUrl(fs)
        );
    }

    private BigDecimal calculateFlashPrice(
            BigDecimal originalPrice,
            DiscountType discountType,
            BigDecimal discountValue
    ) {
        if (discountType == DiscountType.fixed) {
            return originalPrice.subtract(discountValue).max(BigDecimal.ZERO);
        }

        // percentage
        return originalPrice
                .multiply(BigDecimal.valueOf(100).subtract(discountValue))
                .divide(BigDecimal.valueOf(100));
    }

    private String getPrimaryImageUrl(FlashSales fs) {
        return productImagesRepository
                .findFirstByProductsAndIsPrimaryTrue(fs.getProduct())
                .map(ProductImages::getImageUrl)
                .orElse(null);
    }
}
