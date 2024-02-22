package fr.jozait.startbuildingapi.config;

import com.google.common.base.Predicates;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Value("${spring.application.name}")
    private String appName;
    @Value("${spring.application.version}")
    private String appVersion;
    @Bean
    public Docket api() {
        HashSet<String> jsonSet = new HashSet<>(Collections.singletonList("application/json"));
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .consumes(jsonSet)
                .produces(jsonSet)
                .globalOperationParameters(
                        Arrays.asList(
                                new ParameterBuilder()
                                        .name("Authorization")
                                        .description("Security token")
                                        .modelRef(new ModelRef("string"))
                                        .parameterType("header")
                                        .required(false)
                                        .build(),
                                new ParameterBuilder()
                                        .name("Organisation")
                                        .description("Organisation Id to contextualise this request")
                                        .modelRef(new ModelRef("string"))
                                        .parameterType("header")
                                        .required(false)
                                        .build()
                        )
                )
                .select()
                .apis(RequestHandlerSelectors.basePackage("fr.jozait.startbuildingapi.rest"))
                .paths(PathSelectors.any())
                .paths(Predicates.not(PathSelectors.regex("/error.*")))
                .paths(Predicates.not(PathSelectors.regex("/actuator.*")))
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfo(
                this.appName,
                "Application pour JOZA IT",
                this.appVersion,
                "www.joza-it.fr",
                new Contact("Nicolas Le Coz","www.joza-it.fr", "nicolas.lecoz@joza-it.fr"),
                "",
                "",
                Collections.emptyList()
        );
    }
}
