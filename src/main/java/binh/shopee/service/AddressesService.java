package binh.shopee.service;
import binh.shopee.dto.order.AddressRequest;
import binh.shopee.dto.order.AddressResponse;
import binh.shopee.entity.Addresses;
import binh.shopee.entity.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    // ============================================
    // PHẦN CODE MỚI - THÊM TỪ ĐÂY
    // ============================================
    @Transactional
    public AddressResponse createAddress(Long userId, AddressRequest request) {
        // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetAllDefaultAddresses(userId);
        }
        Users user = new Users();
        user.setUserId(userId);
        Addresses address = Addresses.builder()
                .user(user)
                .recipientName(request.getRecipientName())
                .phone(request.getPhone())
                .street(request.getStreet())
                .ward(request.getWard())
                .district(request.getDistrict())
                .city(request.getCity())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();
        Addresses saved = addressesRepository.save(address);
        return AddressResponse.builder()
                .addressId(saved.getAddressId())
                .recipientName(saved.getRecipientName())
                .phone(saved.getPhone())
                .street(saved.getStreet())
                .ward(saved.getWard())
                .district(saved.getDistrict())
                .city(saved.getCity())
                .isDefault(saved.getIsDefault())
                .build();
    }
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Addresses address = getUserAddress(userId, addressId);
        // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetAllDefaultAddresses(userId);
        }
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setCity(request.getCity());
        address.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);
        Addresses updated = addressesRepository.save(address);
        return AddressResponse.builder()
                .addressId(updated.getAddressId())
                .recipientName(updated.getRecipientName())
                .phone(updated.getPhone())
                .street(updated.getStreet())
                .ward(updated.getWard())
                .district(updated.getDistrict())
                .city(updated.getCity())
                .isDefault(updated.getIsDefault())
                .build();
    }
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Addresses address = getUserAddress(userId, addressId);

        if (Boolean.TRUE.equals(address.getIsDefault())) {
            throw new RuntimeException("Không thể xóa địa chỉ mặc định");
        }

        addressesRepository.delete(address);
    }
    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        Addresses address = getUserAddress(userId, addressId);

        // Bỏ mặc định của tất cả địa chỉ khác
        unsetAllDefaultAddresses(userId);

        // Đặt địa chỉ này làm mặc định
        address.setIsDefault(true);
        addressesRepository.save(address);
    }
    private void unsetAllDefaultAddresses(Long userId) {
        List<Addresses> addresses = addressesRepository.findAll();
        addresses.stream()
                .filter(a -> a.getUser().getUserId().equals(userId) && Boolean.TRUE.equals(a.getIsDefault()))
                .forEach(a -> {
                    a.setIsDefault(false);
                    addressesRepository.save(a);
                });
    }
}
