package fr.jozait.startbuildingapi.service.mail;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import java.io.UnsupportedEncodingException;

public class EmailAddress {
    private String address;
    private String personal;

    public EmailAddress(String address) {
        this.address = address;
    }
    public EmailAddress(String address, String personal) {
        this(address);
        this.personal = personal;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPersonal() {
        return personal;
    }

    public void setPersonal(String personal) {
        this.personal = personal;
    }
    public InternetAddress toInternetAddress() throws Exception {
        return this.personal == null ?
                new InternetAddress(this.address) :
                new InternetAddress(this.address, this.personal);
    }

    @Override
    public String toString() {
        return "EmailAddress{" +
                "address='" + address + '\'' +
                ", personal='" + personal + '\'' +
                '}';
    }
}
