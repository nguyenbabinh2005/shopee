package binh.shopee.repository;

import binh.shopee.dto.order.AddressResponse;
import binh.shopee.entity.Addresses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressesRepository extends JpaRepository<Addresses, Long> {
    @Query("""
        SELECT new binh.shopee.dto.order.AddressResponse(
            a.addressId,
            a.recipientName,
            a.phone,
            a.street,
            a.ward,
            a.district,
            a.city,
            a.isDefault
        )
        FROM Addresses a
        WHERE a.user.userId = :userId
        ORDER BY a.isDefault DESC, a.addressId DESC
    """)
    List<AddressResponse> findAddressDtoByUserId(Long userId);
    Addresses findByUser_UserIdAndIsDefaultTrue(Long userId);
}
