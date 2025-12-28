package binh.shopee.service;
import binh.shopee.dto.product.ImageInfo;
import binh.shopee.dto.product.ProductDetailResponse;
import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.dto.product.ReviewInfo;
import binh.shopee.dto.product.VariantInfo;
import binh.shopee.entity.Products;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import binh.shopee.repository.ProductsRepository;
import binh.shopee.repository.ReviewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final ProductImagesRepository productImagesRepository;
    private final ProductVariantsRepository productVariantsRepository;
    private final ReviewsRepository reviewsRepository;
    private final InventoryService inventoryService;
    public List<ProductSearchResponse> filterProducts(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean onlyDiscount,
            BigDecimal minRating
    ) {
        return productsRepository.filterProducts(
                minPrice,
                maxPrice,
                onlyDiscount != null && onlyDiscount,
                minRating
        );
    }
    public List<ProductSearchResponse> getTopSellingProducts() {
        Pageable top10 = PageRequest.of(0, 10);
        return productsRepository.findTopSellingProducts(top10);
    }
    public List<ProductSearchResponse> getTop50Products() {
        return productsRepository.findTopProducts(
                PageRequest.of(0, 50)
        );
    }

    public List<ProductSearchResponse> searchProducts(String keyword) {
        return productsRepository.searchProducts(keyword);
    }



    public void deleteProduct(Long id) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        productsRepository.delete(product);
    }

    public ProductDetailResponse getProductDetail(Long productId) {

        // 1️⃣ Truy vấn thông tin chính (Products + Brand + thống kê)
        ProductDetailResponse detail = productsRepository.findProductDetailById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có ID = " + productId));

        // 2️⃣ Lấy danh sách ảnh
        List<ImageInfo> images = productImagesRepository.findByProducts_ProductId(productId)
                .stream()
                .map(pi -> ImageInfo.builder()
                        .imageId(pi.getImageId())
                        .imageUrl(pi.getImageUrl())
                        .isPrimary(pi.getIsPrimary())
                        .sortOrder(pi.getSortOrder())
                        .build())
                .toList();

        // 3️⃣ Lấy danh sách biến thể
        List<VariantInfo> variants = productVariantsRepository.findByProducts_ProductId(productId)
                .stream()
                .map(v -> VariantInfo.builder()
                        .variantId(v.getVariantId())
                        .quantity(inventoryService.getAvailableQuantity(v.getVariantId()))
                        .attributesJson(v.getAttributesJson())
                        .priceOverride(v.getPriceOverride())
                        .status(v.getStatus())
                        .createdAt(v.getCreatedAt())
                        .build())
                .toList();

        // 4️⃣ Lấy danh sách đánh giá
        List<ReviewInfo> reviews = reviewsRepository.findByProducts_ProductIdAndStatus(productId, "approved")
                .stream()
                .map(r -> ReviewInfo.builder()
                        .reviewId(r.getReviewId())
                        .rating(r.getRating())
                        .title(r.getTitle())
                        .content(r.getContent())
                        .status(r.getStatus())
                        .userName(r.getUsers() != null ? r.getUsers().getFullName() : "Khách ẩn danh")
                        .createdAt(r.getCreated_at())
                        .build())
                .toList();

        // 5️⃣ Gán vào DTO tổng
        detail.setImages(images);
        detail.setVariants(variants);
        detail.setReviews(reviews);

        return detail;
    }
}