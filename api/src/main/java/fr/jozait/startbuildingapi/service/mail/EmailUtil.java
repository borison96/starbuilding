package fr.jozait.startbuildingapi.service.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.internet.MimeMessage;

@Service
public class EmailUtil {
    Logger logger = LoggerFactory.getLogger(this.getClass());
    private final JavaMailSender mailSender;
    private MimeMessageHelper messageHelper;
    private MimeMessage mimeMessage;
    @Autowired
    private TemplateEngine templateEngine;
    @Value("${spring.application.name}")
    private String appName;

    @Autowired
    public EmailUtil(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(String template, Context ctx, String subject, EmailAddress to) {
        send(template, ctx, subject, new EmailAddress("admin@joza-if.fr", appName), to);
    }
    public void send(String template, Context ctx, String subject, EmailAddress from, EmailAddress to) {
        Thread thread = new Thread(() -> {
            synchronized (mailSender) {
                try {
                    this.mimeMessage = this.mailSender.createMimeMessage();
                    this.messageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");
                    logger.info("Sending email to: {} ", to);
                    ctx.setVariable("appName", appName);
                    String content = templateEngine.process(template, ctx);
                    messageHelper.setFrom(from.toInternetAddress());
                    messageHelper.setTo(to.toInternetAddress());
                    messageHelper.setSubject(subject);
                    messageHelper.setText(content, true);
                    mailSender.send(mimeMessage);
                    logger.info("Email Sent");
                } catch (Exception ignored) {
                }
            }
        });
        thread.start();
    }
}
