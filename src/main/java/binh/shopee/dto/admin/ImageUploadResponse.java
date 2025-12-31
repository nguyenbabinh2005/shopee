package binh.shopee.dto.admin;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageUploadResponse {
    private String imageUrl;
    private String filename;
}