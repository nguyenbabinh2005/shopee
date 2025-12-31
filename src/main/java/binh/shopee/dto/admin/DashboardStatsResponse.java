package binh.shopee.dto.admin;
import lombok.Data;
import lombok.Builder;
@Data
@Builder
public class DashboardStatsResponse {
    // Revenue
    private Long totalRevenue;
    private Double revenueGrowth;

    // Orders - ALL 5 STATUSES (FIXED)
    private Long totalOrders;
    private Long pendingOrders;      // PENDING status
    private Long processingOrders;   // PROCESSING status
    private Long shippedOrders;      // SHIPPED status
    private Long deliveredOrders;    // DELIVERED status (was completedOrders)
    private Long canceledOrders;     // CANCELED status (was cancelledOrders)

    // Users & Products
    private Long totalUsers;
    private Long totalProducts;
}