package binh.shopee.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewInfo {
    private Long reviewId;
    private Byte rating;
    private String title;
    private String content;
    private String status;
    private String userName; // tên người dùng (nếu có)
    private LocalDateTime createdAt;
}