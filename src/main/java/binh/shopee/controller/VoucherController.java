package binh.shopee.controller;
import binh.shopee.dto.voucher.VoucherResponse;
import binh.shopee.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    /**
     * Danh sách voucher user có thể LƯU
     */
    @GetMapping("/available")
    public List<VoucherResponse> getAvailableVouchers() {
        return voucherService.getAvailableVouchers();
    }
}
