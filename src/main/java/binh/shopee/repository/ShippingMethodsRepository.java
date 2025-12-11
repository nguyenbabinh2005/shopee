package binh.shopee.repository;

import binh.shopee.entity.ShippingMethods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShippingMethodsRepository extends JpaRepository<ShippingMethods, Long> {
    List<ShippingMethods> findByIsActiveTrue();
}