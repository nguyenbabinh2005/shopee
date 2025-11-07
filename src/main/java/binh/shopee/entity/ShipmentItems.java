package binh.shopee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ShipmentItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_item_id")
    private Long shipmentItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    private Shipments shipments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItems orderItems;

    @Column(nullable = false)
    private Integer quantity;
}
