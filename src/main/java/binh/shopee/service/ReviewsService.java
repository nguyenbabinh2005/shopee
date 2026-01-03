package binh.shopee.service;
import binh.shopee.dto.review.ReviewCreateRequest;
import binh.shopee.dto.review.ReviewResponse;
import binh.shopee.entity.Orders;
import binh.shopee.entity.Products;
import binh.shopee.entity.Reviews;
import binh.shopee.entity.Users;
import binh.shopee.repository.OrdersRepository;
import binh.shopee.repository.ProductsRepository;
import binh.shopee.repository.ReviewsRepository;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ReviewsService {
    private final ReviewsRepository reviewsRepository;
    private final UsersRepository usersRepository;
    private final ProductsRepository productsRepository;
    private final OrdersRepository ordersRepository;
    /**
     * Check if user can review a product from a specific order
     */
    public boolean canUserReviewProduct(Long userId, Long productId, Long orderId) {
        // 1. Check if order exists and belongs to user
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getUserId().equals(userId)) {
            return false;
        }
        // 2. Check if order is delivered
        if (order.getStatus() != Orders.OrderStatus.delivered) {
            return false;
        }
        // 3. Check if product is in this order
        boolean productInOrder = order.getItems().stream()
                .anyMatch(item -> item.getVariant().getProducts().getProductId().equals(productId));
        if (!productInOrder) {
            return false;
        }
        // 4. Check if already reviewed
        return reviewsRepository.findByUserAndProductAndOrder(userId, productId, orderId)
                .isEmpty();
    }
    /**
     * Create a new review
     */
    @Transactional
    public ReviewResponse createReview(ReviewCreateRequest request) {
        // Validate
        if (!canUserReviewProduct(request.getUserId(), request.getProductId(), request.getOrderId())) {
            throw new RuntimeException("Cannot review this product");
        }
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        // Get entities
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Products product = productsRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Orders order = ordersRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        // Create review
        Reviews review = Reviews.builder()
                .users(user)
                .products(product)
                .order(order)
                .rating(request.getRating())
                .title(request.getTitle())
                .content(request.getContent())
                .status("approved") // Auto-approve
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .build();
        Reviews savedReview = reviewsRepository.save(review);
        return mapToResponse(savedReview);
    }
    /**
     * Get all reviews by a user - FIXED: Use new method name
     */
    public List<ReviewResponse> getUserReviews(Long userId) {
        return reviewsRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    /**
     * Get all approved reviews for a product
     */
    public List<ReviewResponse> getProductReviews(Long productId) {
        return reviewsRepository.findByProducts_ProductIdAndStatus(productId, "approved")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    /**
     * Map entity to response DTO
     */
    private ReviewResponse mapToResponse(Reviews review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .productId(review.getProducts().getProductId())
                .productName(review.getProducts().getName())
                .userId(review.getUsers() != null ? review.getUsers().getUserId() : null)
                .username(review.getUsers() != null ? review.getUsers().getUsername() : "Anonymous")
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .status(review.getStatus())
                .createdAt(review.getCreated_at())
                .updatedAt(review.getUpdated_at())
                .build();
    }
}