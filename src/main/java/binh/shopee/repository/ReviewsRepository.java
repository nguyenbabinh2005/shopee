package binh.shopee.repository;

import binh.shopee.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewsRepository extends JpaRepository<Reviews, Long> {
    List<Reviews> findByProducts_ProductIdAndStatus(Long productId, String status);
}
