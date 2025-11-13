package binh.shopee.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", unique = true, nullable = false)
    private ProductVariants variant; // 1-1 với ProductVariants
    @Column(name = "stock_qty", nullable = false)
    private Integer stockQty;
    @Column(name = "reserved_qty", nullable = false)
    private Integer reservedQty;
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
