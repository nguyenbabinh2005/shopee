package binh.shopee.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "PaymentMethods",
        uniqueConstraints = @UniqueConstraint(name = "UQ_PayMethods_Code", columnNames = "code")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_method_id")
    private Long paymentMethodId;
    @Column(name = "code", nullable = false, length = 50)
    private String code; // 'cod', 'bank_transfer', 'online', ...
    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;
    @Column(name = "status", nullable = false, length = 20)
    private String status; // active | inactive
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
