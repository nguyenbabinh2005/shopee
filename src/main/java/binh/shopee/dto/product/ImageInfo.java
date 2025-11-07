package binh.shopee.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageInfo {
    private Long imageId;
    private String imageUrl;
    private Boolean isPrimary;
    private Integer sortOrder;
}
