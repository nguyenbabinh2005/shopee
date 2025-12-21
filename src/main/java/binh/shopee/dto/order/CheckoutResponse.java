package binh.shopee.dto.order;
import binh.shopee.dto.voucher.VoucherResponse;
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

    private List<CheckoutItemResponse> items;
    private BigDecimal subtotal;
    // Shipping
    private List<ShippingMethodResponse> availableShippingMethods;
    private ShippingMethodResponse selectedShipping;
    private BigDecimal shippingFee;
    private AddressResponse selectedAddress;

    private VoucherResponse selectedVoucher;
    private BigDecimal orderDiscount;
    // Payment
    private List<PaymentMethodResponse> availablePaymentMethods;
    private PaymentMethodResponse selectedPayment;
    // Total
    private BigDecimal finalTotal;
    // Validation
    private Boolean canProceedToPayment;
    private List<String> validationErrors;
}
