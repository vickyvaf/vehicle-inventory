package com.vehicle.inventory.controller;

import tools.jackson.databind.ObjectMapper;
import com.vehicle.inventory.model.Product;
import com.vehicle.inventory.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetAllProducts() throws Exception {
        when(productService.getAllProducts()).thenReturn(Arrays.asList(product1, product2));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.size()").value(2))
                .andExpect(jsonPath("$.data[0].brand").value("Brand A"))
                .andExpect(jsonPath("$.data[1].brand").value("Brand B"));

        verify(productService, times(1)).getAllProducts();
    }

    @Test
    void testGetProductsByBrand() throws Exception {
        when(productService.getProductsByBrand("Brand A")).thenReturn(Arrays.asList(product1));

        mockMvc.perform(get("/api/products").param("brand", "Brand A"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.size()").value(1))
                .andExpect(jsonPath("$.data[0].brand").value("Brand A"));

        verify(productService, times(1)).getProductsByBrand("Brand A");
    }

    @Test
    void testGetProductById_Found() throws Exception {
        when(productService.getProductById(1L)).thenReturn(Optional.of(product1));

        mockMvc.perform(get("/api/products/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand").value("Brand A"));

        verify(productService, times(1)).getProductById(1L);
    }

    @Test
    void testGetProductById_NotFound() throws Exception {
        when(productService.getProductById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/{id}", 99L))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).getProductById(99L);
    }

    @Test
    void testCreateProduct() throws Exception {
        when(productService.saveProduct(any(Product.class))).thenReturn(product1);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.brand").value("Brand A"));

        verify(productService, times(1)).saveProduct(any(Product.class));
    }

    @Test
    void testUpdateProduct_Success() throws Exception {
        when(productService.updateProduct(eq(1L), any(Product.class))).thenReturn(product1);

        mockMvc.perform(put("/api/products/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand").value("Brand A"));

        verify(productService, times(1)).updateProduct(eq(1L), any(Product.class));
    }

    @Test
    void testUpdateProduct_NotFound() throws Exception {
        when(productService.updateProduct(eq(99L), any(Product.class)))
                .thenThrow(new RuntimeException("Product not found with id 99"));

        mockMvc.perform(put("/api/products/{id}", 99L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product1)))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).updateProduct(eq(99L), any(Product.class));
    }

    @Test
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/products/{id}", 1L))
                .andExpect(status().isNoContent());

        verify(productService, times(1)).deleteProduct(1L);
    }
}
