package binh.shopee.service;
import binh.shopee.dto.admin.VoucherAdminResponse;
import binh.shopee.dto.admin.CreateVoucherRequest;
import binh.shopee.dto.admin.UpdateVoucherRequest;
import binh.shopee.entity.Vouchers;
import binh.shopee.repository.VouchersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class AdminVouchersService {
    private final VouchersRepository vouchersRepository;

    public Page<VoucherAdminResponse> getVouchers(int page, int size, String status) {
        // CRITICAL FIX: Sort by createdAt descending to show newest first
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Vouchers> vouchers = vouchersRepository.findAll(pageable);
        return vouchers.map(voucher -> {
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
        });
    }

    @Transactional
    public VoucherAdminResponse createVoucher(CreateVoucherRequest request) {
        Vouchers voucher = Vouchers.builder()
                .code(request.getCode())
                .discountType(Vouchers.DiscountType.valueOf(request.getDiscountType()))
                .discountValue(request.getDiscountAmount())
                .maxDiscount(request.getMaxDiscount())
                .minOrderValue(request.getMinOrderValue())
                .usageLimit(request.getMaxUsage())
                .usedCount(0)
                .startTime(request.getStartDate())
                .endTime(request.getEndDate())
                .status(Vouchers.VoucherStatus.active)
                .build();
        Vouchers saved = vouchersRepository.save(voucher);
        return toResponse(saved);
    }

    @Transactional
    public VoucherAdminResponse updateVoucher(Long id, UpdateVoucherRequest request) {
        Vouchers voucher = vouchersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        voucher.setCode(request.getCode());
        voucher.setDiscountType(Vouchers.DiscountType.valueOf(request.getDiscountType()));
        voucher.setDiscountValue(request.getDiscountAmount());
        voucher.setMaxDiscount(request.getMaxDiscount());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setUsageLimit(request.getMaxUsage());
        voucher.setStartTime(request.getStartDate());
        voucher.setEndTime(request.getEndDate());
        Vouchers saved = vouchersRepository.save(voucher);
        return toResponse(saved);
    }

    @Transactional
    public void deleteVoucher(Long id) {
        vouchersRepository.deleteById(id);
    }

    @Transactional
    public void toggleActive(Long id) {
        Vouchers voucher = vouchersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        voucher.setStatus(
                voucher.getStatus() == Vouchers.VoucherStatus.active
                        ? Vouchers.VoucherStatus.inactive
                        : Vouchers.VoucherStatus.active
        );
        vouchersRepository.save(voucher);
    }

    private VoucherAdminResponse toResponse(Vouchers voucher) {
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
    }
}