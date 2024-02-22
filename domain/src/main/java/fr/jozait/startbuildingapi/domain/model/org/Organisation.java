package fr.jozait.startbuildingapi.domain.model.org;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.jozait.startbuildingapi.domain.model.BaseEntityWithAudit;
import fr.jozait.startbuildingapi.domain.model.JsonWrapper;
import fr.jozait.startbuildingapi.domain.model.project.Project;
import fr.jozait.startbuildingapi.domain.model.user.User;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@JsonIgnoreProperties({ "createdAt", "updatedAt", "version"})
public class Organisation extends BaseEntityWithAudit {
    private Long creatorId;
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private JsonWrapper<Set<OrgJoinRequest>> joinRequests = new JsonWrapper<>(new HashSet<>());
    private String name;
    private String code;
    private String description;
    private String picture;
    private String address;
    private String corporateName;
    private String sector;
    private String legalStructure;
    private String postalCode;
    private String town;
    private String region;
    private String country;

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public JsonWrapper<Set<OrgJoinRequest>> getJoinRequests() {
        return joinRequests;
    }

    public void setJoinRequests(JsonWrapper<Set<OrgJoinRequest>> joinRequests) {
        this.joinRequests = joinRequests;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCorporateName() {
        return corporateName;
    }

    public void setCorporateName(String corporateName) {
        this.corporateName = corporateName;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getLegalStructure() {
        return legalStructure;
    }

    public void setLegalStructure(String legalStructure) {
        this.legalStructure = legalStructure;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
