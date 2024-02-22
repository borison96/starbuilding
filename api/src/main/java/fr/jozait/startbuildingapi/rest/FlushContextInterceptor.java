package fr.jozait.startbuildingapi.rest;

import fr.jozait.startbuildingapi.domain.model.org.OrganisationContext;
import fr.jozait.startbuildingapi.security.AppSecurityContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FlushContextInterceptor implements HandlerInterceptor {
    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler, Exception ex) throws Exception {
        // flush security
        AppSecurityContextHolder.clearPrincipal();
        // flush org context
        OrganisationContext.clearId();
    }
}
