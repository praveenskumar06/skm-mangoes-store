package com.skmstore.service;

import com.skmstore.dto.request.AddressRequest;
import com.skmstore.exception.BusinessException;
import com.skmstore.exception.ResourceNotFoundException;
import com.skmstore.model.Address;
import com.skmstore.model.User;
import com.skmstore.repository.AddressRepository;
import com.skmstore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class AddressService {

    private static final List<String> ALLOWED_STATES = Arrays.asList(
            "Tamil Nadu", "Pondicherry", "Puducherry", "Karnataka"
    );

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate delivery zone
        boolean validState = ALLOWED_STATES.stream()
                .anyMatch(s -> s.equalsIgnoreCase(request.getState()));
        if (!validState) {
            throw new BusinessException("Delivery is available only in: " + String.join(", ", ALLOWED_STATES));
        }

        // If this is the first address or marked as default, handle defaults
        if (request.getIsDefault() != null && request.getIsDefault()) {
            addressRepository.findByUserId(userId).forEach(a -> {
                a.setIsDefault(false);
                addressRepository.save(a);
            });
        }

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);

        // If first address, make it default
        if (addressRepository.findByUserId(userId).isEmpty()) {
            address.setIsDefault(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new BusinessException("Address does not belong to the user");
        }

        addressRepository.delete(address);
    }
}
