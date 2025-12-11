package binh.shopee.dto.voucher;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherResponse {

    private Long voucherId;
    private String code;

    private String discountType;      // percentage | fixed
    private BigDecimal discountValue;
    private BigDecimal maxDiscount;
    private BigDecimal minOrderValue;

    private Integer usageLimit;
    private Integer usedCount;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
