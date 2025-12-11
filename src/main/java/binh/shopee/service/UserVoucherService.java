package binh.shopee.service;

import binh.shopee.entity.*;
import binh.shopee.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserVoucherService {

    private final UserVouchersRepository userVouchersRepository;
    private final VouchersRepository vouchersRepository;
    private final UsersRepository usersRepository;

    @Transactional
    public void saveVoucherForUser(Long userId, Long voucherId) {

        // 1️⃣ Check user tồn tại
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // 2️⃣ Check voucher tồn tại
        Vouchers voucher = vouchersRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        // 3️⃣ Check trạng thái voucher
        if (voucher.getStatus() != Vouchers.VoucherStatus.active
                || voucher.getStartTime().isAfter(now)
                || voucher.getEndTime().isBefore(now)) {
            throw new RuntimeException("Voucher không khả dụng");
        }

        // 4️⃣ Check usage limit
        if (voucher.getUsageLimit() != null
                && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new RuntimeException("Voucher đã hết lượt sử dụng");
        }

        // 5️⃣ Check user đã lưu chưa
        boolean existed = userVouchersRepository
                .findByUser_UserIdAndVoucher_VoucherId(userId, voucherId)
                .isPresent();

        if (existed) {
            throw new RuntimeException("Bạn đã lưu voucher này rồi");
        }

        // 6️⃣ Lưu voucher cho user
        UserVouchers userVoucher = UserVouchers.builder()
                .user(user)
                .voucher(voucher)
                .status(UserVouchers.Status.unused)
                .build();

        userVouchersRepository.save(userVoucher);
    }
}
