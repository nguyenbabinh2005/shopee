package binh.shopee.dto.authenticate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse<T> {
    private int statusCode;   // mã trạng thái HTTP
    private boolean success = false; // true / false
    private String message;  // thông báo
    private T data;           // dữ liệu trả về tùy mục đích (token, user info,…)
}