package com.example.comercialize.Utils.genericClass;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public class GenericSpecification {

    public static <T> Specification<T> filterByIdWithJoinList(String joinProperty1, String joinProperty2, String idProperty, List<Integer> values) {
        if (values == null || values.isEmpty()) {
            return (root, query, builder) -> builder.conjunction();
        }

        return (root, query, builder) -> {
            Predicate[] predicates = values.stream()
                    .map(value -> builder.equal(root.join(joinProperty1).join(joinProperty2).get(idProperty), value))
                    .toArray(Predicate[]::new);
            return builder.and(predicates);
        };
    }

    public static <T> Specification<T> filterByProperty(String property, String... values) {
        if (values == null || Arrays.stream(values).toList().contains(null)) {
            return (root, query, builder) -> builder.conjunction();
        }
        return (root, query, builder) -> builder.or(Arrays
                .stream(values)
                .map(value -> builder.like(root.get(property), "%" + value + "%"))
                .toArray(Predicate[]::new));
    }

    public static <T> Specification<T> filterByPropertyInterger(String property, Integer... values) {
        if (values == null || Arrays.stream(values).toList().contains(null)) {
            return (root, query, builder) -> builder.conjunction();
        }
        return (root, query, builder) -> builder.or(Arrays
                .stream(values)
                .map(value -> builder.equal(root.get(property), value ))
                .toArray(Predicate[]::new));
    }


    public static <T> Specification<T> filterByIdWithJoin(String joinProperty, String idProperty, Object... values) {
        if (values == null || Arrays.stream(values).anyMatch(obj -> obj == null ||
                (obj instanceof String && ((String) obj).isEmpty()))) {
            return (root, query, builder) -> builder.conjunction();
        }

        return (root, query, builder) -> builder.or(Arrays
                .stream(values)
                .map(value -> builder.like(root.join(joinProperty).get(idProperty), "%" + value + "%"))
                .toArray(Predicate[]::new));
    }

    public static <T> Specification<T> filterByIdInteger(String joinProperty, String idProperty, Object... values) {
        if (values == null || Arrays.stream(values).anyMatch(obj -> obj == null ||
                (obj instanceof String && ((String) obj).isEmpty()))) {
            return (root, query, builder) -> builder.conjunction();
        }

        return (root, query, builder) -> builder.or(Arrays
                .stream(values)
                .map(value -> builder.equal(root.join(joinProperty).get(idProperty), value))
                .toArray(Predicate[]::new));
    }

    public static <T> Specification<T> filterByDate(String dateProperty, LocalDateTime date) {
        return (root, query, builder) -> {
            Path<LocalDateTime> datePath = root.get(dateProperty);
            query.distinct(true);
            query.orderBy(builder.asc(builder.function("date_trunc", LocalDate.class, builder.literal("day"), datePath)));
            return builder.equal(builder.function("date_trunc", LocalDate.class, builder.literal("day"), datePath), date.toLocalDate());
        };
    }
}
