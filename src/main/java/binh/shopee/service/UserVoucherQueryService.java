package binh.shopee.service;
import binh.shopee.dto.voucher.VoucherResponse;
import binh.shopee.entity.UserVouchers;
import binh.shopee.repository.UserVouchersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class UserVoucherQueryService {
    private final UserVouchersRepository userVouchersRepository;
    @Transactional(readOnly = true)
    public List<VoucherResponse> getVouchersByUser(Long userId) {
        List<UserVouchers> userVouchers =
                userVouchersRepository.findByUser_UserId(userId);
        LocalDateTime now = LocalDateTime.now();
        return userVouchers.stream()
                .map(uv -> {
                    // ✅ FIX: Correct status mapping
                    String status;
                    // 1️⃣ Check if already used
                    if (uv.getStatus() == UserVouchers.Status.used) {
                        status = "used";  // ✅ FIXED: was "UNAVAILABLE"
                    }
                    // 2️⃣ Check if voucher hasn't started yet
                    else if (uv.getVoucher().getStartTime().isAfter(now)) {
                        status = "UNAVAILABLE";  // Not started yet
                    }
                    // 3️⃣ Check if voucher expired
                    else if (uv.getVoucher().getEndTime().isBefore(now)) {
                        status = "expired";  // ✅ FIXED: was "UNAVAILABLE"
                    }
                    // 4️⃣ Check if voucher is inactive
                    else if (uv.getVoucher().getStatus() != binh.shopee.entity.Vouchers.VoucherStatus.active) {
                        status = "UNAVAILABLE";
                    }
                    // 5️⃣ Otherwise, it's available
                    else {
                        status = "AVAILABLE";
                    }
                    return VoucherResponse.builder()
                            .voucherId(uv.getVoucher().getVoucherId())
                            .code(uv.getVoucher().getCode())
                            .discountType(uv.getVoucher().getDiscountType().name())
                            .discountAmount(uv.getVoucher().getDiscountValue())
                            .maxDiscount(uv.getVoucher().getMaxDiscount())
                            .minOrderValue(uv.getVoucher().getMinOrderValue())
                            .startDate(uv.getVoucher().getStartTime())
                            .endDate(uv.getVoucher().getEndTime())
                            .userVoucherStatus(status)
                            .isSaved(true)
                            .build();
                })
                .collect(Collectors.toList());
    }
}