package binh.shopee.dto.category;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTreeResponse {
    private Long categoryId;
    private String name;
    private String slug;
    private String status;
    private Integer sortOrder;
    private Long parentId;

    private List<CategoryTreeResponse> children;
}
