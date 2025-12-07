-- Ensure each user has at most one row per metric to simplify upserts
CREATE UNIQUE INDEX `result_userId_metric_key` ON `result`(`userId`, `metric`);
