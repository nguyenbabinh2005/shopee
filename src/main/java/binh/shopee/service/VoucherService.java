package binh.shopee.service;

import binh.shopee.entity.Vouchers;
import binh.shopee.entity.Vouchers.DiscountType;
import binh.shopee.entity.Vouchers.VoucherStatus;
import binh.shopee.repository.VouchersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import binh.shopee.dto.voucher.VoucherResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VouchersRepository vouchersRepository;

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

        // 4. Kiểm tra giá trị đơn hàng tối thiểu
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
    public List<VoucherResponse> getAvailableVouchers() {
        return vouchersRepository
                .findAvailableVouchers(
                        Vouchers.VoucherStatus.active,
                        LocalDateTime.now()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }
    private VoucherResponse toResponse(Vouchers v) {
        return VoucherResponse.builder()
                .voucherId(v.getVoucherId())
                .code(v.getCode())
                .discountType(v.getDiscountType().name())
                .discountValue(v.getDiscountValue())
                .maxDiscount(v.getMaxDiscount())
                .minOrderValue(v.getMinOrderValue())
                .usageLimit(v.getUsageLimit())
                .usedCount(v.getUsedCount())
                .startTime(v.getStartTime())
                .endTime(v.getEndTime())
                .build();
    }

}
