package binh.shopee.service;
import binh.shopee.dto.admin.UserAdminResponse;
import binh.shopee.dto.admin.VoucherAdminResponse;
import binh.shopee.dto.admin.OrderAdminResponse;
import binh.shopee.entity.Users;
import binh.shopee.entity.Vouchers;
import binh.shopee.entity.Orders;
import binh.shopee.entity.UserVouchers;
import binh.shopee.repository.UsersRepository;
import binh.shopee.repository.UserVouchersRepository;
import binh.shopee.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AdminUsersService {
    private final UsersRepository usersRepository;
    private final UserVouchersRepository userVouchersRepository;
    private final OrdersRepository ordersRepository;
    public Page<UserAdminResponse> getUsers(int page, int size, String search, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Users> users = usersRepository.findAll(pageable);
        return users.map(user -> {
            UserAdminResponse response = new UserAdminResponse();
            response.setUserId(user.getUserId());
            response.setUsername(user.getUsername());
            response.setName(user.getFullName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());
            response.setStatus(user.getStatus());
            response.setRole(user.getRole());
            response.setCreatedAt(user.getCreatedAt());
            response.setViolationCount(0);
            return response;
        });
    }
    public UserAdminResponse getUserDetail(Long id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserAdminResponse response = new UserAdminResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setViolationCount(0);
        return response;
    }
    @Transactional
    public void updateUserStatus(Long id, String status) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        usersRepository.save(user);
    }
    public List<VoucherAdminResponse> getUserVouchers(Long userId) {
        usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<UserVouchers> userVouchers = userVouchersRepository.findByUser_UserId(userId);
        return userVouchers.stream()
                .map(uv -> {
                    Vouchers voucher = uv.getVoucher();
                    VoucherAdminResponse response = new VoucherAdminResponse();
                    response.setVoucherId(voucher.getVoucherId());
                    response.setCode(voucher.getCode());
                    response.setDiscountType(voucher.getDiscountType().name());
                    response.setDiscountAmount(voucher.getDiscountValue());
                    response.setMaxDiscount(voucher.getMaxDiscount());
                    response.setMinOrderValue(voucher.getMinOrderValue());
                    response.setStartDate(voucher.getStartTime());
                    response.setEndDate(voucher.getEndTime());
                    response.setIsActive(voucher.getStatus() == Vouchers.VoucherStatus.active);
                    response.setUsageCount(voucher.getUsedCount());
                    response.setMaxUsage(voucher.getUsageLimit());
                    return response;
                })
                .collect(Collectors.toList());
    }
    public List<OrderAdminResponse> getUserOrders(Long userId) {
        usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Orders> orders = ordersRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(order -> {
                    int itemCount = order.getItems() != null ? order.getItems().size() : 0;
                    OrderAdminResponse response = new OrderAdminResponse();
                    response.setOrderId(order.getOrderId());
                    response.setOrderNumber(order.getOrderNumber());
                    response.setCustomerName(order.getUser().getFullName());
                    response.setCustomerEmail(order.getUser().getEmail());
                    response.setCustomerPhone(order.getUser().getPhone());
                    response.setStatus(order.getStatus().name());
                    response.setTotalAmount(order.getSubtotal());
                    response.setShippingFee(order.getShippingFee());
                    response.setDiscountAmount(order.getDiscountTotal());
                    response.setFinalAmount(order.getGrandTotal());
                    response.setItemCount(itemCount);
                    response.setCreatedAt(order.getCreatedAt());
                    response.setUpdatedAt(order.getUpdatedAt());
                    return response;
                })
                .collect(Collectors.toList());
    }
}