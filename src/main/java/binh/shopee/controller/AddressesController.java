package binh.shopee.controller;
import binh.shopee.dto.order.AddressRequest;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.service.AddressesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressesController {
    private final AddressesService addressesService;
    // ⭐ THAY ĐỔI: Lấy userId từ query parameter
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(
            @RequestParam Long userId
    ) {
        List<AddressResponse> addresses = addressesService.getAddressesByUserId(userId);
        return ResponseEntity.ok(addresses);
    }
    // ⭐ THAY ĐỔI: Lấy userId từ request body
    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @RequestBody AddressRequestWithUserId request
    ) {
        AddressResponse address = addressesService.createAddress(
                request.getUserId(),
                request.toAddressRequest()
        );
        return ResponseEntity.ok(address);
    }
    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @RequestBody AddressRequestWithUserId request
    ) {
        AddressResponse address = addressesService.updateAddress(
                request.getUserId(),
                addressId,
                request.toAddressRequest()
        );
        return ResponseEntity.ok(address);
    }
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long addressId,
            @RequestParam Long userId
    ) {
        addressesService.deleteAddress(userId, addressId);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{addressId}/set-default")
    public ResponseEntity<Void> setDefaultAddress(
            @PathVariable Long addressId,
            @RequestParam Long userId
    ) {
        addressesService.setDefaultAddress(userId, addressId);
        return ResponseEntity.ok().build();
    }
    // ⭐ DTO MỚI: Bao gồm userId
    @lombok.Data
    public static class AddressRequestWithUserId {
        private Long userId;
        private String recipientName;
        private String phone;
        private String street;
        private String ward;
        private String district;
        private String city;
        private Boolean isDefault;
        public AddressRequest toAddressRequest() {
            return AddressRequest.builder()
                    .recipientName(recipientName)
                    .phone(phone)
                    .street(street)
                    .ward(ward)
                    .district(district)
                    .city(city)
                    .isDefault(isDefault)
                    .build();
        }
    }
}
