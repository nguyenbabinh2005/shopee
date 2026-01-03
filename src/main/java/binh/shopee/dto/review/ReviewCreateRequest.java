package binh.shopee.dto.review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreateRequest {
    private Long userId;
    private Long productId;
    private Long orderId;
    private Byte rating; // 1-5
    private String title;
    private String content;
}