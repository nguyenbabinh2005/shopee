package binh.shopee.service;
import binh.shopee.entity.Inventory;
import binh.shopee.entity.ProductVariants;
import binh.shopee.repository.InventoryRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductVariantsService {
    @Autowired
    private final ProductVariantsRepository variantRepo;
    @Autowired
    private final InventoryRepository inventoryRepo;

    /**
     * Lấy số lượng tồn kho khả dụng của một variant
     * @param variantId id của ProductVariant
     * @return số lượng khả dụng
     */
    public int getAvailableQuantity(Long variantId) {
        // 1️⃣ Lấy variant
        ProductVariants variant = variantRepo.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể sản phẩm"));

        // 2️⃣ Lấy tồn kho
        Inventory inventory = inventoryRepo.findByVariantVariantId(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho"));

        // 3️⃣ Tính số lượng khả dụng
        int availableQty = inventory.getStockQty() - inventory.getReservedQty();
        return availableQty; // đảm bảo không âm
    }
}