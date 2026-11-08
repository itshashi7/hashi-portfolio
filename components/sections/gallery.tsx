"use client";

import { useRef } from "react";
import { useReveal } from "@/components/ui/use-reveal";
import { stagger } from "@/lib/tokens";
import { RequestLifecycle } from "@/components/widgets/request-lifecycle";
import { CacheGauge } from "@/components/widgets/cache-gauge";
import { LogTail } from "@/components/widgets/log-tail";
import { LatencyChart } from "@/components/widgets/latency-chart";
import { CircuitBreaker } from "@/components/widgets/circuit-breaker";
import { CloudLanes } from "@/components/widgets/cloud-lanes";

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { each: stagger.cards });
  return (
    <section ref={root} aria-labelledby="gallery-title" className="container-site section-gap">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <h2 id="gallery-title" data-reveal className="text-h2 text-ink wdth-heading lg:col-span-9">
          Services I build talk over REST and queues, cache in Redis, and run across three clouds.
        </h2>
        <p data-reveal className="text-body text-ink-muted lg:col-span-3 lg:self-end">
          Six small working demos of the ideas behind that work. The data is illustrative, not from any real system.
        </p>
      </div>
      <div className="mt-12 columns-1 gap-4 md:columns-2 xl:columns-3">
        <RequestLifecycle />
        <LogTail />
        <CacheGauge />
        <CircuitBreaker />
        <LatencyChart />
        <CloudLanes />
      </div>
    </section>
  );
}
