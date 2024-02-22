package fr.jozait.startbuildingapi.service.org;

import fr.jozait.startbuildingapi.domain.model.org.OrganisationContext;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class OrgHeaderFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // set the organisation in the context
        OrganisationContext.setId(null);
        String orgId = ((HttpServletRequest) servletRequest).getHeader("organisation");
        try {
            OrganisationContext.setId(Long.parseLong(orgId));
        } catch (Exception ignored) {

        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
