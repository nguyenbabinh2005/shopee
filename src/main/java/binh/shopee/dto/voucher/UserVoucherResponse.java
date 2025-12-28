package binh.shopee.dto.voucher;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVoucherResponse {

    private Long voucherId;
    private String code;

    private String discountType;          // percentage | fixed
    private BigDecimal discountValue;
    private BigDecimal maxDiscount;
    private BigDecimal minOrderValue;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String userVoucherStatus;      // unused | used | expired
    private Boolean isSaved;
}
