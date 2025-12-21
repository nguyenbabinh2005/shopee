package binh.shopee.repository;

import binh.shopee.entity.ProductImages;
import binh.shopee.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImagesRepository extends JpaRepository<ProductImages, Long> {
    Optional<ProductImages> findFirstByProductsAndIsPrimaryTrue(Products product);


    // Lấy danh sách ảnh của 1 sản phẩm
    List<ProductImages> findByProducts_ProductId(Long productId);

}
