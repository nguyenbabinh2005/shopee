package binh.shopee.entity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "ProductVariants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long variantId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Products products;
    @Column(nullable = true, unique = true, length = 100)
    private String sku;
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "image_id")
    private ProductImages productImage;
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String attributesJson; // JSON thuộc tính
    @Column
    private BigDecimal priceOverride;
    @Column(nullable = false, length = 20)
    private String status;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private Long purchaseCount = 0L;
}
