package tr.com.obss.bookportal.service;

import tr.com.obss.bookportal.dto.ReportDto;
import tr.com.obss.bookportal.model.Purchase;

import java.util.List;

public interface PurchaseService {
    void add(Purchase purchase);
    void delete(Purchase purchase);
    void update(Purchase purchase);

    Purchase getPurchase(Long purchaseId);
    List<Purchase> getAllPurchases();

    List<ReportDto> getAuthorPurchaseReport();

}
