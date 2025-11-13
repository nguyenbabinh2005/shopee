package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về sau khi đặt hàng thành công.
 * Frontend chỉ dùng để điều hướng hoặc hiện thông báo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;          // ID đơn hàng mới tạo (frontend có thể dùng để xem chi tiết)
    private String status;         // trạng thái đơn hàng: "CREATED", "PENDING_PAYMENT", "PROCESSING",...
    private String message;        // thông báo: "Đặt hàng thành công"
}
