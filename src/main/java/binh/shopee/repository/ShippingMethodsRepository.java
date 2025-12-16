package binh.shopee.repository;

import binh.shopee.entity.ShippingMethods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingMethodsRepository extends JpaRepository<ShippingMethods, Long> {
    List<ShippingMethods> findByIsActiveTrue();
    Optional<ShippingMethods>
    findFirstByIsActiveTrueOrderByBaseFeeAsc();
    Optional<ShippingMethods> findByShippingMethodIdAndIsActiveTrue(Long shippingMethodId);

}