package com.realestate.aura.user;

import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public User createUser(User user, List<String> roleNames) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already in use: " + user.getEmail());
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = new HashSet<>();
        if (roleNames != null && !roleNames.isEmpty()) {
            for (String rName : roleNames) {
                RoleName enumName = RoleName.valueOf(rName.startsWith("ROLE_") ? rName : "ROLE_" + rName);
                Role role = roleRepository.findByName(enumName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + rName));
                roles.add(role);
            }
        } else {
            Role defaultRole = roleRepository.findByName(RoleName.ROLE_PROPERTY_MANAGER)
                    .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
            roles.add(defaultRole);
        }
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updateDetails, List<String> roleNames) {
        User user = getUserById(id);

        user.setFullName(updateDetails.getFullName());
        user.setAvatarUrl(updateDetails.getAvatarUrl());
        if (updateDetails.getActive() != null) {
            user.setActive(updateDetails.getActive());
        }
        if (updateDetails.getPassword() != null && !updateDetails.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDetails.getPassword()));
        }

        if (roleNames != null) {
            Set<Role> roles = new HashSet<>();
            for (String rName : roleNames) {
                RoleName enumName = RoleName.valueOf(rName.startsWith("ROLE_") ? rName : "ROLE_" + rName);
                Role role = roleRepository.findByName(enumName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + rName));
                roles.add(role);
            }
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
