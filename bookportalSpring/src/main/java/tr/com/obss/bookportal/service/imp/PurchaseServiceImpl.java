package tr.com.obss.bookportal.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tr.com.obss.bookportal.dto.ReportDto;
import tr.com.obss.bookportal.model.Purchase;
import tr.com.obss.bookportal.repository.PurchaseRepository;
import tr.com.obss.bookportal.service.PurchaseService;

import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private PurchaseRepository purchaseRepository;

    @Autowired
    public PurchaseServiceImpl(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    @Override
    public void add(Purchase purchase) {
        this.purchaseRepository.save(purchase);
    }

    @Override
    public void delete(Purchase purchase) {
        this.purchaseRepository.delete(purchase);
    }

    @Override
    public void update(Purchase purchase) {
        this.purchaseRepository.save(purchase);
    }

    @Override
    public Purchase getPurchase(Long purchaseId) {
        return this.purchaseRepository.findById(purchaseId).orElse(null);
    }

    @Override
    public List<Purchase> getAllPurchases() {
        return this.purchaseRepository.findAll();
    }

    @Override
    public List<ReportDto> getAuthorPurchaseReport() {
        return this.purchaseRepository.getAuthorPurchaseReport();
    }

}
