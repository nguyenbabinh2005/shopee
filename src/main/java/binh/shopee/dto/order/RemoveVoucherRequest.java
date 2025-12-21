package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RemoveVoucherRequest {

    // Danh sách sản phẩm trong checkout
    private List<VariantItem> variants;

    // Phương thức vận chuyển
    private Long shippingMethodId;

    // Phương thức thanh toán (COD, VNPAY, MOMO, ...)
    private String paymentMethodCode;
}

