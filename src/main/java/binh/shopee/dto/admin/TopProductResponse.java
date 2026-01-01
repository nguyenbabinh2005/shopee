package binh.shopee.dto.admin;
import lombok.Data;
@Data
public class TopProductResponse {
    private Long productId;
    private String name;
    private Long totalSales;
    private String imageUrl;
}