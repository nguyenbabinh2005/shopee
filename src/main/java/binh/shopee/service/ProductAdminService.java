package binh.shopee.service;
import binh.shopee.dto.admin.*;
import binh.shopee.dto.product.*;
import binh.shopee.entity.*;
import binh.shopee.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
/**
 * Admin Product Service
 * Fixed for correct entity field names
 */
@Service
@RequiredArgsConstructor
public class ProductAdminService {
    private final ProductsRepository productsRepository;
    private final CategoriesRepository categoriesRepository;
    private final BrandsRepository brandsRepository;
    private final ProductImagesRepository productImagesRepository;
    private final ProductVariantsRepository productVariantsRepository;
    private final ProductCategoriesRepository productCategoriesRepository;
    private final InventoryRepository inventoryRepository;
    @PersistenceContext
    private EntityManager entityManager;
    private static final String UPLOAD_DIR = "public/uploads/products/";
    public Page<ProductAdminDetailResponse> getAllProducts(int page, int size, String search, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Products> productPage;
        if (search != null && !search.trim().isEmpty()) {
            productPage = productsRepository.findByNameContainingIgnoreCase(search, pageable);
        } else if (status != null && !status.trim().isEmpty()) {
            productPage = productsRepository.findByStatus(status, pageable);
        } else {
            productPage = productsRepository.findAll(pageable);
        }
        return productPage.map(this::convertToAdminDetailResponse);
    }
    public ProductAdminDetailResponse getProductById(Long id) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToAdminDetailResponse(product);
    }
    @Transactional
    public ProductAdminDetailResponse createProduct(ProductAdminRequest request) {
        Products product = new Products();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus() != null && request.getStatus().equalsIgnoreCase("ACTIVE")
                ? Products.ProductStatus.active
                : Products.ProductStatus.inactive);
        product.setTotalPurchaseCount(0L); // Initialize to 0
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        if (request.getBrandId() != null) {
            Brands brand = brandsRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }
        product = productsRepository.save(product);
        // Add category via ProductCategories junction table
        if (request.getCategoryId() != null) {
            Categories category = categoriesRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            ProductCategoryId pcId = new ProductCategoryId(product.getProductId(), category.getCategoryId());
            ProductCategories productCategory = ProductCategories.builder()
                    .id(pcId)
                    .product(product)
                    .category(category)
                    .build();
            productCategoriesRepository.save(productCategory);
        }
        // Add images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImages image = new ProductImages();
                image.setProducts(product); // FIXED: products not product
                image.setImageUrl(request.getImageUrls().get(i));
                image.setIsPrimary(i == 0);
                image.setSortOrder(i);
                productImagesRepository.save(image);
            }
        }
        // Add variants
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (VariantAdminRequest variantReq : request.getVariants()) {
                ProductVariants variant = new ProductVariants();
                variant.setProducts(product); // FIXED: products not product
                variant.setAttributesJson(variantReq.getAttributesJson());
                variant.setPriceOverride(variantReq.getPriceOverride());
                variant.setStatus("ACTIVE"); // String not enum
                variant.setCreatedAt(LocalDateTime.now());
                productVariantsRepository.save(variant);
            }
        }
        return convertToAdminDetailResponse(product);
    }
    @Transactional
    public ProductAdminDetailResponse updateProduct(Long id, ProductAdminRequest request) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus().equalsIgnoreCase("ACTIVE")
                    ? Products.ProductStatus.active
                    : Products.ProductStatus.inactive);
        }
        if (request.getBrandId() != null) {
            Brands brand = brandsRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }
        product.setUpdatedAt(LocalDateTime.now());
        // Ensure totalPurchaseCount is not null (only set if currently null)
        if (product.getTotalPurchaseCount() == null) {
            product.setTotalPurchaseCount(0L);
        }
        // Save product first
        product = productsRepository.save(product);
        // Update category using native query to avoid cascade issues
        if (request.getCategoryId() != null) {
            // Delete old category associations using native query
            entityManager.createNativeQuery(
                    "DELETE FROM [dbo].[product_categories] WHERE product_id = :productId"
            ).setParameter("productId", product.getProductId()).executeUpdate();
            // Insert new category association using native query
            entityManager.createNativeQuery(
                            "INSERT INTO [dbo].[product_categories] (product_id, category_id) VALUES (:productId, :categoryId)"
                    ).setParameter("productId", product.getProductId())
                    .setParameter("categoryId", request.getCategoryId())
                    .executeUpdate();
            entityManager.flush();
        }
        // TEMPORARILY DISABLED - Testing without images
        /*
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            // Ensure totalPurchaseCount is set before delete
            if (product.getTotalPurchaseCount() == null) {
                product.setTotalPurchaseCount(0L);
            }
            product = productsRepository.saveAndFlush(product);
            productImagesRepository.deleteByProducts(product);
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImages image = new ProductImages();
                image.setProducts(product);
                image.setImageUrl(request.getImageUrls().get(i));
                image.setIsPrimary(i == 0);
                image.setSortOrder(i);
                productImagesRepository.save(image);
            }
        }
        */
        product = productsRepository.save(product);
        return convertToAdminDetailResponse(product);
    }
    @Transactional
    public void deleteProduct(Long id) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(Products.ProductStatus.inactive);
        product.setUpdatedAt(LocalDateTime.now());
        productsRepository.save(product);
    }
    @Transactional
    public void updateProductStatus(Long id, String status) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(status.equalsIgnoreCase("ACTIVE")
                ? Products.ProductStatus.active
                : Products.ProductStatus.inactive);
        product.setUpdatedAt(LocalDateTime.now());
        productsRepository.save(product);
    }
    // 🔥 NEW: Toggle product status between active and inactive
    @Transactional
    public ProductAdminDetailResponse toggleProductStatus(Long productId) {
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Toggle status: active <-> inactive
        if (Products.ProductStatus.active.equals(product.getStatus())) {
            product.setStatus(Products.ProductStatus.inactive);
        } else {
            product.setStatus(Products.ProductStatus.active);
        }

        product.setUpdatedAt(LocalDateTime.now());
        Products savedProduct = productsRepository.save(product);

        return convertToAdminDetailResponse(savedProduct);
    }
    public ImageUploadResponse uploadImage(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("File must be an image");
            }
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            String imageUrl = "/uploads/products/" + filename;
            return ImageUploadResponse.builder()
                    .imageUrl(imageUrl)
                    .filename(filename)
                    .build();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }
    public List<CategoryAdminResponse> getAllCategories() {
        return categoriesRepository.findAll().stream()
                .map(category -> CategoryAdminResponse.builder()
                        .categoryId(category.getCategoryId())
                        .name(category.getName())
                        .slug(category.getSlug())
                        .build())
                .collect(Collectors.toList());
    }
    public List<BrandAdminResponse> getAllBrands() {
        return brandsRepository.findAll().stream()
                .map(brand -> BrandAdminResponse.builder()
                        .brandId(brand.getBrandId())
                        .name(brand.getName())
                        .slug(brand.getSlug())
                        .logoUrl(brand.getLogoUrl())
                        .build())
                .collect(Collectors.toList());
    }
    private ProductAdminDetailResponse convertToAdminDetailResponse(Products product) {
        ProductAdminDetailResponse response = ProductAdminDetailResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus() != null ? product.getStatus().name() : null)
                .totalPurchaseCount(product.getTotalPurchaseCount() != null ? product.getTotalPurchaseCount() : 0L)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
        // Set category (via ProductCategories junction table)
        productCategoriesRepository.findFirstByProduct(product).ifPresent(pc -> {
            response.setCategoryId(pc.getCategory().getCategoryId());
            response.setCategoryName(pc.getCategory().getName());
        });
        // Set brand
        if (product.getBrand() != null) {
            response.setBrandId(product.getBrand().getBrandId());
            response.setBrandName(product.getBrand().getName());
            BrandInfo brandInfo = new BrandInfo();
            brandInfo.setBrandId(product.getBrand().getBrandId());
            brandInfo.setName(product.getBrand().getName());
            brandInfo.setSlug(product.getBrand().getSlug());
            brandInfo.setLogoUrl(product.getBrand().getLogoUrl());
            brandInfo.setWebsite(product.getBrand().getWebsite());
            brandInfo.setDescription(product.getBrand().getDescription());
            response.setBrand(brandInfo);
        }
        // Set images
        List<ImageInfo> images = productImagesRepository.findByProductsOrderBySortOrder(product).stream()
                .map(img -> {
                    ImageInfo imageInfo = new ImageInfo();
                    imageInfo.setImageId(img.getImageId());
                    imageInfo.setImageUrl(img.getImageUrl());
                    imageInfo.setIsPrimary(img.getIsPrimary());
                    imageInfo.setSortOrder(img.getSortOrder());
                    return imageInfo;
                })
                .collect(Collectors.toList());
        response.setImages(images);
        // Set variants (no quantity field in ProductVariants entity)
        List<VariantInfo> variants = productVariantsRepository.findByProducts(product).stream()
                .map(v -> {
                    VariantInfo variantInfo = new VariantInfo();
                    variantInfo.setVariantId(v.getVariantId());
                    variantInfo.setAttributesJson(v.getAttributesJson());
                    variantInfo.setPriceOverride(v.getPriceOverride());
                    variantInfo.setStatus(v.getStatus());
                    // Note: ProductVariants doesn't have quantity field
                    variantInfo.setCreatedAt(v.getCreatedAt());
                    return variantInfo;
                })
                .collect(Collectors.toList());
        response.setVariants(variants);
        // Calculate total stock from Inventory table
        Integer totalStock = variants.stream()
                .map(v -> {
                    return inventoryRepository.findByVariantVariantId(v.getVariantId())
                            .map(inv -> inv.getStockQty() != null ? inv.getStockQty() : 0)
                            .orElse(0);
                })
                .reduce(0, Integer::sum);
        response.setTotalStock(totalStock);
        return response;
    }
}