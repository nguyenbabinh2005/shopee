package binh.shopee.repository;

import binh.shopee.dto.category.CategoryResponse;
import binh.shopee.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {

    @Query("""
        SELECT new binh.shopee.dto.category.CategoryResponse(
            c.categoryId, c.name, c.slug, c.status, c.sortOrder,
            CASE WHEN c.parent IS NULL THEN NULL ELSE CAST(c.parent.categoryId AS long) END
        )
        FROM Categories c
        WHERE c.status = 'active'
        ORDER BY c.sortOrder ASC
    """)
    List<CategoryResponse> findAllActiveCategories();

    // 🔹 Lấy danh mục con của 1 danh mục cha
    @Query("""
        SELECT new binh.shopee.dto.category.CategoryResponse(
            c.categoryId, c.name, c.slug, c.status, c.sortOrder,
           CASE WHEN c.parent IS NULL THEN NULL ELSE CAST(c.parent.categoryId AS long) END
        )
        FROM Categories c
        WHERE c.parent.categoryId = :parentId
        ORDER BY c.sortOrder ASC
    """)
    List<CategoryResponse> findChildrenByParentId(@Param("parentId") Long parentId);

    // 🔹 Lấy tất cả danh mục gốc (parent_id IS NULL)
    @Query("""
        SELECT new binh.shopee.dto.category.CategoryResponse(
            c.categoryId, c.name, c.slug, c.status, c.sortOrder, NULL
        )
        FROM Categories c
        WHERE c.parent IS NULL
        ORDER BY c.sortOrder ASC
    """)
    List<CategoryResponse> findRootCategories();

    // 🔹 Kiểm tra trùng slug
    Optional<Categories> findBySlug(String slug);
}
