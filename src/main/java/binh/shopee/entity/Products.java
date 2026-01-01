package binh.shopee.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
@Entity
@Table(
        name = "Products",
        uniqueConstraints = {
                @UniqueConstraint(name = "UQ_Products_Slug", columnNames = "slug")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Brands brand;
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    @Column(name = "slug", nullable = false, length = 255, unique = true)
    private String slug; // 🔥 ADDED
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ProductStatus status;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @ManyToMany
    @JoinTable(
            name = "Product_Shipping",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "shipping_method_id")
    )
    private Set<ShippingMethods> shippingMethods;
    @Column(nullable = false)
    private Long totalPurchaseCount = 0L;
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    public enum ProductStatus {
        active, inactive
    }
}