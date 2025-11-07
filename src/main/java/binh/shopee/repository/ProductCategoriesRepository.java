package binh.shopee.repository;

import binh.shopee.entity.ProductCategories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoriesRepository extends JpaRepository<ProductCategories, Long> {
}
