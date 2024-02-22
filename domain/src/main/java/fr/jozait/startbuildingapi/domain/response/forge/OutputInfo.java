package fr.jozait.startbuildingapi.domain.response.forge;

import java.util.Arrays;
import java.util.List;

public class OutputInfo {
    private Region destination;
    private List<Format> formats;

    public OutputInfo() {
        this.destination = new Region();
        Format format = new Format();
        this.formats = Arrays.asList(format);
    }

    private class Region {
        private String region;

        public Region() {
            this.region = "us";
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }
    }

    private class Format {
        private String type;
        private List<String> views;

        public Format() {
            this.type = "svf";
            this.views = Arrays.asList("2d", "3d");
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public List<String> getViews() {
            return views;
        }

        public void setViews(List<String> views) {
            this.views = views;
        }
    }

    public Region getDestination() {
        return destination;
    }

    public void setDestination(Region destination) {
        this.destination = destination;
    }

    public List<Format> getFormats() {
        return formats;
    }

    public void setFormats(List<Format> formats) {
        this.formats = formats;
    }
}
