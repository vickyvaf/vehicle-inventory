# 🚗 Vehicle Inventory Management System

Sistem manajemen inventaris kendaraan bekas untuk perusahaan otomotif yang menjual kendaraan bekas pakai berbagai merek (Toyota, Daihatsu, dll.) dan tipe (SUV, Sedan, Hatchback, dll.).

---

## ✨ Fitur

- **📋 Tabel Produk** — Menampilkan data inventaris kendaraan lengkap (ID, Merek, Jenis, Stok, Harga, Keterangan, Aksi)
- **➕ Create Produk** — Menambah kendaraan baru ke inventaris
- **✏️ Edit Produk** — Mengubah detail kendaraan yang sudah ada
- **🗑️ Delete Produk** — Menghapus kendaraan dari inventaris
- **🔍 Search** — Pencarian produk berdasarkan merek kendaraan
- **🔄 Sinkronisasi Database** — Semua operasi CRUD terhubung langsung ke database

---

## 🛠️ Tech Stack

| Layer    | Teknologi                    |
|----------|------------------------------|
| Frontend | React.js + TypeScript (Vite) |
| Backend  | Java 17+ (Spring Boot 3)     |
| Database | MySQL 8+                     |
| API      | RESTful API                  |
| Docker   | Docker & Docker Compose      |

---

## 📁 Struktur Project

```
vehicle-inventory/
├── frontend/               # React.js + TypeScript (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Halaman (ProductList, Create, Edit)
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Java Spring Boot
│   ├── src/main/java/
│   │   └── com/vehicle/inventory/
│   │       ├── controller/ # REST Controllers
│   │       ├── model/      # Entity / Model
│   │       ├── repository/ # JPA Repository
│   │       ├── service/    # Business Logic
│   │       └── Application.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── PRD.md                  # Product Requirements Document
└── README.md               # Dokumentasi ini
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/)
- **Bun 1.0+** — [Download](https://bun.sh/)
- **MySQL 8+** — [Download](https://www.mysql.com/)

### 1. Setup Database

```sql
CREATE DATABASE vehicle_inventory;
```

### 2. Backend Setup

```bash
cd backend

# Configure database connection
# Edit src/main/resources/application.properties

# Run the application
./mvnw spring-boot:run
```

Backend akan berjalan di `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
bun install

# Run development server
bun run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 4. Docker Setup (Recommended)

Pastikan Docker dan Docker Compose sudah terinstal di komputer Anda.

```bash
# Build and run all services
docker compose up -d --build
```

Setelah perintah di atas selesai:
- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost:8080/api`
- **Database**: `localhost:3307` (User: `root`, Pass: `rootpassword`)

Untuk mematikan layanan:
```bash
docker compose down
```

---

## 📡 API Endpoints

| Method   | Endpoint                        | Deskripsi                |
|----------|---------------------------------|--------------------------|
| `GET`    | `/api/products`                 | Mengambil semua produk   |
| `GET`    | `/api/products?brand={keyword}` | Search berdasarkan merek |
| `GET`    | `/api/products/{id}`            | Detail produk            |
| `POST`   | `/api/products`                 | Tambah produk baru       |
| `PUT`    | `/api/products/{id}`            | Update produk            |
| `DELETE` | `/api/products/{id}`            | Hapus produk             |

### Contoh Request

**POST** `/api/products`
```json
{
  "brand": "Toyota",
  "type": "SUV",
  "stock": 5,
  "price": 350000000,
  "description": "Toyota Fortuner 2022, kondisi mulus"
}
```

---

## 📸 Screenshots

![View](/images/view.png)
![Create](/images/create.png)
![Edit](/images/edit.png)
![Delete](/images/delete.png)
---

