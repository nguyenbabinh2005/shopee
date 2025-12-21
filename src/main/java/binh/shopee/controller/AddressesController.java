package binh.shopee.controller;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.service.AddressesService;
import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressesController {

    private final AddressesService addressesService;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        List<AddressResponse> addresses =
                addressesService.getAddressesByUserId(user.getUser().getUserId());

        return ResponseEntity.ok(addresses);
    }
}
