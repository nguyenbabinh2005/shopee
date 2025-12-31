package binh.shopee.controller;
import binh.shopee.dto.admin.*;
import binh.shopee.service.ProductAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductAdminController {
    private final ProductAdminService productAdminService;
    @GetMapping
    public ResponseEntity<Page<ProductAdminDetailResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {
        Page<ProductAdminDetailResponse> products = productAdminService.getAllProducts(page, size, search, status);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductAdminDetailResponse> getProductById(@PathVariable Long id) {
        ProductAdminDetailResponse product = productAdminService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    @PostMapping
    public ResponseEntity<ProductAdminDetailResponse> createProduct(@RequestBody ProductAdminRequest request) {
        ProductAdminDetailResponse product = productAdminService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductAdminDetailResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductAdminRequest request
    ) {
        ProductAdminDetailResponse product = productAdminService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productAdminService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateProductStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        productAdminService.updateProductStatus(id, status);
        return ResponseEntity.noContent().build();
    }
    // 🔥 NEW: Toggle product status (active <-> inactive)
    @PatchMapping("/{productId}/toggle-status")
    public ResponseEntity<ProductAdminDetailResponse> toggleProductStatus(@PathVariable Long productId) {
        ProductAdminDetailResponse response = productAdminService.toggleProductStatus(productId);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/upload-image")
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        ImageUploadResponse response = productAdminService.uploadImage(file);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryAdminResponse>> getAllCategories() {
        List<CategoryAdminResponse> categories = productAdminService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    @GetMapping("/brands")
    public ResponseEntity<List<BrandAdminResponse>> getAllBrands() {
        List<BrandAdminResponse> brands = productAdminService.getAllBrands();
        return ResponseEntity.ok(brands);
    }
}