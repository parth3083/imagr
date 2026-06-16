Here is your complete planning guide for setting up Prometheus and Grafana monitoring for the imagr project:

---

Monitoring Architecture Overview

Five components total (on top of your existing app + MongoDB):

1. Your app — instrumented with prom-client to expose /api/metrics
2. node_exporter — host OS metrics (CPU, memory, disk)
3. mongodb_exporter — MongoDB server-level stats
4. prometheus — scrapes & stores all metrics
5. grafana — visualization + alerting

---

Part 1 — App Instrumentation (prom-client)

Install prom-client in apps/web. Create a metricsPlugin (Elysia plugin) that:

- Exposes GET /api/metrics (unauthenticated but protected by a METRICS_SECRET bearer token via Authorization header)
- Calls collectDefaultMetrics({ prefix: 'nodejs\_' }) once at module init

Metrics to register:

┌────────────────────────────────────┬───────────┬────────────────────────────┬───────────────────────┐
│ Metric │ Type │ Labels │ Purpose │
├────────────────────────────────────┼───────────┼────────────────────────────┼───────────────────────┤
│ http_request_duration_seconds │ Histogram │ method, route, status_code │ p50/p95/p99 latency │
├────────────────────────────────────┼───────────┼────────────────────────────┼───────────────────────┤
│ http_requests_total │ Counter │ method, route, status_code │ RPS + error rate │
├────────────────────────────────────┼───────────┼────────────────────────────┼───────────────────────┤
│ ai_operation_duration_seconds │ Histogram │ operation │ Gemini call durations │
├────────────────────────────────────┼───────────┼────────────────────────────┼───────────────────────┤
│ ai_operation_errors_total │ Counter │ operation, error_type │ AI failure rate │
├────────────────────────────────────┼───────────┼────────────────────────────┼───────────────────────┤
│ mongodb_operation_duration_seconds │ Histogram │ collection, operation │ Per-query DB latency │
└────────────────────────────────────┴───────────┴────────────────────────────┴───────────────────────┘

Use Elysia's onRequest/onAfterHandle lifecycle hook pair to record HTTP metrics. Hook into Mongoose's pre/post hooks for MongoDB metrics.

▎ Gotcha: Initialize the Registry and metrics as module-level singletons outside the Elysia constructor to survive Next.js hot-reloads in dev mode.

---

Part 2 — prometheus.yml

Place at docker/prometheus.yml. Mount it read-only into the Prometheus container.

Global settings:
scrape_interval: 15s
evaluation_interval: 15s
scrape_timeout: 10s

Four scrape jobs:

┌──────────────────┬───────────────────────┬──────────────┬──────────┐
│ Job │ Target │ metrics_path │ Interval │
├──────────────────┼───────────────────────┼──────────────┼──────────┤
│ imagr-app │ imagr:3001 │ /api/metrics │ 15s │
├──────────────────┼───────────────────────┼──────────────┼──────────┤
│ mongodb-exporter │ mongodb-exporter:9216 │ /metrics │ 30s │
├──────────────────┼───────────────────────┼──────────────┼──────────┤
│ node-exporter │ node-exporter:9100 │ /metrics │ 15s │
├──────────────────┼───────────────────────┼──────────────┼──────────┤
│ prometheus │ localhost:9090 │ /metrics │ 30s │
└──────────────────┴───────────────────────┴──────────────┴──────────┘

For imagr-app, add authorization: { type: Bearer, credentials: <METRICS_SECRET> }.

Alerting rules (in docker/alert-rules.yml, referenced via rule_files):

