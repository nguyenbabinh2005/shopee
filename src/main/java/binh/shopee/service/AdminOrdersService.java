package binh.shopee.service;
import binh.shopee.dto.admin.OrderAdminResponse;
import binh.shopee.entity.OrderItems;
import binh.shopee.entity.Orders;
import binh.shopee.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AdminOrdersService {
    private final OrdersRepository ordersRepository;
    public Page<OrderAdminResponse> getOrders(int page, int size, String status, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Orders> orders;

        // Apply filters based on status and search
        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL")) {
            // Filter by status
            try {
                Orders.OrderStatus orderStatus = Orders.OrderStatus.valueOf(status.toLowerCase());
                List<Orders> filteredOrders = ordersRepository.findByStatus(orderStatus);

                // Apply search filter if provided
                if (search != null && !search.isEmpty()) {
                    filteredOrders = filteredOrders.stream()
                            .filter(order ->
                                    order.getOrderNumber().toLowerCase().contains(search.toLowerCase()) ||
                                            order.getUser().getFullName().toLowerCase().contains(search.toLowerCase())
                            )
                            .collect(Collectors.toList());
                }

                // Convert List to Page manually
                int start = (int) pageable.getOffset();
                int end = Math.min((start + pageable.getPageSize()), filteredOrders.size());
                List<Orders> pageContent = filteredOrders.subList(start, end);
                orders = new PageImpl<>(pageContent, pageable, filteredOrders.size());

            } catch (IllegalArgumentException e) {
                // Invalid status, return empty page
                orders = Page.empty(pageable);
            }
        } else if (search != null && !search.isEmpty()) {
            // Search only (no status filter)
            List<Orders> allOrders = ordersRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
            List<Orders> searchResults = allOrders.stream()
                    .filter(order ->
                            order.getOrderNumber().toLowerCase().contains(search.toLowerCase()) ||
                                    order.getUser().getFullName().toLowerCase().contains(search.toLowerCase())
                    )
                    .collect(Collectors.toList());

            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), searchResults.size());
            List<Orders> pageContent = searchResults.subList(start, end);
            orders = new PageImpl<>(pageContent, pageable, searchResults.size());
        } else {
            // No filters - get all orders sorted by newest first
            orders = ordersRepository.findAll(pageable);
        }
        return orders.map(this::mapToSummaryResponse);
    }
    public OrderAdminResponse getOrderDetail(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToDetailResponse(order);
    }
    @Transactional
    public void updateOrderStatus(Long id, String status) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        // Convert status string to correct enum
        order.setStatus(Orders.OrderStatus.valueOf(status.toLowerCase()));
        ordersRepository.save(order);
    }
    // Map to summary response (for list view)
    private OrderAdminResponse mapToSummaryResponse(Orders order) {
        OrderAdminResponse response = new OrderAdminResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getUser().getFullName());

        // ✅ FIX: Use subtotal for totalAmount (not grandTotal)
        response.setTotalAmount(order.getGrandTotal());
        response.setShippingFee(order.getShippingFee());
        response.setDiscountAmount(order.getDiscountTotal());
        response.setFinalAmount(order.getGrandTotal());

        response.setStatus(order.getStatus().name());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setItemCount(order.getItems() != null ? order.getItems().size() : 0);

        return response;
    }
    // Map to detail response (for detail view)
    private OrderAdminResponse mapToDetailResponse(Orders order) {
        OrderAdminResponse response = new OrderAdminResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());

        // Customer info
        response.setCustomerName(order.getUser().getFullName());
        response.setCustomerEmail(order.getUser().getEmail());
        response.setCustomerPhone(order.getUser().getPhone());

        // Shipping address
        if (order.getShippingAddress() != null) {
            String fullAddress = String.format("%s, %s, %s, %s",
                    order.getShippingAddress().getStreet(),
                    order.getShippingAddress().getWard(),
                    order.getShippingAddress().getDistrict(),
                    order.getShippingAddress().getCity()
            );
            response.setShippingAddress(fullAddress);
        }

        // ✅ FIX: Use subtotal for totalAmount (not grandTotal)
        response.setTotalAmount(order.getSubtotal());
        response.setShippingFee(order.getShippingFee());
        response.setDiscountAmount(order.getDiscountTotal());
        response.setFinalAmount(order.getGrandTotal());

        response.setStatus(order.getStatus().name());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setNote(order.getNote());

        // Map order items
        if (order.getItems() != null) {
            List<OrderAdminResponse.OrderItemDTO> itemDTOs = order.getItems().stream()
                    .map(this::mapToItemDTO)
                    .collect(Collectors.toList());
            response.setItems(itemDTOs);
            response.setItemCount(itemDTOs.size());
        } else {
            response.setItemCount(0);
        }

        return response;
    }
    // Map OrderItem entity to DTO
    private OrderAdminResponse.OrderItemDTO mapToItemDTO(OrderItems item) {
        OrderAdminResponse.OrderItemDTO dto = new OrderAdminResponse.OrderItemDTO();

        // Get product info from variant
        if (item.getVariant() != null && item.getVariant().getProducts() != null) {
            dto.setProductId(item.getVariant().getProducts().getProductId());
            dto.setProductName(item.getVariant().getProducts().getName());

            // Get image from variant's productImage if available

        } else {
            // Fallback to snapshot if variant not loaded
            dto.setProductId(null);
            dto.setProductName(item.getProductNameSnapshot());
            dto.setImageUrl(null);
        }

        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getUnitPrice());

        // Use the computed total_price column if available, otherwise calculate
        BigDecimal totalPrice = item.getTotalPrice() != null
                ? item.getTotalPrice()
                : item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
        dto.setTotalPrice(totalPrice);

        return dto;
    }
}