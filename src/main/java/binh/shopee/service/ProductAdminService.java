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
    private final ReviewsRepository reviewsRepository;

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
        product.setSlug(generateSlug(request.getName()));
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus() != null && request.getStatus().equalsIgnoreCase("ACTIVE")
                ? Products.ProductStatus.active
                : Products.ProductStatus.inactive);
        product.setTotalPurchaseCount(0L);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        if (request.getBrandId() != null) {
            Brands brand = brandsRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }

        product = productsRepository.save(product);

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

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImages image = new ProductImages();
                image.setProducts(product);
                image.setImageUrl(request.getImageUrls().get(i));
                image.setIsPrimary(i == 0);
                image.setSortOrder(i);
                productImagesRepository.save(image);
            }
        }

        // ALWAYS create default variant for every product
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            // If variants provided, create them
            for (VariantAdminRequest variantReq : request.getVariants()) {
                ProductVariants variant = new ProductVariants();
                variant.setProducts(product);
                variant.setAttributesJson(variantReq.getAttributesJson());
                variant.setPriceOverride(variantReq.getPriceOverride());
                variant.setStatus("ACTIVE");
                variant.setCreatedAt(LocalDateTime.now());
                variant.setPurchaseCount(0L);
                productVariantsRepository.save(variant);
            }
        } else {
            // ✅ FIX: Always create default variant using JPA (NOT native SQL)
            ProductVariants defaultVariant = new ProductVariants();
            defaultVariant.setProducts(product);
            defaultVariant.setAttributesJson("{}");
            defaultVariant.setStatus("ACTIVE");
            defaultVariant.setCreatedAt(LocalDateTime.now());
            defaultVariant.setPurchaseCount(0L);

            // Save variant first
            defaultVariant = productVariantsRepository.save(defaultVariant);

            // Create inventory with initial quantity
            int initialQuantity = (request.getQuantity() != null) ? request.getQuantity() : 0;

            Inventory inventory = new Inventory();
            inventory.setVariant(defaultVariant);
            inventory.setStockQty(initialQuantity);
            inventory.setReservedQty(0);

            inventoryRepository.save(inventory);
        }

        return convertToAdminDetailResponse(product);
    }

    @Transactional
    public ProductAdminDetailResponse updateProduct(Long id, ProductAdminRequest request) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getName() != null) {
            product.setName(request.getName());
            product.setSlug(generateSlug(request.getName()));
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
        if (product.getTotalPurchaseCount() == null) {
            product.setTotalPurchaseCount(0L);
        }

        product = productsRepository.save(product);

        // Update category
        if (request.getCategoryId() != null) {
            entityManager.createNativeQuery(
                    "DELETE FROM [dbo].[product_categories] WHERE product_id = :productId"
            ).setParameter("productId", product.getProductId()).executeUpdate();

            entityManager.createNativeQuery(
                            "INSERT INTO [dbo].[product_categories] (product_id, category_id) VALUES (:productId, :categoryId)"
                    ).setParameter("productId", product.getProductId())
                    .setParameter("categoryId", request.getCategoryId())
                    .executeUpdate();

            entityManager.flush();
        }

        // ===== UPDATE INVENTORY QUANTITY (ONLY FOR EXISTING VARIANTS) =====
        if (request.getQuantity() != null) {
            // Get existing variants (don't create new one)
            List<ProductVariants> existingVariants = productVariantsRepository.findByProducts(product);

            if (!existingVariants.isEmpty()) {
                // Update inventory for first variant
                ProductVariants firstVariant = existingVariants.get(0);

                Inventory inventory = inventoryRepository.findByVariantVariantId(firstVariant.getVariantId())
                        .orElseGet(() -> {
                            Inventory newInv = new Inventory();
                            newInv.setVariant(firstVariant);
                            newInv.setReservedQty(0);
                            return newInv;
                        });

                inventory.setStockQty(request.getQuantity());
                inventoryRepository.save(inventory);
            }
            // If no variants exist, skip inventory update
        }

        product = productsRepository.save(product);
        return convertToAdminDetailResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Complete cascade delete order

        // 1. Delete discounts
        entityManager.createNativeQuery(
                "DELETE FROM [dbo].[discounts] WHERE product_id = :productId"
        ).setParameter("productId", product.getProductId()).executeUpdate();

        // 2. Delete reviews
        entityManager.createNativeQuery(
                "DELETE FROM [dbo].[reviews] WHERE product_id = :productId"
        ).setParameter("productId", product.getProductId()).executeUpdate();

        // 3. Get all variants
        List<ProductVariants> variants = productVariantsRepository.findByProducts(product);

        // 4. Delete inventory for each variant
        for (ProductVariants variant : variants) {
            inventoryRepository.findByVariantVariantId(variant.getVariantId())
                    .ifPresent(inventoryRepository::delete);
        }

        // 5. Delete variants
        productVariantsRepository.deleteAll(variants);

        // 6. Delete images
        productImagesRepository.deleteByProducts(product);

        // 7. Delete category associations
        entityManager.createNativeQuery(
                "DELETE FROM [dbo].[product_categories] WHERE product_id = :productId"
        ).setParameter("productId", product.getProductId()).executeUpdate();

        // 8. Finally delete product
        productsRepository.delete(product);
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

    @Transactional
    public ProductAdminDetailResponse toggleProductStatus(Long productId) {
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

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

        productCategoriesRepository.findFirstByProduct(product).ifPresent(pc -> {
            response.setCategoryId(pc.getCategory().getCategoryId());
            response.setCategoryName(pc.getCategory().getName());
        });

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

        List<VariantInfo> variants = productVariantsRepository.findByProducts(product).stream()
                .map(v -> {
                    VariantInfo variantInfo = new VariantInfo();
                    variantInfo.setVariantId(v.getVariantId());
                    variantInfo.setAttributesJson(v.getAttributesJson());
                    variantInfo.setPriceOverride(v.getPriceOverride());
                    variantInfo.setStatus(v.getStatus());
                    variantInfo.setCreatedAt(v.getCreatedAt());
                    return variantInfo;
                })
                .collect(Collectors.toList());
        response.setVariants(variants);

        Integer totalStock = variants.stream()
                .map(v -> {
                    return inventoryRepository.findByVariantVariantId(v.getVariantId())
                            .map(inv -> inv.getStockQty() != null ? inv.getStockQty() : 0)
                            .orElse(0);
                })
                .reduce(0, Integer::sum);
        response.setTotalStock(totalStock);
        response.setQuantity(totalStock);

        return response;
    }

    private String generateSlug(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "product-" + UUID.randomUUID().toString().substring(0, 8);
        }

        return name.toLowerCase()
                .replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a")
                .replaceAll("[èéẹẻẽêềếệểễ]", "e")
                .replaceAll("[ìíịỉĩ]", "i")
                .replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o")
                .replaceAll("[ùúụủũưừứựửữ]", "u")
                .replaceAll("[ỳýỵỷỹ]", "y")
                .replaceAll("[đ]", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}