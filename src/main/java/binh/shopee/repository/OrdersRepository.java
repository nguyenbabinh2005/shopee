package binh.shopee.repository;

import binh.shopee.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    Optional<Orders> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);
}
