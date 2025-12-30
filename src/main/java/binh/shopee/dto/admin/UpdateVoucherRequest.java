package binh.shopee.dto.admin;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class UpdateVoucherRequest {
    private String code;
    private String discountType;
    private BigDecimal discountAmount;
    private BigDecimal maxDiscount;
    private BigDecimal minOrderValue;
    private Integer maxUsage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}