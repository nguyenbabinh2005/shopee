package binh.shopee.dto.order;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelectVoucherRequest {
    private List<VariantItem> variants;
    private String vouchercode; // nullable → bỏ voucher
}