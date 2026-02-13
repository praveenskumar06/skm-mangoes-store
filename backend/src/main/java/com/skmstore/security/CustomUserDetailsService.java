package com.skmstore.security;

import com.skmstore.model.User;
import com.skmstore.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Try phone first, then email (for Google OAuth users without phone)
        User user = userRepository.findByPhone(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + identifier));

        if (!user.getActive()) {
            throw new UsernameNotFoundException("User account is deactivated");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getPhone() != null ? user.getPhone() : user.getEmail(),
                user.getPassword() != null ? user.getPassword() : "",
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}
