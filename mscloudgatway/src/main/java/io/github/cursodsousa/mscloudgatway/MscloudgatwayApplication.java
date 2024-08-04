package io.github.cursodsousa.mscloudgatway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
public class MscloudgatwayApplication {

	public static void main(String[] args) {
		SpringApplication.run(MscloudgatwayApplication.class, args);
	}

	@Bean
	public RouteLocator routes(RouteLocatorBuilder builder) {
		// msportal fica no arquivo yml, e o nome da aplicação
		return builder.routes()
		.route(r -> r.path("/api/**").uri("lb://msportal"))
		.route(r -> r.path("/api/**").uri("lb://mscomercialize"))
				.build();
	}

}
