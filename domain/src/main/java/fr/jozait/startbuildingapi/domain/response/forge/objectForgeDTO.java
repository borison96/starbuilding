package fr.jozait.startbuildingapi.domain.response.forge;

public class objectForgeDTO {
    private String bucketKey;
    private String objectId;
    private String objectKey;
    private Number size;
    private String contentType;
    private String location;

    public objectForgeDTO(String bucketKey, String objectId, String objectKey, Number size, String contentType, String location) {
        this.bucketKey = bucketKey;
        this.objectId = objectId;
        this.objectKey = objectKey;
        this.size = size;
        this.contentType = contentType;
        this.location = location;
    }

    public objectForgeDTO() {
    }

    public String getBucketKey() {
        return bucketKey;
    }

    public void setBucketKey(String bucketKey) {
        this.bucketKey = bucketKey;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public String getObjectKey() {
        return objectKey;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }

    public Number getSize() {
        return size;
    }

    public void setSize(Number size) {
        this.size = size;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
