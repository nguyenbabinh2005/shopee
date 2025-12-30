package binh.shopee.dto.admin;
import lombok.Data;
import lombok.Builder;
@Data
@Builder
public class DashboardStatsResponse {
    private Long totalRevenue;
    private Long totalOrders;
    private Long completedOrders;
    private Long cancelledOrders;
    private Long totalUsers;
    private Long totalProducts;
    private Long pendingOrders;
    private Double revenueGrowth;
}