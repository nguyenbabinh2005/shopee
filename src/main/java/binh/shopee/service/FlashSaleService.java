package binh.shopee.service;

import binh.shopee.dto.flashsale.FlashSaleResponse;
import binh.shopee.entity.FlashSales;
import binh.shopee.entity.ProductImages;
import binh.shopee.repository.FlashSalesRepository;
import binh.shopee.repository.ProductImagesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSalesRepository flashSalesRepository;
    private final ProductImagesRepository productImagesRepository;

    public List<FlashSaleResponse> getActiveFlashSales() {
        return flashSalesRepository.findActiveFlashSales(
                FlashSales.FlashSaleStatus.active,
                LocalDateTime.now()
        ).stream().map(fs -> new FlashSaleResponse(
                fs.getFlashSaleId(),
                fs.getFlashPrice(),
                fs.getQuantity(),
                fs.getSold(),
                fs.getStartTime(),
                fs.getEndTime(),
                fs.getStatus().name(),
                getPrimaryImageUrl(fs),
                fs.getProduct().getProductId(),
                fs.getProduct().getName(),
                fs.getProduct().getPrice()
        )).toList();
    }

    public List<FlashSaleResponse> getUpcomingFlashSales() {
        return flashSalesRepository.findUpcomingFlashSales(
                FlashSales.FlashSaleStatus.upcoming,
                LocalDateTime.now()
        ).stream().map(fs -> new FlashSaleResponse(
                fs.getFlashSaleId(),
                fs.getFlashPrice(),
                fs.getQuantity(),
                fs.getSold(),
                fs.getStartTime(),
                fs.getEndTime(),
                fs.getStatus().name(),
                getPrimaryImageUrl(fs),
                fs.getProduct().getProductId(),
                fs.getProduct().getName(),
                fs.getProduct().getPrice()
        )).toList();
    }
    private String getPrimaryImageUrl(FlashSales fs) {
        return productImagesRepository
                .findFirstByProductsAndIsPrimaryTrue(fs.getProduct())
                .map(ProductImages::getImageUrl)
                .orElse(null);
    }
}
