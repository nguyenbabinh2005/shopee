package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateResponse {

    private Long orderId;          // ID đơn hàng mới tạo (frontend có thể dùng để xem chi tiết)
    private String status;         // trạng thái đơn hàng: "CREATED", "PENDING_PAYMENT", "PROCESSING",...
    private String message;        // thông báo: "Đặt hàng thành công"
}
