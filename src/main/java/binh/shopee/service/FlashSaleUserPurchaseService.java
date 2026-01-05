package binh.shopee.service;

import binh.shopee.entity.FlashSaleUserPurchase;
import binh.shopee.entity.FlashSales;
import binh.shopee.entity.Users;
import binh.shopee.repository.FlashSaleUserPurchaseRepository;
import binh.shopee.repository.FlashSalesRepository;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FlashSaleUserPurchaseService {

    private final FlashSaleUserPurchaseRepository purchaseRepository;
    private final FlashSalesRepository flashSalesRepository;
    private final UsersRepository usersRepository;

    private static final int MAX_QUANTITY_PER_USER = 2;

    public int getAvailableQuantityForUser(Long flashSaleId, Long userId) {
        Integer purchased = purchaseRepository.getTotalPurchasedByUserAndFlashSale(flashSaleId, userId);
        int remaining = MAX_QUANTITY_PER_USER - purchased;
        return Math.max(0, remaining);
    }

    public boolean canUserPurchase(Long flashSaleId, Long userId, int quantity) {
        int available = getAvailableQuantityForUser(flashSaleId, userId);
        return quantity <= available;
    }

    @Transactional
    public void recordPurchase(Long flashSaleId, Long userId, int quantity) {
        if (!canUserPurchase(flashSaleId, userId, quantity)) {
            throw new RuntimeException("Bạn chỉ được mua tối đa " + MAX_QUANTITY_PER_USER + " sản phẩm Flash Sale này");
        }

        FlashSales flashSale = flashSalesRepository.findById(flashSaleId)
                .orElseThrow(() -> new RuntimeException("Flash Sale không tồn tại"));

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Optional<FlashSaleUserPurchase> existingRecord = purchaseRepository
                .findByFlashSaleIdAndUserId(flashSaleId, userId);

        if (existingRecord.isPresent()) {
            FlashSaleUserPurchase record = existingRecord.get();
            record.setPurchasedQuantity(record.getPurchasedQuantity() + quantity);
            purchaseRepository.save(record);
        } else {
            // Tạo record mới
            FlashSaleUserPurchase newRecord = FlashSaleUserPurchase.builder()
                    .flashSale(flashSale)
                    .user(user)
                    .purchasedQuantity(quantity)
                    .build();
            purchaseRepository.save(newRecord);
        }
    }
}