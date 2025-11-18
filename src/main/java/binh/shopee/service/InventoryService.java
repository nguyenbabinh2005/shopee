package binh.shopee.service;

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
    public void reserveStock(Long variantId, int quantity) {
        int updated = inventoryRepository.reserveStock(variantId, quantity);
        if (updated == 0) {
            throw new RuntimeException("Không đủ hàng để đặt đơn cho variant: " + variantId);
        }
    }
}
