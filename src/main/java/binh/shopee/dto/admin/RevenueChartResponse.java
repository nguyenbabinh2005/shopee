package binh.shopee.dto.admin;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
@Data
@AllArgsConstructor
public class RevenueChartResponse {
    private List<RevenueDataPoint> chartData;
}