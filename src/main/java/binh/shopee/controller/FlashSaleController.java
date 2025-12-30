package binh.shopee.controller;

import binh.shopee.dto.flashsale.FlashSaleResponse;
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
    @GetMapping("/active")
    public List<FlashSaleResponse> getActiveFlashSales() {
        return flashSaleService.getActiveFlashSales();
    }
    @GetMapping("/upcoming")
    public List<FlashSaleResponse> getUpcomingFlashSales() {
        return flashSaleService.getUpcomingFlashSales();
    }
}
