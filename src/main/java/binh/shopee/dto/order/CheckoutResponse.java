package binh.shopee.dto.order;

import binh.shopee.dto.product.VariantInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponse {

    private List<VariantInfo> variants;                   // Mỗi variant là một item riêng, kèm tên product
    private List<PaymentMethodResponse> paymentMethods;   // Phương thức thanh toán
    private List<AddressResponse> addressList;            // Danh sách địa chỉ giao hàng của user//
    private BigDecimal totalAmount;                       // Tổng tiền cho đơn hàng
}
