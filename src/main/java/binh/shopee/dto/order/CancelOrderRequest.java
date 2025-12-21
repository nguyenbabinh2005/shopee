package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CancelOrderRequest {
    private String reason;
}
