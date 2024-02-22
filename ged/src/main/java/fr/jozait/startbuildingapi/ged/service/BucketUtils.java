package fr.jozait.startbuildingapi.ged.service;

public class BucketUtils {
    public static String safeDirAndFileName(String name) {
        return name.replaceAll("[^\\w\\/\\-_\\.]+", "_");
    }
}
