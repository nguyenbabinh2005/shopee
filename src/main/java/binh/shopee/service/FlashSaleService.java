package binh.shopee.service;

import binh.shopee.entity.FlashSales;
import binh.shopee.repository.FlashSalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSalesRepository flashSalesRepository;

    public List<FlashSales> getActiveFlashSales() {
        return flashSalesRepository.findActiveFlashSales(
                FlashSales.FlashSaleStatus.active,
                LocalDateTime.now()
        );
    }

    public List<FlashSales> getUpcomingFlashSales() {
        return flashSalesRepository.findUpcomingFlashSales(
                FlashSales.FlashSaleStatus.upcoming,
                LocalDateTime.now()
        );
    }
}
