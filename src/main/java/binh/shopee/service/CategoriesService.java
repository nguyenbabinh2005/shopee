package binh.shopee.service;

import binh.shopee.dto.category.CategoryResponse;
import binh.shopee.entity.Categories;
import binh.shopee.repository.CategoriesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriesService {
    @Autowired

    private final CategoriesRepository categoriesRepository;

    // 🔹 Lấy toàn bộ danh mục active
    public List<CategoryResponse> getAllActiveCategories() {
        return categoriesRepository.findAllActiveCategories();
    }

    // 🔹 Lấy danh mục gốc (parent_id IS NULL)
    public List<CategoryResponse> getRootCategories() {
        return categoriesRepository.findRootCategories();
    }

    // 🔹 Lấy danh mục con của 1 danh mục cha
    public List<CategoryResponse> getChildrenByParentId(Long parentId) {
        return categoriesRepository.findChildrenByParentId(parentId);
    }

    // 🔹 Kiểm tra trùng slug
    public boolean isSlugExists(String slug) {
        Optional<Categories> existing = categoriesRepository.findBySlug(slug);
        return existing.isPresent();
    }

    // 🔹 Thêm mới danh mục
    public Categories createCategory(Categories category) {
        return categoriesRepository.save(category);
    }

    // 🔹 Lấy chi tiết danh mục theo ID
    public Optional<Categories> getCategoryById(Long categoryId) {
        return categoriesRepository.findById(categoryId);
    }

    // 🔹 Xóa danh mục
    public void deleteCategory(Long categoryId) {
        categoriesRepository.deleteById(categoryId);
    }
}
