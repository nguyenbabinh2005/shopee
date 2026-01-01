package binh.shopee.dto.admin;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class VoucherAdminRequest {
    private String code;
    private String discountType; // "percentage" or "fixed"
    private BigDecimal discountAmount;
    private BigDecimal maxDiscount;
    private BigDecimal minOrderValue;
    private Integer maxUsage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
}