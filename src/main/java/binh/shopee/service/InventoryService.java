package binh.shopee.service;

import binh.shopee.dto.order.OrderItemRequest;
import binh.shopee.entity.Inventory;
import binh.shopee.entity.ProductVariants;
import binh.shopee.repository.InventoryRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductVariantsRepository variantRepo;

    public int getAvailableQuantity(Long variantId) {
        return inventoryRepository.getAvailableQuantity(variantId);
    }
    @Transactional
    public void reserveStock(Long variantId, int quantity) {
        int updated = inventoryRepository.reserveStock(variantId, quantity);
        if (updated == 0) {
            throw new RuntimeException("Không đủ hàng để đặt đơn cho variant: " + variantId);
        }
    }
    @Transactional
    public void reduceStock(List<OrderItemRequest> items) {

        for (OrderItemRequest item : items) {

            ProductVariants variant = variantRepo.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException(
                            "Variant không tồn tại: " + item.getVariantId()
                    ));

            int availableQty = getAvailableQuantity(variant.getVariantId());
            if (availableQty < item.getQuantity()) {
                throw new RuntimeException(
                        "Không đủ tồn kho cho SKU: " + variant.getSku()
                );
            }

            // ✅ Trừ tồn kho
            Inventory inventory = inventoryRepository.findByVariantVariantId(variant.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy kho cho variant ID: " + variant.getVariantId()));
            inventory.setStockQty(availableQty - item.getQuantity());
            variantRepo.save(variant);
        }
    }
}
