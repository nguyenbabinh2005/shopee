package binh.shopee.controller;

import binh.shopee.dto.voucher.VoucherResponse;
import binh.shopee.service.VoucherService;
import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping("/available")
    public ResponseEntity<List<VoucherResponse>> getAvailableVouchers(
            @AuthenticationPrincipal CustomUserDetails user) {

        // ✅ Handle unauthenticated user
        if (user == null) {
            return ResponseEntity.status(401).body(Collections.emptyList());
        }

        List<VoucherResponse> vouchers = voucherService.getAvailableVouchers(
                user.getUser().getUserId()
        );

        return ResponseEntity.ok(vouchers);
    }
}