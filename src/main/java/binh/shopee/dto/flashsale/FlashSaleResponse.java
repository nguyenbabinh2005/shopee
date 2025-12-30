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
    private BigDecimal flashPrice;
    private Integer quantity;
    private Integer sold;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String imageUrl;
    private Long productId;
    private String productName;
    private BigDecimal originalPrice;
}

