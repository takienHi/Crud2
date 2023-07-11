# Rest api với Json-server

## 1.Tạo dự án

**npm**: `npm init`

**yarn**: `yarn init`

## json-server vào vào project

**npm**: `npm i json-server` `npm i --save-dev nodemon`

**yarn**: `yarn add json-server` `yarn add -D nodemon`

### Tạo một scripts trong package.json để chạy cho môi trường dev

`"dev": "nodemon main.js"`

### Tạo file main.js

```js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// Use default router
server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
```

### Vậy là việc cài đặt đã xong

Chạy lệnh:
**npm:** `npm run dev`
**yarn:** `yarn dev`

### Kết quả chúng ta đã có dữ liệu khi truy cập địa chỉ

- Localhost: [http://localhost:3000/api/products](http://localhost:8000/api/products/).

## 2.Tạo các REST API cho các chức năng CRUD

### method Get

**Get all products**:

- [http://localhost:3000/api/products](http://localhost:8000/api/products/)

**Phân trang** thêm `?_page=1&_limit=10`

- [http://localhost:3000/api/products?\_page=1&\_limit=10](http://localhost:8000/api/products?_page=1&_limit=10)

### Cài thêm query-string để hiển thị thêm page, limit, totalRows

**npm:** `npm i query-string`
**yarn:** `yarn add query-string`

- Thêm đoạn code sau vào main.js

```js
router.render = (req, res) => {
  const headers = res.getHeaders();
  const totalCount = headers['x-total-count'];
  if (req.originalMethod === 'GET' && totalCount) {
    const queryParams = queryString.parse(req._parsedOriginalUrl.query);
    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCount),
      },
    };
    return res.jsonp(result);
  }
  res.jsonp(res.locals.data);
};
```

<img src="./vidu.png" with="100%" style='border-radius: 10px; margin-bottom: 20px '/>

### POST: Tạo một product mới

- Với cái api có phương thức POST, PUT, PATCH chúng ta sẽ tự động cập nhật thời gian tạo, cập nhật tương ứng.

```js
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === 'PATCH' || req.method === 'PUT') {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});
```

## json-server Filtering

- Lọc theo properties
  Ví dụ lọc theo !category=electronics :
  [http://localhost:8000/api/products/?category=electronics](http://localhost:8000/api/products/?category=electronics)

<img src="./loccategory

- Lọc .jpg" with="100%" style='border-radius: 10px; margin-bottom: 20px '/>

- Lọc properties cấp 2
  Ví dụ lọc theo discount.type=shipping :
  [http://localhost:8000/api/products/?category=electronics&discount.type=shipping](http://localhost:8000/api/products/?category=electronics&discount.type=shipping)

## json-server Sorting

- Thêm `?_sort={property}` sau url Ví dụ sort products theo price đây là sort mặc định ASC
  `http://localhost:8000/api/products/?_sort=price`
  [http://localhost:8000/api/products/?\_sort=price](http://localhost:8000/api/products/?_sort=price)

- Khi thêm thuộc tính `?_sort={property}&_order=(asc & desc)`
  ví dụ xắp xếp theo Price giảm dần :
  `http://localhost:8000/api/products/?_sort=price&_order=desc`
  [http://localhost:8000/api/products/?\_sort=price&\_order=desc](http://localhost:8000/api/products/?_sort=price&_order=desc)

### Sorting nhiều properties

`http://localhost:8000/api/products/?_sort=price,category&_order=desc,asc`
[http://localhost:8000/api/products/?\_sort=price,category&\_order=desc,asc](http://localhost:8000/api/products/?_sort=price,category&_order=desc,asc)

### Operators

**\_gte and \_lte**:

- Lớn hơn hoặc bằng (greater than or equal): `_gte` và nhỏ hơn hoặc bằng (less than or equal)`_lte`
- Ví dụ tìm product có 2000 >= price <= 6000
  `http://localhost:8000/api/products?price_gte=2000&price_lte=6000`
  [http://localhost:8000/api/products?price_gte=2000&price_lte=6000](http://localhost:8000/api/products?price_gte=2000&price_lte=6000)

**\_ne**:

- Không bằng (not equal) phủ định của một biểu thức
  Ví dụ lấy product không thuộc category=fitness
  `http://localhost:8000/api/products?category_ne=fitness`
  [http://localhost:8000/api/products?category_ne=fitness](http://localhost:8000/api/products?category_ne=fitness)

**\_like**:

- Lọc ra phần tử gần đúng với chuỗi truyền vào:
  Ví dụ lọc product trong category name có chứa kí tự "fu"
  `http://localhost:8000/api/products?category_like=^fu`
  [http://localhost:8000/api/products?category_like=^fu](http://localhost:8000/api/products?category_like=^fu)

## Full text search

- Lọc product qua tất cả properties

ví dụ `http://localhost:8000/api/products?q=ng`
Kết quả Product 6 có category = "gardening", Product 10 có discount.type = "shipping" đều có chuỗi "ng"

```json
[
  {
    "id": 6,
    "title": "Product 6",
    "category": "gardening",
    "price": 5000,
    "description": "This is description about product 6"
  },
  {
    "id": 10,
    "title": "Product 10",
    "category": "electronics",
    "price": 3000,
    "description": "This is description about product 10",
    "discount": {
      "type": "shipping"
    }
  }
]
```

### Relationships

- Chúng ta có thể thấy các mối quan hệ bằng cách sử dụng tham số `_embed` & `_expand`

- **\_embed** kết nối với phẩn tử con
  Ví dụ:
  `http://localhost:8000/api/products?category=electronics&_embed=reviews`
  [http://localhost:8000/api/products?category=electronics&\_embed=reviews](http://localhost:8000/api/products?category=electronics&_embed=reviews)
  kết quả:

```json
[
  {
    "id": 1,
    "title": "Product 1",
    "category": "electronics",
    "price": 4000,
    "description": "This is description about product 1",
    "reviews": [
      {
        "id": 1,
        "rating": 3,
        "comment": "Review 1 for product id 1",
        "productId": 1
      },
      {
        "id": 2,
        "rating": 4,
        "comment": "Review 2 for product id 1",
        "productId": 1
      },
      {
        "id": 3,
        "rating": 4,
        "comment": "Review 3 for product id 1",
        "productId": 1
      }
    ]
  },
  {
    "id": 2,
    "title": "Product 2",
    "category": "electronics",
    "price": 2000,
    "description": "This is description about product 2",
    "reviews": [
      {
        "id": 4,
        "rating": 5,
        "comment": "Review 1 for product id 2",
        "productId": 2
      }
    ]
  },
  {
    "id": 10,
    "title": "Product 10",
    "category": "electronics",
    "price": 3000,
    "description": "This is description about product 10",
    "discount": {
      "type": "shipping"
    },
    "reviews": []
  }
]
```

- **\_expand** kết nối với phần tử cha

url: `http://localhost:8000/api/reviews?_expand=product`
lưu ý phải bỏ s sau products
Kết quả

```json
[
  {
    "id": 1,
    "rating": 3,
    "comment": "Review 1 for product id 1",
    "productId": 1,
    "product": {
      "id": 1,
      "title": "Product 1",
      "category": "electronics",
      "price": 4000,
      "description": "This is description about product 1"
    }
  },
  {
    "id": 2,
    "rating": 4,
    "comment": "Review 2 for product id 1",
    "productId": 1,
    "product": {
      "id": 1,
      "title": "Product 1",
      "category": "electronics",
      "price": 4000,
      "description": "This is description about product 1"
    }
  },
  {
    "id": 3,
    "rating": 4,
    "comment": "Review 3 for product id 1",
    "productId": 1,
    "product": {
      "id": 1,
      "title": "Product 1",
      "category": "electronics",
      "price": 4000,
      "description": "This is description about product 1"
    }
  },
  {
    "id": 4,
    "rating": 5,
    "comment": "Review 1 for product id 2",
    "productId": 2,
    "product": {
      "id": 2,
      "title": "Product 2",
      "category": "electronics",
      "price": 2000,
      "description": "This is description about product 2"
    }
  },
  {
    "id": 5,
    "rating": 3,
    "comment": "Review 1 for product id 3",
    "productId": 3,
    "product": {
      "id": 3,
      "title": "Product 3",
      "category": "books",
      "price": 1000,
      "description": "This is description about product 3"
    }
  }
]
```

### POST Request

- Thêm data vào db.json
  Post `http://localhost:8000/api/products`

Truyền:

```json
{
  "title": "Product 11",
  "category": "Phone",
  "price": 11000,
  "description": "This is description about product 11"
}
```

### PUT, PATCH, DELETE

---

##### PUT

- PUT update toàn bộ fields

PUT `http://localhost:8000/api/products/11`

update title=iPhone 12

```json
{
  "title": "iPhone 12",
  "category": "Phone",
  "price": 11000,
  "description": "This is description about product 11"
}
```

kết quả

```json
{
  "title": "iPhone 12",
  "category": "Phone",
  "price": 11000,
  "description": "This is description about product 11"
}
```

##### PATCH

- PATCH update 1 vài field

PATCH `http://localhost:8000/api/products/11`
Truyền:

```json
{
  "price": 12000
}
```

Kết quả:

```json
{
  "title": "iPhone 12",
  "category": "Phone",
  "price": 12000,
  "description": "This is description about product 11"
}
```

#### DELETE

- DELETE `http://localhost:8000/api/products/11`
  Truyền: `không cần truyền`
  Kết quả: `{}`

### Custom routes

Hãy tưởng tượng chúng ta phải thực hiện các yêu cầu trên một số điểm cuối khác nhau trên API tương lai của chúng ta và các điểm cuối này không có cùng URI:

```json
/api/dashboard
/api/groups/ducks/stats
/auth/users
/rpierlot/articles
```

json-server cho phép chúng tôi chỉ định viết lại tuyến đường. Chúng ta có thể giải quyết vấn đề này bằng cách sử dụng một bản đồ giải quyết các tuyến đường thực tế trong lược đồ json của chúng ta:

```json
{
  "/api/:view": "/:view",
  "/api/groups/:planet/stats": "/stats?planet=:planet",
  "/:user/articles": "/articles?author=:user",
  "/auth/users": "/users"
}
```

So, when we start json-server it shows us the route rewrites we are using :

```json
$ json-server --watch db2.json --routes routes.json

  \{^_^}/ hi!

  Loading db2.json
  Loading routes.json
  Done

  Resources
  http://localhost:3000/users
  http://localhost:3000/dashboard
  http://localhost:3000/stats
  http://localhost:3000/articles

  Other routes
  /api/:view -> /:view
  /api/groups/:planet/stats -> /stats?planet=:planet
  /:user/articles -> /articles?author=:user
  /auth/users -> /users

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
  Watching...
```

Now we can perform our custom requests to see the results:

```json
$ curl http://localhost:3000/api/dashboard
{
  "visits": 3881,
  "views": 625128,
  "shares": 7862
}
```

```json
$ curl http://localhost:3000/api/groups/ducks/stats
[
  {
    "planet": "ducks",
    "stats": {
      "points": 5625,
      "ships": 8
    }
  }
]
```
