package binh.shopee.service;

import binh.shopee.dto.product.ImageInfo;
import binh.shopee.dto.product.ProductDetailResponse;
import binh.shopee.dto.product.ProductRequest;
import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.dto.product.ReviewInfo;
import binh.shopee.dto.product.VariantInfo;
import binh.shopee.entity.Brands;
import binh.shopee.entity.Inventory;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.Products;
import binh.shopee.repository.BrandsRepository;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import binh.shopee.repository.ProductsRepository;
import binh.shopee.repository.ReviewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
@Transactional
public class ProductsService {
    @Autowired
    private final ProductsRepository productsRepository;
    @Autowired
    private final BrandsRepository brandsRepository;
    @Autowired
    private final ProductImagesRepository productImagesRepository;
    @Autowired
    private final ProductVariantsRepository productVariantsRepository;
    @Autowired
    private final ReviewsRepository reviewsRepository;
    @Autowired
    private final ProductVariantsService productVariantsService;

    /**
     * Tìm kiếm sản phẩm theo từ khóa (name)
     */
    public List<ProductSearchResponse> searchProducts(String keyword) {
        return productsRepository.searchProducts(keyword);
    }

    /**
     * Lấy danh sách sản phẩm theo brand
     */
    public List<ProductSearchResponse> getProductsByBrand(Long brandId) {
        return productsRepository.findProductsByBrand(brandId);
    }

    /**
     * Lấy chi tiết sản phẩm theo slug
     */
    public Optional<Products> getProductBySlug(String slug) {
        return productsRepository.findBySlug(slug);
    }

    /**
     * Lấy chi tiết sản phẩm theo ID
     */
    public Optional<Products> getProductById(Long id) {
        return productsRepository.findById(id);
    }

    /**
     * Thêm sản phẩm mới
     */
    public ProductSearchResponse addProduct(ProductRequest request) {
        Products product = new Products();

        // Set brand
        if (request.getBrandId() != null) {
            Brands brand = brandsRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }

        product.setName(request.getName());
        product.setSlug(StringUtils.hasText(request.getSlug()) ? request.getSlug() : generateSlug(request.getName()));
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        if (request.getStatus() != null) {
            product.setStatus(Products.ProductStatus.valueOf(request.getStatus()));
        }
        Products saved = productsRepository.save(product);
        ProductImages primaryImage = productImagesRepository
                .findFirstByProductsAndIsPrimaryTrue(saved)
                .orElse(null);
        // Trả về DTO ProductSearchResponse, ảnh primary chưa có nên để null
        return ProductSearchResponse.builder()
                .productId(saved.getProductId())
                .name(saved.getName())
                .slug(saved.getSlug())
                .price(saved.getPrice())
                .imageUrl(primaryImage != null ? primaryImage.getImageUrl() : null)
                .build();
    }

    /**
     * Sửa sản phẩm
     */
    public ProductSearchResponse updateProduct(Long id, ProductRequest request) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update brand nếu có
        if (request.getBrandId() != null) {
            Brands brand = brandsRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }

        product.setName(request.getName());
        product.setSlug(StringUtils.hasText(request.getSlug()) ? request.getSlug() : generateSlug(request.getName()));
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        if (request.getStatus() != null) {
            product.setStatus(Products.ProductStatus.valueOf(request.getStatus()));
        }
        Products saved = productsRepository.save(product);
        ProductImages primaryImage = productImagesRepository
                .findFirstByProductsAndIsPrimaryTrue(saved)
                .orElse(null);
        return ProductSearchResponse.builder()
                .productId(saved.getProductId())
                .name(saved.getName())
                .slug(saved.getSlug())
                .price(saved.getPrice())
                .imageUrl(primaryImage != null ? primaryImage.getImageUrl() : null)
                .build();
    }

    /**
     * Xóa sản phẩm
     */
    public void deleteProduct(Long id) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productsRepository.delete(product);
    }

    /**
     * Hàm helper tạo slug từ tên sản phẩm
     */
    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
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
                        .sku(v.getSku())
                        .quantity(productVariantsService.getAvailableQuantity(v.getVariantId()))
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
