package binh.shopee.service;
import binh.shopee.dto.product.VariantInfo;
import binh.shopee.entity.ProductVariants;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class ProductVariantsService {
    private final ProductVariantsRepository variantRepo;
    public VariantInfo getVariantDetail(Long variantId){
        ProductVariants variant = variantRepo.findById(variantId)
                .orElseThrow(() ->
                        new RuntimeException("bien the khong ton tai")
                );
        return VariantInfo.builder()
                .variantId(variant.getVariantId())
                .quantity(variant.getPurchaseCount().intValue())
                .attributesJson(variant.getAttributesJson())
                .priceOverride(variant.getPriceOverride())
                .status(variant.getStatus())
                .createdAt(variant.getCreatedAt())
                .build();
    }

}