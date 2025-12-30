package binh.shopee.controller;
import binh.shopee.dto.admin.VoucherAdminResponse;
import binh.shopee.dto.admin.CreateVoucherRequest;
import binh.shopee.dto.admin.UpdateVoucherRequest;
import binh.shopee.service.AdminVouchersService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/admin/vouchers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminVouchersController {

    private final AdminVouchersService adminVouchersService;
    @GetMapping
    public ResponseEntity<Page<VoucherAdminResponse>> getVouchers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(adminVouchersService.getVouchers(page, size, status));
    }
    @PostMapping
    public ResponseEntity<VoucherAdminResponse> createVoucher(@RequestBody CreateVoucherRequest request) {
        return ResponseEntity.ok(adminVouchersService.createVoucher(request));
    }
    @PutMapping("/{id}")
    public ResponseEntity<VoucherAdminResponse> updateVoucher(
            @PathVariable Long id,
            @RequestBody UpdateVoucherRequest request
    ) {
        return ResponseEntity.ok(adminVouchersService.updateVoucher(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
        adminVouchersService.deleteVoucher(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleVoucher(@PathVariable Long id) {
        adminVouchersService.toggleActive(id);
        return ResponseEntity.ok().build();
    }
}