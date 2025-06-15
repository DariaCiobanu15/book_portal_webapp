package tr.com.obss.bookportal.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDto {
    private String authorName;
    private String authorSurname;
    private Long totalPurchases;
    private Double averagePrice;
    private Double numberOfPages;
}
