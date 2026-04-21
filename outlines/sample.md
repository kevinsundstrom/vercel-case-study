# Vector databases for production RAG: Pinecone vs. Weaviate vs. Qdrant vs. pgvector

## Audience
Senior engineers evaluating a vector store for a production RAG application on the Vercel platform. They are familiar with embeddings and retrieval concepts but have not yet committed to a vendor.

## Angle
Most comparisons stop at benchmark numbers. This article focuses on the operational questions: what breaks at scale, what the pricing model punishes, and which constraints are architectural versus just current limitations.

## Sections

### 1. The four options and where they sit
- Pinecone: managed cloud service, serverless and pod-based tiers
- Weaviate: open-source with a managed cloud option (Weaviate Cloud)
- Qdrant: open-source with a managed cloud option (Qdrant Cloud)
- pgvector: Postgres extension, runs on any Postgres host (Neon, Supabase, RDS, etc.)

### 2. Query latency and throughput
- p50 / p99 ANN search latency at 1M, 10M, and 100M vectors
- Effect of index type: HNSW vs. IVF vs. flat
- Filtering behavior: pre-filter vs. post-filter and when it matters
- Cite actual benchmark sources (ANN-benchmarks, vendor-published numbers, or third-party studies)

### 3. Pricing model breakdown
- Pinecone serverless: per-read-unit and per-write-unit pricing, what a read unit is
- Pinecone pods: fixed capacity, pod types (s1, p1, p2), cost per pod-hour
- Weaviate Cloud: pricing tiers, what "dimensions stored" means in practice
- Qdrant Cloud: RAM-based pricing, cluster sizing
- pgvector: no vector-store cost, just Postgres compute + storage; Neon and Supabase free tiers

### 4. Operational model
- Who manages index health, replication, and backups
- Horizontal scaling: does the managed service handle it or do you size upfront
- Multi-tenancy patterns: namespace isolation, per-tenant indexes, metadata filtering
- Cold start behavior (especially relevant for serverless Pinecone)

### 5. Integration with the Vercel stack
- Edge-compatible clients vs. Node.js-only SDKs
- Connection pooling requirements for pgvector on Neon/Supabase from serverless functions
- Official SDK versions and language support (TypeScript SDK maturity)
- Vercel AI SDK integration points, if any

### 6. When to reach for each
- Pinecone serverless: best fit, worst fit
- Weaviate: best fit, worst fit
- Qdrant: best fit, worst fit
- pgvector: best fit, worst fit (include the "just use pgvector" argument and its limits)

### 7. Decision framework
- A table: dimensions × options (latency, cost model, ops burden, multi-tenancy, Vercel fit)
- The two most common mistakes engineers make when choosing
