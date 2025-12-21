package binh.shopee.service;

import binh.shopee.dto.voucher.UserVoucherResponse;
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
    public List<UserVoucherResponse> getVouchersByUser(Long userId) {

        List<UserVouchers> userVouchers =
                userVouchersRepository.findByUser_UserId(userId);

        LocalDateTime now = LocalDateTime.now();

        return userVouchers.stream()
                .map(uv -> {

                    // Nếu voucher hết hạn → override trạng thái
                    String status = uv.getStatus().name();


                    return UserVoucherResponse.builder()
                            .voucherId(uv.getVoucher().getVoucherId())
                            .code(uv.getVoucher().getCode())
                            .discountType(uv.getVoucher().getDiscountType().name())
                            .discountValue(uv.getVoucher().getDiscountValue())
                            .maxDiscount(uv.getVoucher().getMaxDiscount())
                            .minOrderValue(uv.getVoucher().getMinOrderValue())
                            .startTime(uv.getVoucher().getStartTime())
                            .endTime(uv.getVoucher().getEndTime())
                            .userVoucherStatus(status)
                            .redeemedAt(uv.getRedeemedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
