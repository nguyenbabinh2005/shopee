package binh.shopee.controller;

import binh.shopee.dto.voucher.UserVoucherResponse;
import binh.shopee.service.UserVoucherQueryService;
import binh.shopee.service.UserVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-vouchers")
@RequiredArgsConstructor
public class UserVoucherController {

    private final UserVoucherService userVoucherService;
    private final UserVoucherQueryService userVoucherQueryService;

    /**
     * User bấm "Lưu voucher"
     */
    @PostMapping("/{voucherId}")
    public String saveVoucher(
            @RequestParam Long userId,
            @PathVariable Long voucherId
    ) {
        userVoucherService.saveVoucherForUser(userId, voucherId);
        return "Lưu voucher thành công";
    }
    @GetMapping("/user/{userId}")
    public List<UserVoucherResponse> getUserVouchers(
            @PathVariable Long userId
    ) {
        return userVoucherQueryService.getVouchersByUser(userId);
    }
}
