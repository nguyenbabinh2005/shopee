package binh.shopee.controller;

import binh.shopee.entity.FlashSales;
import binh.shopee.service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flash-sales")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    /**
     * Flash sale đang diễn ra
     */
    @GetMapping("/active")
    public List<FlashSales> getActiveFlashSales() {
        return flashSaleService.getActiveFlashSales();
    }

    /**
     * Flash sale sắp diễn ra
     */
    @GetMapping("/upcoming")
    public List<FlashSales> getUpcomingFlashSales() {
        return flashSaleService.getUpcomingFlashSales();
    }
}
