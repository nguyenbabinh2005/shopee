package binh.shopee.controller;
import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.service.ProductCategoriesService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class ProductCategoriesController {
    private final ProductCategoriesService productCategoriesService ;
    @GetMapping("/{categoryId}/products")
    public Page<ProductSearchResponse> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productCategoriesService.getProductsByCategory(categoryId, pageable);
    }
}
