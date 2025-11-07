package binh.shopee.controller;

import binh.shopee.dto.product.ProductDetailResponse;
import binh.shopee.dto.product.ProductRequest;
import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.entity.Products;
import binh.shopee.service.ProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductsController {
    @Autowired
    private final ProductsService productsService;

    /**
     * Tìm kiếm sản phẩm theo từ khóa
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductSearchResponse>> searchProducts(@RequestParam("keyword") String keyword) {
        List<ProductSearchResponse> results = productsService.searchProducts(keyword);
        return ResponseEntity.ok(results);
    }

    /**
     * Lấy danh sách sản phẩm theo brand
     */
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<ProductSearchResponse>> getProductsByBrand(@PathVariable Long brandId) {
        List<ProductSearchResponse> results = productsService.getProductsByBrand(brandId);
        return ResponseEntity.ok(results);
    }

    /**
     * Lấy chi tiết sản phẩm theo slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Products> getProductBySlug(@PathVariable String slug) {
        return productsService.getProductBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable Long id) {
        ProductDetailResponse productDetail = productsService.getProductDetail(id);
        return ResponseEntity.ok(productDetail);
    }

    /**
     * Lấy chi tiết sản phẩm theo id
     */
    @GetMapping("/{id}")
    public ResponseEntity<Products> getProductById(@PathVariable Long id) {
        return productsService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Thêm sản phẩm mới
     */
    @PostMapping
    public ResponseEntity<ProductSearchResponse> addProduct(@RequestBody ProductRequest request) {
        ProductSearchResponse created = productsService.addProduct(request);
        return ResponseEntity.ok(created);
    }

    /**
     * Sửa sản phẩm
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductSearchResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {
        ProductSearchResponse updated = productsService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa sản phẩm
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productsService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
