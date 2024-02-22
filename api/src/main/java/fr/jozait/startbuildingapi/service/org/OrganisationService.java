package fr.jozait.startbuildingapi.service.org;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.jozait.startbuildingapi.domain.model.JsonWrapper;
import fr.jozait.startbuildingapi.domain.model.org.*;
import fr.jozait.startbuildingapi.domain.model.org.form.CreateOrganisation;
import fr.jozait.startbuildingapi.domain.model.user.User;
import fr.jozait.startbuildingapi.domain.response.org.*;
import fr.jozait.startbuildingapi.exception.ApiError;
import fr.jozait.startbuildingapi.domain.repository.UserRepository;
import fr.jozait.startbuildingapi.domain.repository.org.OrgMemberRelationRepository;
import fr.jozait.startbuildingapi.domain.repository.org.OrgRoleRepository;
import fr.jozait.startbuildingapi.domain.repository.org.OrganisationRepository;
import fr.jozait.startbuildingapi.service.mail.EmailAddress;
import fr.jozait.startbuildingapi.service.mail.EmailUtil;
import fr.jozait.startbuildingapi.util.AppUtils;
import fr.jozait.startbuildingapi.util.UIProps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class OrganisationService {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    private UIProps uiProps;
    private OrganisationRepository organisationRepository;
    private OrgRoleRepository orgRoleRepository;
    private UserRepository userRepository;
    private OrgMemberRelationRepository memberRelationRepository;
    private EmailUtil emailUtil;

    @Autowired
    public void setUiProps(UIProps uiProps) {
        this.uiProps = uiProps;
    }

    @Autowired
    public void setOrganisationRepository(OrganisationRepository organisationRepository) {
        this.organisationRepository = organisationRepository;
    }
    @Autowired
    public void setOrgRoleRepository(OrgRoleRepository orgRoleRepository) {
        this.orgRoleRepository = orgRoleRepository;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setMemberRelationRepository(OrgMemberRelationRepository memberRelationRepository) {
        this.memberRelationRepository = memberRelationRepository;
    }

    @Autowired
    public void setEmailService(EmailUtil emailUtil) {
        this.emailUtil = emailUtil;
    }

    public Organisation createOrganisation(CreateOrganisation form, Long userId) {
        Organisation organisation = new ObjectMapper().convertValue(form, Organisation.class);
        organisation.setCreatorId(userId);
        return organisationRepository.save(organisation);
    }
    public OrgMemberResponse isMemberOf(User user) {
        if (OrganisationContext.getId() == null) throw ApiError.ORGANISATION_NOT_FOUND;
        Organisation organisation = getOrgByIdOrElseThrowApiError(OrganisationContext.getId());
        OrgMemberResponse response = new OrgMemberResponse();
        if (!organisation.getCreatorId().equals(user.getId())) {
            OrgMemberKey orgMemberKey = new OrgMemberKey();
            orgMemberKey.setMemberId(user.getId());
            orgMemberKey.setOrgId(OrganisationContext.getId());
            memberRelationRepository.findById(orgMemberKey).orElseThrow(() -> ApiError.ORGANISATION_NOT_FOUND);
        }
        response.setMember(user);
        response.setOrganisation(organisation);
        return response;
    }
    public OrgJoinRequest requestToJoinOrganisation(Long id, String email) {
        // get organisation
        Organisation org = getOrgByIdOrElseThrowApiError(id);
        User user = getUserByEmailOrElseThrowApiError(email);
        OrgRole orgRole = findRoleByNameOrElseCreate("membre");
        OrgJoinRequest joinRequest = new OrgJoinRequest();
        // create token
        String joinToken = UUID.randomUUID().toString().replaceAll("-","");
        joinRequest.setUserId(user.getId());
        joinRequest.setRoleId(orgRole.getId());
        joinRequest.setUser(user);
        joinRequest.setToken(joinToken);
        // generate link
        try {
            String uiHost = getUIHost().replaceFirst("http:", "https:");
            String link = uiHost + "/organisation/" + org.getId() + "/join_requests?token=" + joinToken;
            joinRequest.setLink(link);
            // send email
            Context ctx = new Context();
            ctx.setVariable("userName", AppUtils.getUserNameForMail(user));
            ctx.setVariable("orgName", org.getName());
            ctx.setVariable("link", link);
            ctx.setVariable("expiresIn", joinRequest.getExpiresInDays() + " jours");
            ctx.setVariable("logoUrl",  uiHost + "/logo.png");
            // creator
            User creator = userRepository.getById(org.getCreatorId());
            emailUtil.send(
                    "org-join-request",
                    ctx,
                    "Nouvelle demande de participation",
                    new EmailAddress(
                            creator.getEmail(),
                            AppUtils.getUserNameForMail(creator)));
        } catch (Exception ignored) {}
        if (org.getJoinRequests() == null) org.setJoinRequests(new JsonWrapper<>(new HashSet<>()));
        org.getJoinRequests().getValues().remove(joinRequest);
        org.getJoinRequests().getValues().add(joinRequest);
        organisationRepository.save(org);
        return joinRequest;
    }

    public Organisation acceptJoinRequest(Long id, String token) {
        Organisation organisation = getOrgByIdOrElseThrowApiError(id);
        OrgJoinRequest joinRequest = processRequest(organisation, token);
        User requester = getUserByIdOrElseThrowApiError(joinRequest.getUserId());
        OrgMemberRelation memberRelation = new OrgMemberRelation();
        OrgMemberKey memberKey = new OrgMemberKey();
        memberKey.setMemberId(requester.getId());
        memberKey.setOrgId(organisation.getId());
        memberRelation.setId(memberKey);
        memberRelation.setOrgRoleId(findRoleByIdOrElseThrowApiError(joinRequest.getRoleId()).getId());
        memberRelationRepository.save(memberRelation);
        organisation.getJoinRequests().getValues().remove(joinRequest);
        // send email
        Context ctx = new Context();
        String uiHost = getUIHost().replaceFirst("http:", "https:");
        String link = uiHost + "/auth/login";
        ctx.setVariable("userName", AppUtils.getUserNameForMail(requester));
        ctx.setVariable("orgName", organisation.getName());
        ctx.setVariable("link", link);
        ctx.setVariable("logoUrl",  uiHost + "/logo.png");
        emailUtil.send(
                "org-join-accepted",
                ctx,
                "Demande de participation " + organisation.getName() + " acceptée",
                new EmailAddress(
                        requester.getEmail(),
                        AppUtils.getUserNameForMail(requester)));
        return organisationRepository.save(organisation);
    }
    public Organisation rejectJoinRequest(Long id, String token) {
        Organisation organisation = getOrgByIdOrElseThrowApiError(id);
        OrgJoinRequest joinRequest = processRequest(organisation, token);
        organisation.getJoinRequests().getValues().remove(joinRequest);
        return organisationRepository.save(organisation);
    }
    public OrgListMemberResponse listMemberOrganisations(Pageable pageable, Long userId) {
        Page<OrgMemberRelation> relationPage = memberRelationRepository.findAllById_MemberId(
                userId, pageable);
        List<OrgMemberRelation> relationList = relationPage.getContent();
        List<Long> roleIds = new ArrayList<>();
        List<Long> orgIds = new ArrayList<>();
        relationList.forEach(r -> {
            roleIds.add(r.getOrgRoleId());
            orgIds.add(r.getId().getOrgId());
        });
        List<OrgRole> roles = orgRoleRepository.findAllById(roleIds);
        List<Organisation> organisations = organisationRepository.findAllById(orgIds);
        OrgListMemberResponse listMemberResponse = new OrgListMemberResponse();
        listMemberResponse.setMemberRoleRelations(relationList);
        listMemberResponse.setRoles(roles);
        listMemberResponse.setPageInfo(relationPage);
        listMemberResponse.setOrganisations(organisations);
        return listMemberResponse;
    }
    public OrgMemberListResponse listMembers(Long id, Pageable pageable, User user) {
        Organisation organisation = getOrgByIdOrElseThrowApiError(id);
        OrgRole orgRole = findRoleByNameOrElseCreate("observateur");
        if (hasOrgRole(user, organisation, orgRole)) {
            Page<OrgMemberRelation> relationPage = memberRelationRepository.findAllById_OrgId(id, pageable);
            List<OrgMemberRelation> relationList = relationPage.getContent();
            List<Long> userIds = new ArrayList<>();
            List<Long> roleIds = new ArrayList<>();
            relationList.forEach(r -> {
                userIds.add(r.getId().getMemberId());
                roleIds.add(r.getOrgRoleId());
            });
            List<User> members = userRepository.findAllById(userIds);
            List<OrgRole> roles = orgRoleRepository.findAllById(roleIds);
            OrgMemberListResponse response = new OrgMemberListResponse();
            response.setMembers(members);
            response.setRoles(roles);
            response.setMemberRoleRelations(relationList);
            response.setPageInfo(relationPage);
            return response;
        }
        throw ApiError.ORGANISATION_NOT_FOUND;
    }
    public Page<Organisation> listOrganisations(Pageable pageable, Long userId) {
        // list organisations I created and also those I have access to
        return organisationRepository.findAllByCreatorIdOrderByIdDesc(
                userId,
                pageable);
    }
    private boolean hasOrgRole(User user, Organisation organisation, OrgRole orgRole) {
        if (organisation.getCreatorId().equals(user.getId())) return true;
        OrgMemberKey orgMemberKey = new OrgMemberKey();
        orgMemberKey.setOrgId(organisation.getId());
        orgMemberKey.setMemberId(user.getId());
        Optional<OrgMemberRelation> memberOptional = memberRelationRepository.findById(orgMemberKey);
        if (memberOptional.isPresent()) {
            return memberOptional.get().getOrgRoleId().equals(orgRole.getId());
        }
        return false;
    }
    private OrgJoinRequest processRequest(Organisation organisation, String token) {
        // get the invitation
        try {
            for (OrgJoinRequest joinRequest: organisation.getJoinRequests().getValues()) {
                if (joinRequest.getToken().equals(token)) {
                    // validate if expired
                    Instant expiresAt = Instant.ofEpochMilli(joinRequest.getCreatedAt())
                            .plus(joinRequest.getExpiresInDays(), ChronoUnit.DAYS);
                    if (Instant.now().isBefore(expiresAt)) return joinRequest;
                    throw ApiError.ORG_JOIN_REQUEST_EXPIRED;
                }
            }
        } catch (Exception ignored) {
        }
        throw ApiError.ORG_JOIN_REQUEST_NOT_FOUND;
    }
    private Organisation getOrgByIdOrElseThrowApiError(Long id) {
        return organisationRepository
                .findById(id)
                .orElseThrow(() -> ApiError.ORGANISATION_NOT_FOUND);
    }
    private User getUserByEmailOrElseThrowApiError(String email) {
        return userRepository.findFirstByEmail(email)
                .orElseThrow(() -> ApiError.USER_NOT_FOUND);
    }
    private User getUserByIdOrElseThrowApiError(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ApiError.USER_NOT_FOUND);
    }
    private OrgRole findRoleByNameOrElseCreate(String name) {
        return orgRoleRepository
                .findFirstByNameIgnoreCase(name)
                .orElseGet(() -> orgRoleRepository.save(new OrgRole(name, "")));
    }
    private OrgRole findRoleByIdOrElseThrowApiError(Long id) {
        return orgRoleRepository
                .findById(id).orElseThrow(() -> ApiError.ORG_ROLE_NOT_FOUND);
    }
    private String getUIHost() {
        String hostProps = uiProps.getHost();
        if (hostProps == null || hostProps.isEmpty() || hostProps.equals("/")) {
            try {
                hostProps = AppUtils.getServerHost();
            } catch (Exception ignored){}
        }
        return hostProps;
    }

}
