package binh.shopee.repository;

import binh.shopee.entity.UserVouchers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserVouchersRepository extends JpaRepository<UserVouchers, Long> {

    Optional<UserVouchers> findByUser_UserIdAndVoucher_VoucherId(
            Long userId,
            Long voucherId
    );
    List<UserVouchers> findByUser_UserId(Long userId);
}
