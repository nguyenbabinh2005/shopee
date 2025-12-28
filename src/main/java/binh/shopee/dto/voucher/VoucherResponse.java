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
    private Long voucherId;           // ID voucher
    private String code;              // Mã voucher
    private String discountType;
    private BigDecimal discountAmount; // Giá trị giảm trực tiếp
    private BigDecimal minOrderValue;  // Giá trị đơn tối thiểu để áp dụng
    private BigDecimal maxDiscount;
    private LocalDateTime startDate;  // Ngày bắt đầu hiệu lực
    private LocalDateTime endDate;    // Ngày kết thúc hiệu lực
    private String userVoucherStatus;      // unused | used | expired
    private Boolean isSaved;
}
