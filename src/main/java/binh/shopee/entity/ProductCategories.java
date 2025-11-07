package binh.shopee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ProductCategories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategories {

    @EmbeddedId
    private ProductCategoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId") // map productId trong PK
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId") // map categoryId trong PK
    @JoinColumn(name = "category_id", nullable = false)
    private Categories category;
}
