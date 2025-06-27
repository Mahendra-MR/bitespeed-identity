# Bitespeed Identity Reconciliation API

This project implements an identity reconciliation system that consolidates customer contact information (email, phone number) across multiple records into a unified contact structure.

## Hosted Endpoint

**POST** [`https://bitespeed-identity-0ww5.onrender.com/api/identify`](https://bitespeed-identity-0ww5.onrender.com/api/identify)

---

## Sample Request

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

## Sample Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

---

## How It Works

* Accepts `email` and/or `phoneNumber` as input.
* Searches existing contacts for matching email or phone.
* Links them using the earliest record as the `primary`.
* Creates new records as `secondary` if a new unique email/phone is introduced.
* Ensures deduplication using `linkedId` and `linkPrecedence` fields.

---

## Tech Stack

* **Backend**: Node.js, Express
* **Database**: PostgreSQL (via Docker)
* **ORM**: Prisma
* **Language**: TypeScript

---

## Assumptions Made

* Either `email` or `phoneNumber` must be present in the request.
* The record with the earliest `createdAt` is chosen as `primary`.
* Contacts are deduplicated and linked logically to the primary.

---

## Local Development

### 1. Clone & Install

```bash
git clone https://github.com/Mahendra-MR/bitespeed-identity.git
cd bitespeed-identity
npm install
```

### 2. Start PostgreSQL via Docker

```bash
docker-compose up -d
```

### 3. Migrate DB

```bash
npx prisma migrate dev --name init
```

### 4. Run Server

```bash
npm run dev
```

---

## Environment Variables (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/bitespeed
PORT=3000
```

---

## Example Test Execution

```bash
curl.exe -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d "@test/test1.json"
```

---

## Folder Structure

```
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── utils/
├── test/
│   └── *.json
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── run-tests.ps1
```

---

## Improvements

* Add automated tests (Jest or Supertest)
* Rate limiting to prevent abuse
* UI dashboard for managing and viewing linked identities

---

## Contact

**Built by:** Mahendra M R
**Email:** [mrmahendra1206@gmail.com](mailto:mrmahendra1206@gmail.com)
**Phone:** +91 9606458627
**Portfolio:** [https://mahendra-mr.netlify.app](https://mahendra-mr.netlify.app)

---
