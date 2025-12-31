package binh.shopee.dto.admin;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class RevenueDataPoint {
    private String date;      // Format: "dd/MM" (e.g., "01/12")
    private Long revenue;     // Revenue amount in VND
}