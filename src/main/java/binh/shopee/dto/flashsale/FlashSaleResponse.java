package binh.shopee.dto.flashsale;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class FlashSaleResponse {

    private Long flashSaleId;

    // 🔥 Giá flash sale (tính từ discount, KHÔNG lưu DB)
    private BigDecimal flashPrice;

    // 🔻 Thông tin giảm giá
    private String discountType;      // fixed | percentage
    private BigDecimal discountValue;

    private Integer quantity;
    private Integer sold;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status;

    private Long productId;
    private String productName;
    private BigDecimal originalPrice;
    private String imageUrl;
}
