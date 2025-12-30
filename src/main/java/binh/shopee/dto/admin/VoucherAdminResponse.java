package binh.shopee.dto.admin;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class VoucherAdminResponse {
    private Long voucherId;
    private String code;
    private String discountType;
    private BigDecimal discountAmount;
    private BigDecimal maxDiscount;
    private BigDecimal minOrderValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private Integer usageCount;
    private Integer maxUsage;
}