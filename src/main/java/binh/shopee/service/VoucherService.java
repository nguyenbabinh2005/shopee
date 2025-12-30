package binh.shopee.service;

import binh.shopee.entity.UserVouchers;
import binh.shopee.entity.Vouchers;
import binh.shopee.entity.Vouchers.DiscountType;
import binh.shopee.entity.Vouchers.VoucherStatus;
import binh.shopee.repository.UserVouchersRepository;
import binh.shopee.repository.VouchersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import binh.shopee.dto.voucher.VoucherResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VouchersRepository vouchersRepository;
    private final UserVouchersRepository userVouchersRepository;

    /**
     * Tính số tiền được giảm từ voucher
     */
    public BigDecimal calculateDiscount(String voucherCode, BigDecimal subtotal) {

        if (voucherCode == null || voucherCode.isBlank()) {
            return BigDecimal.ZERO;
        }

        // 1. Lấy voucher hợp lệ
        Vouchers voucher = vouchersRepository.findByCodeAndStatus(voucherCode, VoucherStatus.active)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại hoặc đã bị khóa"));

        LocalDateTime now = LocalDateTime.now();

        // 2. Kiểm tra thời gian
        if (now.isBefore(voucher.getStartTime()) || now.isAfter(voucher.getEndTime())) {
            throw new RuntimeException("Voucher đã hết hạn hoặc chưa tới thời gian sử dụng");
        }

        // 3. Kiểm tra lượt sử dụng
        if (voucher.getUsageLimit() != null &&
                voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new RuntimeException("Voucher đã hết lượt sử dụng");
        }

        // 4. Kiểm tra giá2 trị đơn hàng tối thiểu
        if (voucher.getMinOrderValue() != null &&
                subtotal.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để dùng voucher");
        }

        // 5. Tính discount
        BigDecimal discount;

        if (voucher.getDiscountType() == DiscountType.percentage) {
            discount = subtotal
                    .multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100));
        } else {
            discount = voucher.getDiscountValue();
        }

        // 6. Áp max discount nếu có
        if (voucher.getMaxDiscount() != null &&
                discount.compareTo(voucher.getMaxDiscount()) > 0) {
            discount = voucher.getMaxDiscount();
        }

        // 7. Không cho giảm âm / vượt subtotal
        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }

        return discount;
    }
    public List<VoucherResponse> getAvailableVouchers(Long userId) {

        LocalDateTime now = LocalDateTime.now();

        return vouchersRepository
                .findAvailableVouchers(now)
                .stream()
                .map(voucher -> {

                    // 1. Check user đã lưu voucher chưa
                    Optional<UserVouchers> userVoucherOpt =
                            userVouchersRepository
                                    .findByUser_UserIdAndVoucher_VoucherId(
                                            userId,
                                            voucher.getVoucherId()
                                    );

                    boolean isSaved = userVoucherOpt.isPresent();

                    // 2. Xác định trạng thái voucher của user

                    // 3. Build response
                    return VoucherResponse.builder()
                            .voucherId(voucher.getVoucherId())
                            .code(voucher.getCode())
                            .discountType(voucher.getDiscountType().name())
                            .discountAmount(voucher.getDiscountValue())
                            .minOrderValue(voucher.getMinOrderValue())
                            .maxDiscount(voucher.getMaxDiscount())
                            .startDate(voucher.getStartTime())
                            .endDate(voucher.getEndTime())
                            .isSaved(isSaved)
                            .userVoucherStatus(voucher.getStatus().name())
                            .build();
                })
                .toList();
    }
    private VoucherResponse toResponse(Vouchers v) {
        return VoucherResponse.builder()
                .voucherId(v.getVoucherId())
                .code(v.getCode())
                .discountType(v.getDiscountType().name())
                .discountAmount(v.getDiscountValue())
                .minOrderValue(v.getMinOrderValue())
                .maxDiscount(v.getMaxDiscount())
                .startDate(v.getStartTime())
                .endDate(v.getEndTime())
                .userVoucherStatus(v.getStatus().name())
                .isSaved(true)
                .build();
    }
    public VoucherResponse getVoucherByCode(String code) {
        Vouchers voucher = vouchersRepository.findByCodeAndStatus(code, VoucherStatus.active)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
        return toResponse(voucher);
    }
    public Vouchers findVoucherByCode(String code) {
        return vouchersRepository.findByCodeAndStatus(code, VoucherStatus.active)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
    }

    public void markAsUsed(String voucherCode, Long userId) {
        Vouchers voucher = findVoucherByCode(voucherCode);

        // Tìm user voucher relationship
        UserVouchers userVoucher = userVouchersRepository
                .findByUser_UserIdAndVoucher_VoucherId(userId, voucher.getVoucherId())
                .orElseThrow(() -> new RuntimeException("User không có voucher này"));

        // Mark as used
        userVoucher.setStatus( UserVouchers.Status.used);
        userVoucher.setRedeemedAt(LocalDateTime.now());
        userVouchersRepository.save(userVoucher);
        voucher.setUsedCount(voucher.getUsedCount() + 1);
        vouchersRepository.save(voucher);
    }
    public void restoreVoucher(String voucherCode, Long userId) {
        Vouchers voucher = findVoucherByCode(voucherCode);

        // Tìm user voucher relationship
        UserVouchers userVoucher = userVouchersRepository
                .findByUser_UserIdAndVoucher_VoucherId(userId, voucher.getVoucherId())
                .orElse(null);
        userVoucher.setStatus(UserVouchers.Status.unused);
        userVouchersRepository.save(userVoucher);
        voucher.setUsedCount(Math.max(0, voucher.getUsedCount() - 1));
        vouchersRepository.save(voucher);
    }


}
