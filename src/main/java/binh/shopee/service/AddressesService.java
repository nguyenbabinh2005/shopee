package binh.shopee.service;
import binh.shopee.dto.order.AddressResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import binh.shopee.repository.AddressesRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressesService {

    private final AddressesRepository repo;
    public List<AddressResponse> getAddressesByUserId(Long userId) {
        return repo.findAddressDtoByUserId(userId);
    }
}
