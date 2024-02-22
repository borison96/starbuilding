package fr.jozait.startbuildingapi.util;

import fr.jozait.startbuildingapi.domain.model.user.User;
import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpHeaders;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class AppUtils {
  public static HttpHeaders createAuthHeader(String username, String password) {
    return new HttpHeaders(){{
      String auth = username + ":" + password;
      byte[] encodeAuth = Base64.encodeBase64(
        auth.getBytes(StandardCharsets.US_ASCII)
      );
      String authHeader = "Basic " + new String(encodeAuth);
      set("Authorization", authHeader);
    }};
  }
  public static HttpHeaders createBearerHeader(String token) {
    return new HttpHeaders(){{
      String authHeader = "Bearer " + token;
      set("Authorization", authHeader);
    }};
  }
  public static class QueryString {
    public static String fromMap(Map<String, String> params) {
      if (params != null && !params.isEmpty()) {
        String query = String.format("?%s", params.entrySet().stream().map(
                e -> e.getKey() + "=" + e.getValue() + "&"
        ).collect(Collectors.joining("")));
        return query.contains("&") ? query.substring(0, query.length() - 1) : query;
      }
      return "";
    }
  }
  public static String getServerHost() throws URISyntaxException {
    URI uri = new URI(ServletUriComponentsBuilder.fromCurrentRequest().toUriString());
    String scheme = uri.getScheme();
    if (uri.getPort() == 80 || uri.getPort() == 443 || uri.getPort() <= 0) {
      return scheme + "://" + uri.getHost();
    }
    return scheme + "://" + uri.getHost() + ":" + uri.getPort();
  }
  public static String getUserNameForMail(User user) {
    StringBuilder sb = new StringBuilder();
    if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) sb.append(user.getFirstName());
    if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) {
      if (sb.length() > 0) sb.append(" ");
      sb.append(user.getLastName());
    }
    if (sb.length() == 0) sb.append(user.getEmail());
    return sb.toString();
  }
  public static File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
    File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));
    try (FileOutputStream fileOutputStream = new FileOutputStream(file);) {
      fileOutputStream.write(multipartFile.getBytes());
    }
    return file;
  }
}
