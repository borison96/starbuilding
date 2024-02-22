package fr.jozait.startbuildingapi.config;


import fr.jozait.startbuildingapi.security.JwtTokenFilterConfigurer;
import fr.jozait.startbuildingapi.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.error.OAuth2AccessDeniedHandler;

import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter  {
    private PasswordEncoder passwordEncoder;
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    @Qualifier("appUserDetailsService")
    public void setUserDetailsService(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        // Apply JWT
        http.apply(new JwtTokenFilterConfigurer(jwtTokenProvider));
        http
                .cors()
                .and()
                .authorizeRequests()
                .antMatchers("/api/v*/public/**").permitAll()
                .antMatchers("/api/**").authenticated()
                .antMatchers("*.bundle.*").permitAll()
                .antMatchers("/**").permitAll();
        // If a user try to access a resource without having enough permissions
        http.exceptionHandling().accessDeniedHandler((req, res, ex) -> {
            ex.printStackTrace();
            res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User is unauthorized");
        });
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .antMatchers("/api/v*/public/**")
                .antMatchers(
                        "/#/**", "/favicon.ico", "/*.js","/*.json",
                        "/*.css", "/*.html", "/assets/**", "/static/**",
                        "/*.woff?", "/*.ttf", "/*.js.*", "/*.*g")
                .antMatchers("/swagger-resources/**", "/swagger-ui.html", "/configuration/**")
                .antMatchers(
                        "/", "/**/*.html", "/webjars/**","/**/*.js", "/**/*.css",
                        "/swagger-*/**", "/v2/api-docs", "/csrf");
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
    @Bean
    PasswordEncoder passwordEncoder() {
        if (Objects.isNull(passwordEncoder)) {
            passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }
        return passwordEncoder;
    }
}
