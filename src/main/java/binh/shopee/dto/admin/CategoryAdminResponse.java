package binh.shopee.dto.admin;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryAdminResponse {
    private Long categoryId;
    private String name;
    private String slug;
}