package binh.shopee.service;
import binh.shopee.dto.admin.DashboardStatsResponse;
import binh.shopee.dto.admin.RevenueChartResponse;
import binh.shopee.dto.admin.RevenueDataPoint;
import binh.shopee.repository.OrdersRepository;
import binh.shopee.repository.UsersRepository;
import binh.shopee.repository.ProductsRepository;
import binh.shopee.entity.Orders;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;
    private final ProductsRepository productsRepository;
    public DashboardStatsResponse getDashboardStats(String period) {
        LocalDateTime startDate = getStartDate(period);
        // Get all orders (can filter by period if needed)
        List<Orders> allOrders = ordersRepository.findAll();
        // FIXED: Count ALL 5 statuses separately
        long pendingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.pending)
                .count();
        long processingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.processing)
                .count();
        long shippedOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.shipped)
                .count();
        long deliveredOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .count();
        long canceledOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.canceled)
                .count();
        // Total should be sum of all statuses
        long totalOrders = pendingOrders + processingOrders + shippedOrders +
                deliveredOrders + canceledOrders;
        // Revenue from delivered orders only
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .map(Orders::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return DashboardStatsResponse.builder()
                .totalRevenue(totalRevenue.longValue())
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .shippedOrders(shippedOrders)
                .deliveredOrders(deliveredOrders)
                .canceledOrders(canceledOrders)
                .totalUsers(usersRepository.count())
                .totalProducts(productsRepository.count())
                .revenueGrowth(15.5) // TODO: Calculate actual growth
                .build();
    }
    /**
     * Get revenue chart data for the specified period
     * Returns daily revenue from delivered orders
     */
    public RevenueChartResponse getRevenueChartData(String period) {
        LocalDateTime startDate = getStartDate(period);
        LocalDateTime endDate = LocalDateTime.now();
        // Get all delivered orders in the period
        List<Orders> deliveredOrders = ordersRepository.findAll().stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .filter(o -> o.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());
        // Group by date and sum revenue
        Map<LocalDate, BigDecimal> revenueByDate = deliveredOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().toLocalDate(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Orders::getGrandTotal,
                                BigDecimal::add
                        )
                ));
        // Create data points for chart
        List<RevenueDataPoint> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        // Fill in all dates in range (even if no orders)
        LocalDate currentDate = startDate.toLocalDate();
        LocalDate end = endDate.toLocalDate();
        while (!currentDate.isAfter(end)) {
            BigDecimal revenue = revenueByDate.getOrDefault(currentDate, BigDecimal.ZERO);
            chartData.add(new RevenueDataPoint(
                    currentDate.format(formatter),
                    revenue.longValue()
            ));
            currentDate = currentDate.plusDays(1);
        }
        return new RevenueChartResponse(chartData);
    }
    private LocalDateTime getStartDate(String period) {
        return switch (period) {
            case "day" -> LocalDateTime.now().minusDays(1);
            case "year" -> LocalDateTime.now().minusYears(1);
            default -> LocalDateTime.now().minusMonths(1);
        };
    }
}