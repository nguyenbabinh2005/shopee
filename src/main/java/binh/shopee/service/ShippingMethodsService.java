package binh.shopee.service;
import binh.shopee.dto.order.ShippingMethodResponse;
import binh.shopee.entity.ShippingMethods;
import binh.shopee.repository.ShippingMethodsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingMethodsService {

    private final ShippingMethodsRepository shippingMethodsRepository;

    public List<ShippingMethodResponse> getAvailableShippingMethods() {

        List<ShippingMethods> methods =
                shippingMethodsRepository.findByIsActiveTrue();

        return methods.stream()
                .map(method -> ShippingMethodResponse.builder()
                        .id(method.getShippingMethodId())
                        .name(method.getName())
                        .baseFee(method.getBaseFee())
                        .estimatedDays(method.getEstimatedDays())
                        .build())
                .collect(Collectors.toList());
    }
    public ShippingMethodResponse getDefaultShipping() {

        ShippingMethods shipping = shippingMethodsRepository
                .findFirstByIsActiveTrueOrderByBaseFeeAsc()
                .orElseThrow(() ->
                        new RuntimeException("Không có phương thức vận chuyển khả dụng")
                );

        return ShippingMethodResponse.builder()
                .id(shipping.getShippingMethodId())
                .name(shipping.getName())
                .baseFee(shipping.getBaseFee())
                .estimatedDays(shipping.getEstimatedDays())
                .build();
    }
    public ShippingMethodResponse getById(Long shippingMethodId) {
        ShippingMethods shipping = shippingMethodsRepository
                .findByShippingMethodIdAndIsActiveTrue(shippingMethodId)
                .orElseThrow(() ->
                        new RuntimeException("Phương thức vận chuyển không tồn tại hoặc đã bị khóa"));
        return ShippingMethodResponse.builder()
                .id(shipping.getShippingMethodId())
                .name(shipping.getName())
                .baseFee(shipping.getBaseFee())
                .estimatedDays(shipping.getEstimatedDays())
                .build();
    }

    }
