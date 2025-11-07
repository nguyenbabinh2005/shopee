package binh.shopee.controller;

import binh.shopee.dto.category.CategoryResponse;
import binh.shopee.entity.Categories;
import binh.shopee.service.CategoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép gọi API từ frontend
public class CategoriesController {

    private final CategoriesService categoriesService;

    // 🔹 Lấy tất cả danh mục đang active
    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> getAllActiveCategories() {
        List<CategoryResponse> categories = categoriesService.getAllActiveCategories();
        return ResponseEntity.ok(categories);
    }

    // 🔹 Lấy danh mục gốc (parent_id IS NULL)
    @GetMapping("/root")
    public ResponseEntity<List<CategoryResponse>> getRootCategories() {
        List<CategoryResponse> rootCategories = categoriesService.getRootCategories();
        return ResponseEntity.ok(rootCategories);
    }

    // 🔹 Lấy danh mục con theo parentId
    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<CategoryResponse>> getChildrenByParentId(@PathVariable Long parentId) {
        List<CategoryResponse> children = categoriesService.getChildrenByParentId(parentId);
        return ResponseEntity.ok(children);
    }

    // 🔹 Kiểm tra trùng slug
    @GetMapping("/exists/{slug}")
    public ResponseEntity<Boolean> checkSlugExists(@PathVariable String slug) {
        boolean exists = categoriesService.isSlugExists(slug);
        return ResponseEntity.ok(exists);
    }

    // 🔹 Lấy chi tiết danh mục theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Categories> getCategoryById(@PathVariable Long id) {
        return categoriesService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Tạo danh mục mới
    @PostMapping
    public ResponseEntity<Categories> createCategory(@RequestBody Categories category) {
        if (categoriesService.isSlugExists(category.getSlug())) {
            return ResponseEntity.badRequest().build();
        }
        Categories saved = categoriesService.createCategory(category);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Xóa danh mục theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoriesService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
