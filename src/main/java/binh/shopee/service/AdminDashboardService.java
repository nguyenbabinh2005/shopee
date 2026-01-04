package binh.shopee.service;
import binh.shopee.dto.admin.DashboardStatsResponse;
import binh.shopee.dto.admin.RevenueChartResponse;
import binh.shopee.dto.admin.RevenueDataPoint;
import binh.shopee.dto.admin.TopProductResponse;
import binh.shopee.repository.OrdersRepository;
import binh.shopee.repository.UsersRepository;
import binh.shopee.repository.ProductsRepository;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.entity.Orders;
import binh.shopee.entity.Products;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    private final ProductImagesRepository productImagesRepository;
    public DashboardStatsResponse getDashboardStats(String period) {
        LocalDateTime startDate = getStartDate(period);
        LocalDateTime endDate = LocalDateTime.now();

        // ✅ FIX: Filter orders by period
        List<Orders> allOrders = ordersRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null &&
                        o.getCreatedAt().isAfter(startDate) &&
                        o.getCreatedAt().isBefore(endDate))
                .collect(Collectors.toList());

        // Count ALL 5 statuses separately
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

        // Revenue from delivered orders only (within period)
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .map(Orders::getGrandTotal)
                .filter(total -> total != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ✅ Calculate revenue growth (compare with previous period)
        double revenueGrowth = calculateRevenueGrowth(period, totalRevenue);

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
                .revenueGrowth(revenueGrowth)
                .build();
    }
    /**
     * Get revenue chart data for the specified period
     * Returns revenue data points formatted based on period
     */
    public RevenueChartResponse getRevenueChartData(String period) {
        LocalDateTime startDate = getStartDate(period);
        LocalDateTime endDate = LocalDateTime.now();

        // Get all delivered orders in the period
        List<Orders> deliveredOrders = ordersRepository.findAll().stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .filter(o -> o.getCreatedAt() != null &&
                        o.getCreatedAt().isAfter(startDate) &&
                        o.getCreatedAt().isBefore(endDate))
                .collect(Collectors.toList());

        List<RevenueDataPoint> chartData = new ArrayList<>();

        switch (period) {
            case "day":
                // ✅ For "day": Show hourly data (today)
                chartData = getHourlyChartData(deliveredOrders, startDate, endDate);
                break;

            case "year":
                // ✅ For "year": Show monthly data (this year)
                chartData = getMonthlyChartData(deliveredOrders, startDate, endDate);
                break;

            default: // "month"
                // ✅ For "month": Show daily data (this month)
                chartData = getDailyChartData(deliveredOrders, startDate, endDate);
                break;
        }

        return new RevenueChartResponse(chartData);
    }
    /**
     * Get hourly chart data for "day" period
     */
    private List<RevenueDataPoint> getHourlyChartData(List<Orders> orders, LocalDateTime start, LocalDateTime end) {
        // Group by hour
        Map<Integer, BigDecimal> revenueByHour = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().getHour(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                o -> o.getGrandTotal() != null ? o.getGrandTotal() : BigDecimal.ZERO,
                                BigDecimal::add
                        )
                ));

        List<RevenueDataPoint> chartData = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            BigDecimal revenue = revenueByHour.getOrDefault(hour, BigDecimal.ZERO);
            chartData.add(new RevenueDataPoint(
                    String.format("%02d:00", hour),
                    revenue.longValue()
            ));
        }

        return chartData;
    }
    /**
     * Get daily chart data for "month" period
     */
    private List<RevenueDataPoint> getDailyChartData(List<Orders> orders, LocalDateTime start, LocalDateTime end) {
        // Group by date
        Map<LocalDate, BigDecimal> revenueByDate = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().toLocalDate(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                o -> o.getGrandTotal() != null ? o.getGrandTotal() : BigDecimal.ZERO,
                                BigDecimal::add
                        )
                ));

        List<RevenueDataPoint> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

        LocalDate currentDate = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();

        while (!currentDate.isAfter(endDate)) {
            BigDecimal revenue = revenueByDate.getOrDefault(currentDate, BigDecimal.ZERO);
            chartData.add(new RevenueDataPoint(
                    currentDate.format(formatter),
                    revenue.longValue()
            ));
            currentDate = currentDate.plusDays(1);
        }

        return chartData;
    }
    /**
     * Get monthly chart data for "year" period
     */
    private List<RevenueDataPoint> getMonthlyChartData(List<Orders> orders, LocalDateTime start, LocalDateTime end) {
        // Group by month
        Map<String, BigDecimal> revenueByMonth = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().format(DateTimeFormatter.ofPattern("MM/yyyy")),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                o -> o.getGrandTotal() != null ? o.getGrandTotal() : BigDecimal.ZERO,
                                BigDecimal::add
                        )
                ));

        List<RevenueDataPoint> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");

        LocalDate currentMonth = start.toLocalDate().withDayOfMonth(1);
        LocalDate endMonth = end.toLocalDate();

        while (!currentMonth.isAfter(endMonth)) {
            String monthKey = currentMonth.format(formatter);
            BigDecimal revenue = revenueByMonth.getOrDefault(monthKey, BigDecimal.ZERO);
            chartData.add(new RevenueDataPoint(
                    monthKey,
                    revenue.longValue()
            ));
            currentMonth = currentMonth.plusMonths(1);
        }

        return chartData;
    }
    /**
     * Calculate revenue growth compared to previous period
     */
    private double calculateRevenueGrowth(String period, BigDecimal currentRevenue) {
        LocalDateTime previousStart = getPreviousPeriodStartDate(period);
        LocalDateTime previousEnd = getStartDate(period);

        // Get previous period revenue
        BigDecimal previousRevenue = ordersRepository.findAll().stream()
                .filter(o -> o.getStatus() == Orders.OrderStatus.delivered)
                .filter(o -> o.getCreatedAt() != null &&
                        o.getCreatedAt().isAfter(previousStart) &&
                        o.getCreatedAt().isBefore(previousEnd))
                .map(Orders::getGrandTotal)
                .filter(total -> total != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (previousRevenue.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }

        // Calculate percentage growth
        BigDecimal growth = currentRevenue.subtract(previousRevenue)
                .divide(previousRevenue, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        return growth.doubleValue();
    }
    /**
     * Get top 5 best-selling products based on totalPurchaseCount
     */
    public List<TopProductResponse> getTopProducts() {
        Pageable topFive = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "totalPurchaseCount"));
        List<Products> products = productsRepository.findAll(topFive).getContent();
        return products.stream()
                .map(product -> {
                    TopProductResponse response = new TopProductResponse();
                    response.setProductId(product.getProductId());
                    response.setName(product.getName());
                    response.setTotalSales(product.getTotalPurchaseCount() != null ? product.getTotalPurchaseCount() : 0L);
                    // Get first image
                    productImagesRepository.findByProductsOrderBySortOrder(product)
                            .stream()
                            .findFirst()
                            .ifPresent(img -> response.setImageUrl(img.getImageUrl()));
                    return response;
                })
                .collect(Collectors.toList());
    }
    /**
     * ✅ FIXED: Get start date based on period
     * - "day": Start of today (00:00:00)
     * - "month": Start of current month (01/MM/YYYY 00:00:00)
     * - "year": Start of current year (01/01/YYYY 00:00:00)
     */
    private LocalDateTime getStartDate(String period) {
        LocalDate today = LocalDate.now();

        return switch (period) {
            case "day" -> today.atStartOfDay(); // 00:00:00 hôm nay
            case "month" -> today.withDayOfMonth(1).atStartOfDay(); // Ngày 1 tháng này
            case "year" -> today.withDayOfYear(1).atStartOfDay(); // Ngày 1/1 năm này
            default -> today.withDayOfMonth(1).atStartOfDay();
        };
    }
    /**
     * ✅ FIXED: Get previous period start date for growth calculation
     */
    private LocalDateTime getPreviousPeriodStartDate(String period) {
        LocalDate today = LocalDate.now();

        return switch (period) {
            case "day" -> today.minusDays(1).atStartOfDay(); // Hôm qua
            case "month" -> today.minusMonths(1).withDayOfMonth(1).atStartOfDay(); // Tháng trước
            case "year" -> today.minusYears(1).withDayOfYear(1).atStartOfDay(); // Năm trước
            default -> today.minusMonths(1).withDayOfMonth(1).atStartOfDay();
        };
    }
}