┌─────────────────┬────────────────────────────────────────┬──────────┐
│ Alert │ Condition │ Severity │
├─────────────────┼────────────────────────────────────────┼──────────┤
│ HighErrorRate │ 5xx rate > 5% over 5m │ critical │
├─────────────────┼────────────────────────────────────────┼──────────┤
│ HighLatencyP95 │ p95 > 2s over 5m │ warning │
├─────────────────┼────────────────────────────────────────┼──────────┤
│ AppInstanceDown │ up{job="imagr-app"} == 0 for 1m │ critical │
├─────────────────┼────────────────────────────────────────┼──────────┤
│ MongoDBDown │ up{job="mongodb-exporter"} == 0 for 1m │ critical │
├─────────────────┼────────────────────────────────────────┼──────────┤
│ HighMemoryUsage │ Available memory < 15% for 10m │ warning │
├─────────────────┼────────────────────────────────────────┼──────────┤
│ DiskSpaceLow │ Available disk < 10% for 5m │ critical │
└─────────────────┴────────────────────────────────────────┴──────────┘

---

Part 3 — Docker Compose Additions

Add these four services to your existing docker/docker-compose.yml:

node-exporter (prom/node-exporter:latest) — mount /proc, /sys, / as read-only. Expose port 9100 internally only.

mongodb-exporter (percona/mongodb_exporter:0.44) — connect with --mongodb.uri=mongodb://database:27017 --collect-all. Expose 9216 internally.
Depends on your DB service.

prometheus (prom/prometheus:v3.4.0) — mount your prometheus.yml + alert-rules.yml read-only, named volume prometheus_data:/prometheus. Publish port
9090:9090 to host. Add flags --storage.tsdb.retention.time=30d --web.enable-lifecycle.

grafana (grafana/grafana:11.6.0) — named volume grafana_data:/var/lib/grafana. Publish 3000:3000. Set env vars:

- GF_SECURITY_ADMIN_PASSWORD (from your .env)
- GF_USERS_ALLOW_SIGN_UP=false

Add prometheus_data and grafana_data to your top-level volumes block.

---

Part 4 — Grafana Dashboard Setup

Data Source: After docker compose up, go to Connections > Data Sources > Add Prometheus. URL: http://prometheus:9090 (Docker DNS, not localhost).

Community dashboards to import (via Dashboards > Import > grafana.com ID):

┌────────────────────────────┬───────┬─────────────────────────────────────┐
│ Dashboard │ ID │ Covers │
├────────────────────────────┼───────┼─────────────────────────────────────┤
│ Node Exporter Full │ 1860 │ CPU, memory, disk, network │
├────────────────────────────┼───────┼─────────────────────────────────────┤
│ MongoDB Overview (Percona) │ 2583 │ Connections, ops/sec, query latency │
├────────────────────────────┼───────┼─────────────────────────────────────┤
│ Node.js Application │ 11159 │ Heap, GC, event loop lag │
└────────────────────────────┴───────┴─────────────────────────────────────┘

Custom Imagr dashboard — panels to build:

- Row 1 — Traffic: rate(http_requests_total[5m]) by route; total RPS stat; requests by status code bar chart
- Row 2 — Latency: p50/p95/p99 time series + latency heatmap using http_request_duration_seconds_bucket
- Row 3 — Error Rate: rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) \* 100 — threshold warn at 1%, alert at 5%
- Row 4 — AI Operations: avg Gemini call duration by operation; AI errors in last hour
- Row 5 — MongoDB (App-Level): avg query duration by collection + operation from your Mongoose plugin
- Row 6 — Node.js Runtime: heap used vs size (memory leaks); event loop lag gauge; GC pause duration

Alerting: Define rules in Grafana under Alerting > Alert rules using the same PromQL expressions. Add a contact point (Slack webhook or ntfy.sh)
under Contact points, then route to it via Notification policies.

---

Implementation Order

1. Add prom-client, write the metrics plugin, verify GET /api/metrics works locally
2. Add METRICS_SECRET to your .env and .env.example
3. Write docker/prometheus.yml + docker/alert-rules.yml
4. Add the 4 new services to docker/docker-compose.yml
5. docker compose up → verify all targets show UP at http://localhost:9090/targets
6. Import the 3 community dashboards in Grafana
7. Build your custom application dashboard
8. Set up alert contact points last
