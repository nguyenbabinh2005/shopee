package binh.shopee.dto.admin;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandAdminResponse {
    private Long brandId;
    private String name;
    private String slug;
    private String logoUrl;
}