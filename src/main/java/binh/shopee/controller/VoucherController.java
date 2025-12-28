package binh.shopee.controller;
import binh.shopee.dto.voucher.VoucherResponse;
import binh.shopee.service.VoucherService;
import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;
    @GetMapping("/available")
    public List<VoucherResponse> getAvailableVouchers(@AuthenticationPrincipal CustomUserDetails user) {
        return voucherService.getAvailableVouchers(user.getUser().getUserId());
    }
}
