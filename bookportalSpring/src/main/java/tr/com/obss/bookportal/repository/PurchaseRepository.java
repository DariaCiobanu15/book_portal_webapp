package tr.com.obss.bookportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tr.com.obss.bookportal.dto.ReportDto;
import tr.com.obss.bookportal.model.Purchase;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserId(Long userId);

    @Query("SELECT new tr.com.obss.bookportal.dto.ReportDto(a.name, a.surName, COUNT(p.id), AVG(p.price), AVG(b.numberOfPages)) " +
            "FROM Purchase p " +
            "JOIN p.author a " +
            "JOIN p.book b " +
            "GROUP BY a.name, a.surName")
    List<ReportDto> getAuthorPurchaseReport();


}
