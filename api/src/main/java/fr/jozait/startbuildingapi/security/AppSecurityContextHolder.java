package fr.jozait.startbuildingapi.security;

import fr.jozait.startbuildingapi.domain.model.user.Role;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.exception.ApiError;

public class AppSecurityContextHolder {
    private static final ThreadLocal<Principal> principal = new ThreadLocal<>();

    public static Principal getPrincipal() {
        if (principal.get() == null) {
            throw ApiError.USER_UNAUTHORIZED;
        }
        return principal.get();
    }
    public static void setPrincipal(Principal principal) {
        AppSecurityContextHolder.principal.set(principal);
    }
    public static void clearPrincipal() {
        AppSecurityContextHolder.principal.remove();
    }
    public static class Principal {
        User user;
        Role role;

        public Principal(User user, Role role) {
            this.user = user;
            this.role = role;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
        }
    }
}
