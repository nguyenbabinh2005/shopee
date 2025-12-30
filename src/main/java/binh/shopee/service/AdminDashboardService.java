package binh.shopee.service;
import binh.shopee.dto.admin.DashboardStatsResponse;
import binh.shopee.repository.OrdersRepository;
import binh.shopee.repository.UsersRepository;
import binh.shopee.repository.ProductsRepository;
import binh.shopee.entity.Orders;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;
    private final ProductsRepository productsRepository;
    public DashboardStatsResponse getDashboardStats(String period) {
        LocalDateTime startDate = getStartDate(period);

        // Get all orders
        List<Orders> allOrders = ordersRepository.findAll();

        // Calculate stats - FIXED: Use correct enum values
        long totalOrders = allOrders.size();

        // "Completed" orders = delivered
        long completedOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .count();

        long cancelledOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.canceled)
                .count();

        long pendingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.pending)
                .count();

        // Revenue from delivered orders
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .map(Orders::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsResponse.builder()
                .totalRevenue(totalRevenue.longValue())
                .totalOrders(totalOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalUsers(usersRepository.count())
                .totalProducts(productsRepository.count())
                .pendingOrders(pendingOrders)
                .revenueGrowth(15.5)
                .build();
    }
    private LocalDateTime getStartDate(String period) {
        return switch (period) {
            case "day" -> LocalDateTime.now().minusDays(1);
            case "year" -> LocalDateTime.now().minusYears(1);
            default -> LocalDateTime.now().minusMonths(1);
        };
    }
}