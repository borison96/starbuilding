package fr.jozait.startbuildingapi.security;

import fr.jozait.startbuildingapi.domain.model.user.Role;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.repository.RoleRepository;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("appUserDetailsService")
@Transactional
public class AppUserDetailsService implements UserDetailsService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findFirstByEmail(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Role role = new Role();
            if (user.getRoleId() != null) {
                role = roleRepository.findById(user.getRoleId()).orElse(role);
            }
            AppSecurityContextHolder.setPrincipal(new AppSecurityContextHolder.Principal(user, role));
            return new org.springframework.security.core.userdetails.User(
                    username, username, true, true, true, true,
                    getGrantedAuthorities(
                            role.getAuthorities() == null ? Arrays.asList("user.update", "user.read") :
                                    Arrays.asList(role.getAuthorities().split(","))
                    )
            );
        }
        AppSecurityContextHolder.setPrincipal(null);
        throw new UsernameNotFoundException("Username: " + "not found");
    }
    private List<GrantedAuthority> getGrantedAuthorities(List<String> authorities) {
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
