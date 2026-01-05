package binh.shopee.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import binh.shopee.entity.Discounts.DiscountType;
@Entity
@Table(name = "FlashSales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flash_sale_id")
    private Long flashSaleId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType;
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "sold", nullable = false)
    private Integer sold;
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private FlashSaleStatus status;
    // 🔹 THÊM MỚI: Giới hạn số lượng mua tối đa cho mỗi khách hàng
    @Column(name = "max_purchase_quantity")
    private Integer maxPurchaseQuantity = 2;
    public enum FlashSaleStatus {
        upcoming,
        active,
        ended
    }
}