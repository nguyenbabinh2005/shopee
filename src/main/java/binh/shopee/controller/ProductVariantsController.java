package binh.shopee.controller;

import binh.shopee.dto.product.VariantInfo;
import binh.shopee.service.ProductVariantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/variants")
@RequiredArgsConstructor
public class ProductVariantsController {

    private final ProductVariantsService productVariantService;

    @GetMapping("/{variantId}")
    public VariantInfo getVariantDetail(@PathVariable Long variantId) {
        return productVariantService.getVariantDetail(variantId);
    }
}
