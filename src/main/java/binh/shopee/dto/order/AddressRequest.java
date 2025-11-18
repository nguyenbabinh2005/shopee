package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {

    private String recipientName;  // Tên người nhận
    private String phone;          // Số điện thoại
    private String street;         // Đường / số nhà
    private String ward;           // Phường / xã
    private String district;       // Quận / huyện
    private String city;           // Tỉnh / thành phố
    private Boolean isDefault;     // Đặt làm địa chỉ mặc định
}
