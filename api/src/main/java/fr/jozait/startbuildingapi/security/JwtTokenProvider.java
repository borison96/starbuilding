package fr.jozait.startbuildingapi.security;

import fr.jozait.startbuildingapi.exception.ApiError;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class JwtTokenProvider {

  @Autowired
  private AppUserDetailsService appUserDetailsService;
  @Autowired
  private JwtService jwtService;


  public Authentication getAuthentication(String token) {
    UserDetails userDetails = appUserDetailsService.loadUserByUsername(getUsername(token));
    return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
  }

  public String getUsername(String token) {
    JwtService.OAuthResponse response = jwtService.decode(token);
    if (response.getRefresh()) {
      throw ApiError.REFRESH_TOKEN_WRONG_USE;
    }
    return response.getUserName();
  }

  public String resolveToken(HttpServletRequest req) {
    String bearerToken = req.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring("Bearer ".length());
    }
    return null;
  }

  public boolean validateToken(String token) {
    try {
      jwtService.decode(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      throw ApiError.INVALID_TOKEN;
    }
  }

}
