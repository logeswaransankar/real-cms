package com.realestate.aura;

import com.realestate.aura.security.JwtTokenProvider;
import com.realestate.aura.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 3600000L);
    }

    @Test
    void testGenerateAndValidateToken() {
        UserPrincipal principal = new UserPrincipal(
                1L, "admin@elysian-estates.com", "Lord Alexander", null, "password", true,
                List.of(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"))
        );
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        String token = tokenProvider.generateToken(auth);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("admin@elysian-estates.com", tokenProvider.getUsernameFromJwt(token));
    }
}
