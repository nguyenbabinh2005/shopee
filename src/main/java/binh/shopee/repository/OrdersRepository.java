package binh.shopee.repository;
import binh.shopee.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import binh.shopee.entity.Orders.OrderStatus;
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    Optional<Orders> findByOrderNumber(String orderNumber);
    boolean existsByOrderNumber(String orderNumber);

    List<Orders> findByStatus(OrderStatus status);


    List<Orders> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
}