package binh.shopee.controller;

import binh.shopee.dto.voucher.VoucherResponse;
import binh.shopee.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping("/available")
    public ResponseEntity<List<VoucherResponse>> getAvailableVouchers(
            @RequestParam Long userId) {

        // ✅ Nếu FE gửi userId không hợp lệ, có thể handle ở service
        List<VoucherResponse> vouchers = voucherService.getAvailableVouchers(userId);

        return ResponseEntity.ok(vouchers);
    }
}
