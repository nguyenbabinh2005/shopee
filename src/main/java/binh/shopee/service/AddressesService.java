package binh.shopee.service;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.entity.Addresses;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import binh.shopee.repository.AddressesRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressesService {

    private final AddressesRepository addressesRepository;
    public List<AddressResponse> getAddressesByUserId(Long userId) {
        return addressesRepository.findAddressDtoByUserId(userId);
    }
    public Addresses getUserAddress(Long userId, Long addressId) {
        return addressesRepository
                .findByAddressIdAndUser_UserId(addressId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Địa chỉ không tồn tại hoặc không thuộc về user"));
    }
    public AddressResponse getDefaultAddress(Long userId) {

        Addresses address = addressesRepository
                .findByUser_UserIdAndIsDefaultTrue(userId)
                .orElseThrow(() ->
                        new RuntimeException("User chưa có địa chỉ mặc định"));

        return AddressResponse.builder()
                .addressId(address.getAddressId())
                .recipientName(address.getRecipientName())
                .phone(address.getPhone())
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .isDefault(address.getIsDefault())
                .build();
    }
    public AddressResponse getAddressByUser(Long addressId, Long userId) {
        Addresses address = getUserAddress(addressId, userId);
        return AddressResponse.builder()
                .addressId(address.getAddressId())
                .recipientName(address.getRecipientName())
                .phone(address.getPhone())
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .isDefault(address.getIsDefault())
                .build();
    }
}
