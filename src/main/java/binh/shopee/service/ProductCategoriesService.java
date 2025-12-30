package binh.shopee.service;

import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.repository.ProductCategoriesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class    ProductCategoriesService  {
    private final ProductCategoriesRepository productCategoriesRepository;
    public Page<ProductSearchResponse> getProductsByCategory(
            Long categoryId,
            Pageable pageable
    ) {
        return productCategoriesRepository
                .findProductSearchByCategory(categoryId, pageable);
    }
}
