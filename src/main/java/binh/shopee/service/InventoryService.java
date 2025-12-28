package binh.shopee.service;
import binh.shopee.entity.Inventory;
import binh.shopee.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public int getAvailableQuantity(Long variantId) {
        return inventoryRepository.getAvailableQuantity(variantId);
    }
    @Transactional
    public void reserveStock(Long variantId, Integer quantity) {
        int updated = inventoryRepository.reserveStock(variantId, quantity);
        if (updated == 0) {
            throw new RuntimeException("Không đủ hàng để đặt đơn cho variant: " + variantId);
        }
    }
    @Transactional
    public void reduceStock(Long variantId, Integer quantity) {

        int availableQty = getAvailableQuantity(variantId);
        if (availableQty < quantity) {
            throw new RuntimeException(
                        "Không đủ tồn kho"
                );
        }
        Inventory inventory = inventoryRepository.findByVariantVariantId(variantId)
                .orElseThrow(() -> new RuntimeException("Inventory không tồn tại"));
        inventory.setStockQty(availableQty - quantity);
        inventoryRepository.save(inventory);
    }
    @Transactional
    public void restoreInventory(Long variantId, Integer quantity) {
        Inventory inventory = inventoryRepository.findByVariantVariantId(variantId)
                .orElseThrow(() -> new RuntimeException("Inventory không tồn tại"));
        inventory.setReservedQty(
                Math.max(0, inventory.getReservedQty() - quantity)
        );
        inventory.setStockQty(inventory.getStockQty() + quantity);
        inventoryRepository.save(inventory);
    }

}
