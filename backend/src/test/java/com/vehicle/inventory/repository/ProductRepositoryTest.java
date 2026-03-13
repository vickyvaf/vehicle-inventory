package com.vehicle.inventory.repository;

import com.vehicle.inventory.model.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import jakarta.persistence.EntityManager;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.test.context.TestPropertySource;

@DataJpaTest
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.generate-ddl=true",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
public class ProductRepositoryTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    private Product createTestProduct(String brand, String type) {
        Product product = new Product();
        product.setBrand(brand);
        product.setType(type);
        product.setStock(10);
        product.setPrice(new BigDecimal("100.00"));
        product.setDescription("Test description");
        return product;
    }

    @Test
    void testSaveAndFindById() {
        Product product = createTestProduct("TestBrand", "TestType");
        Product savedProduct = productRepository.save(product);

        Optional<Product> foundProduct = productRepository.findById(savedProduct.getId());

        assertTrue(foundProduct.isPresent());
        assertEquals("TestBrand", foundProduct.get().getBrand());
    }

    @Test
    void testFindByBrandContainingIgnoreCase() {
        Product product1 = createTestProduct("Samsung", "Smartphone");
        Product product2 = createTestProduct("Apple", "Smartphone");
        Product product3 = createTestProduct("Samsung Galaxy", "Tablet");

        entityManager.persist(product1);
        entityManager.persist(product2);
        entityManager.persist(product3);
        entityManager.flush();

        List<Product> samsungProducts = productRepository.findByBrandContainingIgnoreCase("samsung");

        assertEquals(2, samsungProducts.size());
        assertTrue(samsungProducts.stream().anyMatch(p -> p.getBrand().equals("Samsung")));
        assertTrue(samsungProducts.stream().anyMatch(p -> p.getBrand().equals("Samsung Galaxy")));
    }

    @Test
    void testDeleteProduct() {
        Product product = createTestProduct("BrandToDelete", "Type");
        entityManager.persist(product);
        entityManager.flush();
        Product savedProduct = product;
        
        productRepository.deleteById(savedProduct.getId());
        
        Optional<Product> deletedProduct = productRepository.findById(savedProduct.getId());
        assertFalse(deletedProduct.isPresent());
    }
}
