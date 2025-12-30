package binh.shopee.controller;
import binh.shopee.dto.admin.OrderAdminResponse;
import binh.shopee.dto.admin.UpdateOrderStatusRequest;
import binh.shopee.service.AdminOrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminOrdersController {

    private final AdminOrdersService adminOrdersService;
    @GetMapping
    public ResponseEntity<Page<OrderAdminResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(adminOrdersService.getOrders(page, size, status, search));
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderAdminResponse> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrdersService.getOrderDetail(id));
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        adminOrdersService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok().build();
    }
}