package binh.shopee.controller;
import binh.shopee.dto.review.ReviewCreateRequest;
import binh.shopee.dto.review.ReviewResponse;
import binh.shopee.service.ReviewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewsController {
    private final ReviewsService reviewsService;
    /**
     * Create a new review
     * POST /api/reviews
     */
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewCreateRequest request) {
        try {
            ReviewResponse response = reviewsService.createReview(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    /**
     * Get all reviews by a user
     * GET /api/reviews/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(@PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewsService.getUserReviews(userId);
        return ResponseEntity.ok(reviews);
    }
    /**
     * Get all reviews for a product
     * GET /api/reviews/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewsService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }
    /**
     * Check if user can review a product from an order
     * GET /api/reviews/can-review?userId={userId}&productId={productId}&orderId={orderId}
     */
    @GetMapping("/can-review")
    public ResponseEntity<Map<String, Boolean>> canReview(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Long orderId
    ) {
        boolean canReview = reviewsService.canUserReviewProduct(userId, productId, orderId);
        return ResponseEntity.ok(Map.of("canReview", canReview));
    }
}