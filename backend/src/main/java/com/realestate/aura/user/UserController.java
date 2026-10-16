package com.realestate.aura.user;

import com.realestate.aura.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "Admin Users & RBAC", description = "Management of users, roles, and administrative permissions")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "List all administrative and staff users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user details by ID")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }

    public static class CreateUserRequest {
        public String email;
        public String password;
        public String fullName;
        public String avatarUrl;
        public List<String> roles;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create a new user with specific roles (SUPER_ADMIN only)")
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setEmail(request.email);
        user.setPassword(request.password);
        user.setFullName(request.fullName);
        user.setAvatarUrl(request.avatarUrl);
        User created = userService.createUser(user, request.roles);
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update an existing user (SUPER_ADMIN only)")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @RequestBody CreateUserRequest request) {
        User user = new User();
        user.setFullName(request.fullName);
        user.setAvatarUrl(request.avatarUrl);
        user.setPassword(request.password);
        User updated = userService.updateUser(id, user, request.roles);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete user (SUPER_ADMIN only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }
}
