package binh.shopee.controller;
import binh.shopee.dto.admin.DashboardStatsResponse;
import binh.shopee.dto.admin.RevenueChartResponse;
import binh.shopee.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats(
            @RequestParam(defaultValue = "month") String period
    ) {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats(period));
    }
    @GetMapping("/revenue-chart")
    public ResponseEntity<RevenueChartResponse> getRevenueChart(
            @RequestParam(defaultValue = "month") String period
    ) {
        return ResponseEntity.ok(adminDashboardService.getRevenueChartData(period));
    }
}