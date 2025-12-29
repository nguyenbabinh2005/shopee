package binh.shopee.dto.order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariantItem {
    private Long variantId;           // biến thể người dùng chọn (size, màu,...)
    private Integer quantity;         // số lượng muốn mua
    private BigDecimal priceSnapshot; // giá từ giỏ hàng (NEW FIELD)
}