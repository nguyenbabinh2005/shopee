package binh.shopee.dto.admin;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAdminRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private Long brandId;
    private String status;
    private List<String> imageUrls;
    private List<VariantAdminRequest> variants;
}