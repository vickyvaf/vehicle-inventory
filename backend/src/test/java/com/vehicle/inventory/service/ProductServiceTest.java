package com.vehicle.inventory.service;

import com.vehicle.inventory.model.Product;
import com.vehicle.inventory.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        product1 = new Product();
        product1.setId(1L);
        product1.setBrand("Brand A");
        product1.setType("Type X");
        product1.setStock(10);
        product1.setPrice(new BigDecimal("100.00"));
        product1.setDescription("Description 1");

        product2 = new Product();
        product2.setId(2L);
        product2.setBrand("Brand B");
        product2.setType("Type Y");
        product2.setStock(20);
        product2.setPrice(new BigDecimal("200.00"));
        product2.setDescription("Description 2");
    }

    @Test
    void testGetAllProducts() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2));

        List<Product> products = productService.getAllProducts();

        assertEquals(2, products.size());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void testGetProductsByBrand() {
        when(productRepository.findByBrandContainingIgnoreCase("Brand A")).thenReturn(Arrays.asList(product1));

        List<Product> products = productService.getProductsByBrand("Brand A");

        assertEquals(1, products.size());
        assertEquals("Brand A", products.get(0).getBrand());
        verify(productRepository, times(1)).findByBrandContainingIgnoreCase("Brand A");
    }

    @Test
    void testGetProductById_Found() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));

        Optional<Product> result = productService.getProductById(1L);

        assertTrue(result.isPresent());
        assertEquals("Brand A", result.get().getBrand());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Product> result = productService.getProductById(99L);

        assertFalse(result.isPresent());
        verify(productRepository, times(1)).findById(99L);
    }

    @Test
    void testSaveProduct() {
        when(productRepository.save(any(Product.class))).thenReturn(product1);

        Product result = productService.saveProduct(product1);

        assertNotNull(result);
        assertEquals("Brand A", result.getBrand());
        verify(productRepository, times(1)).save(product1);
    }

    @Test
    void testUpdateProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(product1);

        Product updatedDetails = new Product();
        updatedDetails.setBrand("Updated Brand");
        updatedDetails.setType("Updated Type");
        updatedDetails.setStock(15);
        updatedDetails.setPrice(new BigDecimal("150.00"));
        updatedDetails.setDescription("Updated Description");

        Product result = productService.updateProduct(1L, updatedDetails);

        assertNotNull(result);
        assertEquals("Updated Brand", result.getBrand());
        assertEquals("Updated Type", result.getType());
        assertEquals(15, result.getStock());
        assertEquals(new BigDecimal("150.00"), result.getPrice());
        assertEquals("Updated Description", result.getDescription());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(product1);
    }

    @Test
    void testUpdateProduct_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        Product updatedDetails = new Product();

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(99L, updatedDetails);
        });

        assertEquals("Product not found with id 99", exception.getMessage());
        verify(productRepository, times(1)).findById(99L);
        verify(productRepository, times(0)).save(any(Product.class));
    }

    @Test
    void testDeleteProduct() {
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).deleteById(1L);
    }
}
