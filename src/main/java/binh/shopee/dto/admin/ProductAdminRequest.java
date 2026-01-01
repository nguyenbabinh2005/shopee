package binh.shopee.dto.admin;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
/**
 * Admin DTO for creating/updating products
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAdminRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity; // Added for inventory management
    private Long categoryId;
    private Long brandId;
    private String status;
    private List<String> imageUrls;
    private List<VariantAdminRequest> variants;
}