package binh.shopee.repository;

import binh.shopee.entity.PaymentMethods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import binh.shopee.dto.order.PaymentMethodResponse;
import java.util.List;
import java.util.Optional;

public interface PaymentMethodsRepository extends JpaRepository<PaymentMethods, Long> {
    @Query("""
        SELECT new binh.shopee.dto.order.PaymentMethodResponse(
            p.paymentMethodId,
            p.code,
            p.displayName
        )
        FROM PaymentMethods p
        WHERE p.status = :status
    """)
    List<PaymentMethodResponse> findByStatus(String status);
    Optional<PaymentMethods> findByCodeAndStatus(String code, String status);
}
