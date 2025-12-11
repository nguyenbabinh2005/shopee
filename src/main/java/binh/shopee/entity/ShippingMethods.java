package binh.shopee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ShippingMethods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingMethods {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipping_method_id")
    private Long shippingMethodId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "base_fee", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseFee;

    @Column(name = "estimated_days", nullable = false)
    private Integer estimatedDays;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
