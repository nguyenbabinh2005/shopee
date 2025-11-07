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
public class BrandInfo {
    private Long brandId;
    private String name;
    private String slug;
    private String logoUrl;
    private String website;
    private String description;
}