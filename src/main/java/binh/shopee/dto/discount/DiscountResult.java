package binh.shopee.dto.discount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiscountResult {
    private BigDecimal finalPrice;        // giá 1 đơn vị sau giảm
    private BigDecimal discountAmount;    // số tiền giảm trên 1 đơn vị
}
