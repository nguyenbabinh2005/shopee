package binh.shopee.dto.category;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Long categoryId;
    private String name;
    private String slug;
    private String status;
    private Integer sortOrder;
    private Long parentId; // null nếu là danh mục gốc
}
