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
public class OrderCreateRequest {

    private Long userId; // người đặt hàng

    private String recipientName; // tên người nhận
    private String recipientPhone;
    private String shippingAddress;

    private String paymentMethod; // COD, VNPay, Card...

    private String note; // ghi chú thêm

    private List<OrderItemRequest> items; // danh sách biến thể + quantity
}
