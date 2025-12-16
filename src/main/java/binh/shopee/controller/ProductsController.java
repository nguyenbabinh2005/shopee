package binh.shopee.controller;

import binh.shopee.dto.product.ProductDetailResponse;
import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.service.ProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductsController {
    private final ProductsService productsService;

    @PostMapping("/filter")
    public ResponseEntity<List<ProductSearchResponse>> searchProducts(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean onlyDiscount,
            @RequestParam(required = false) BigDecimal minRating
    ) {

        List<ProductSearchResponse> result =
                productsService.filterProducts(minPrice, maxPrice, onlyDiscount, minRating);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/top-selling")
    public ResponseEntity<List<ProductSearchResponse>> getTopSellingProducts() {
        List<ProductSearchResponse> products = productsService.getTopSellingProducts();
        return ResponseEntity.ok(products);
    }
    @GetMapping("/search")
    public ResponseEntity<List<ProductSearchResponse>> searchProducts(@RequestParam("keyword") String keyword) {
        List<ProductSearchResponse> results = productsService.searchProducts(keyword);
        return ResponseEntity.ok(results);
    }
    @GetMapping("/top")
    public List<ProductSearchResponse> getTop50Products() {
        return productsService.getTop50Products();
    }


    @GetMapping("/id/{id}")
    public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable Long id) {
        ProductDetailResponse productDetail = productsService.getProductDetail(id);
        return ResponseEntity.ok(productDetail);
    }




    /**
     * Xóa sản phẩm
     */
    @DeleteMapping("/id/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productsService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
