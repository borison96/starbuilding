package fr.jozait.startbuildingapi.service.forge;


public class BucketDTO {
    private String bucketKey;
    private String bucketOwner;
    private Number createdDate;
    private PermissionAuth permissions;
    private String policyKey;

    public BucketDTO(String bucketKey, String bucketOwner, Number createdDate, String policyKey) {
        this.bucketKey = bucketKey;
        this.bucketOwner = bucketOwner;
        this.createdDate = createdDate;
        this.policyKey = policyKey;
    }

    public BucketDTO() {

    }

    public String getBucketKey() {
        return bucketKey;
    }

    public void setBucketKey(String bucketKey) {
        this.bucketKey = bucketKey;
    }

    public String getBucketOwner() {
        return bucketOwner;
    }

    public void setBucketOwner(String bucketOwner) {
        this.bucketOwner = bucketOwner;
    }

    public Number getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Number createdDate) {
        this.createdDate = createdDate;
    }

    public PermissionAuth getPermissions() {
        return permissions;
    }

    public void setPermissions(PermissionAuth permissions) {
        this.permissions = permissions;
    }

    public String getPolicyKey() {
        return policyKey;
    }

    public void setPolicyKey(String policyKey) {
        this.policyKey = policyKey;
    }

    private class PermissionAuth {
        private String authId;
        private String access;

        public PermissionAuth(String authId, String access) {
            this.authId = authId;
            this.access = access;
        }

        public String getAuthId() {
            return authId;
        }

        public void setAuthId(String authId) {
            this.authId = authId;
        }

        public String getAccess() {
            return access;
        }

        public void setAccess(String access) {
            this.access = access;
        }
    }
}
