package binh.shopee.service;
import binh.shopee.dto.admin.OrderAdminResponse;
import binh.shopee.entity.Orders;
import binh.shopee.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class AdminOrdersService {

    private final OrdersRepository ordersRepository;
    public Page<OrderAdminResponse> getOrders(int page, int size, String status, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Orders> orders = ordersRepository.findAll(pageable);

        return orders.map(order -> {
            OrderAdminResponse response = new OrderAdminResponse();
            response.setOrderId(order.getOrderId());
            response.setOrderNumber(order.getOrderNumber());
            response.setCustomerName(order.getUser().getFullName());
            response.setTotalAmount(order.getGrandTotal());
            response.setStatus(order.getStatus().name());
            response.setCreatedAt(order.getCreatedAt());
            response.setItemCount(order.getItems() != null ? order.getItems().size() : 0);
            return response;
        });
    }
    public OrderAdminResponse getOrderDetail(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderAdminResponse response = new OrderAdminResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getUser().getFullName());
        response.setTotalAmount(order.getGrandTotal());
        response.setStatus(order.getStatus().name());
        response.setCreatedAt(order.getCreatedAt());
        response.setItemCount(order.getItems() != null ? order.getItems().size() : 0);
        return response;
    }
    @Transactional
    public void updateOrderStatus(Long id, String status) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // FIXED: Convert status string to correct enum
        // Valid values: pending, processing, shipped, delivered, canceled
        order.setStatus(Orders.OrderStatus.valueOf(status.toLowerCase()));
        ordersRepository.save(order);
    }
}