// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 2.4 (Giải pháp 2, ORM)
//
// Cần một MySQL thật. Dựng nhanh bằng Docker (chờ vài chục giây để MySQL khởi động):
//
//   docker run --name blog-mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=shop -p 3306:3306 -d mysql:8
//   docker exec blog-mysql sh -c 'until mysql -uroot -psecret -e "SELECT 1" >/dev/null 2>&1; do sleep 2; done'
//
//   npm install @prisma/client @prisma/adapter-mariadb && npm install -D prisma
//   export DATABASE_URL="mysql://root:secret@127.0.0.1:3306/shop"
//   npx prisma db push          # tạo bảng Product từ schema.prisma
//   npx prisma generate         # sinh client vào ./generated
//   node injection/prisma/sql-prisma.js
//   # findUnique(id=1): {"id":1,"name":"Ao thun"}
//
// findUnique sinh prepared statement dưới nền: id đi vào query như tham số, không ghép chuỗi.

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("./generated/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { id: 1, name: "Ao thun" },
      { id: 2, name: "Quan jean" },
      { id: 3, name: "Non" },
    ],
  });

  // id được truyền như tham số, không ghép chuỗi
  const product = await prisma.product.findUnique({ where: { id: 1 } });
  console.log("findUnique(id=1):", JSON.stringify(product));

  await prisma.$disconnect();
}

main();
